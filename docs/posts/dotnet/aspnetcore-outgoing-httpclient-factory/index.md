---
title: ASP.NET Core 的出站请求客户端
date: 2017-11-08 15:47:21
description: 本文概括了在 ASP.NET Core 中正确使用 HttpClient 的场景
categories: 
- ASP.NET Core
tag: 
- aspnet-core
- polly

---

参考资料:
- [启动 Htpp 请求](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1)

本文索引:
- [前言](#%E5%89%8D%E8%A8%80)
- [用法](#%E7%94%A8%E6%B3%95)
- [配置 HttpMessageHandler](#%E9%85%8D%E7%BD%AE-httpmessagehandler)
- [出站请求中间件](#%E5%87%BA%E7%AB%99%E8%AF%B7%E6%B1%82%E4%B8%AD%E9%97%B4%E4%BB%B6)
- [基于 Polly 的 Handlers](#%E5%9F%BA%E4%BA%8E-polly-%E7%9A%84-handlers)
- [HttpClient 的生存期](#httpclient-%E7%9A%84%E7%94%9F%E5%AD%98%E6%9C%9F)
- [日志记录](#%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95)

## 前言
当应用有对外部 Http 服务有依赖时，通常的做法是在应用内部使用 `HttpClient`。ASP.NET Core 加入了 `HttpClientFactory`，以集中的方式管理 `HttpClient` 及其使用的系统资源。
## 用法
这些用法分别对应于 `services.AddHttpClient()` 方法的几个重载，并且适用于不同的场景:
- 基本用法: `services.AddHttpClient()`
- 命名 `HttpClient`: `services.AddHttpClient(string name, Action<HttpClient> configureClient)`
- 强类型 `HttpClient`: 不再以 `string` 类型参数提供 `key`，而是以单独的服务类型通过依赖注入的方式提供 `HttpClient` 实例，`services.AddHttpClient<TService>`
- 动态 `HttpClient`

## 配置 HttpMessageHandler
在 `services.AddHttpClient` 方法重载中，有一些返回 `IHttpClientBuilder` 实例，该实例可用于进一步对该客户端进行配置:
```csharp
services.AddHttpClient("configured-inner-handler").ConfigurePrimaryHttpMessageHandler(() =>
    {
        return new HttpClientHandler()
        {
            AllowAutoRedirect = false,
            UseDefaultCredentials = true
        };
    });
```
可借由此功能定制出站请求的 `HttpMessageHandler` 或使用 Mock 的处理程序以支持测试。

## 出站请求中间件
`HttpClient` 本身其实是将出站请求交给相应的委托进行处理，可以传入继承自 `HttpMessageHandler` 类型的实例来创建 `HttpClient` 实例。`IHttpClientFactory` 简化了为不同命名 `HttpClient` 注入预期的 `HttpMessageHandler`。可通过继承 `DelegatingHandler` 类型并重写 `SendAsync` 方法来实现 `Handler` 的处理逻辑:
```csharp
public class MyCustomHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // ...
        return await base.SendAsync(request, cancellationToken);
    }
}
```
这样，在添加 `AddHttpClient` 服务时可对其配置相应的 `Handler`:
```csharp
services.AddTransient<MyCustomHandler>();
services.AddHttpClient("Github").AddHttpMessageHandler<MyCustomHandler>();
```
> 值得注意的是，`MyCustomHandler` 必须在 DI 中以瞬时(Transient)生存期注册

可为同一个 `IHttpClientFactory` 多次调用 `AddHttpMessageHandler` 方法，`Handler` 将按照注册的顺序依次执行，这样将形成 `Handler` 链，一个 `Handler` 将包装下一个 `Handler`。与 ASP.NET Core 管道的概念类似，例如:
```csharp
services.AddTransient<SecureRequestHandler>();
services.AddTransient<RequestDataHandler>();

services.AddHttpClient("clientwithhandlers")
    .AddHttpMessageHandler<SecureRequestHandler>()     // This handler is on the outside and called first during the request, last during the response.
    .AddHttpMessageHandler<RequestDataHandler>();      // This handler is on the inside, closest to the request being sent.
```

## 基于 Polly 的 Handlers
`IHttpClientFactory` 通过扩展方法支持与 [Polly](https://github.com/App-vNext/Polly) 的 `Policy` 集成。这些扩展方法定义在 `Microsoft.Extensions.Http.Polly` 包中。

例如，用于从临时故障中重试的 `AddTransientHttpErrorPolicy`，定义了请求失败后最多重试三次，每次尝试间隔 600 ms 的 `Policy`:
```csharp
services.AddHttpClient<UnreliableEndpointCallerService>().AddTransientHttpErrorPolicy(p => p.WaitAndRetryAsync(3, _ => TimeSpan.FromMilliseconds(600)));
```
其他一些扩展方法用于支持 Polly-based 处理程序，例如 `AddPolicyHandler()` 方法:
```csharp
var timeout = Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(10));
var longTimeout = Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(30));

// Run some code to select a policy based on the request
services.AddHttpClient("conditionalpolicy").AddPolicyHandler(request => request.Method == HttpMethod.Get ? timeout : longTimeout);
```
上述代码中，如果出站请求为 GET，则应用 10 秒超时。其他所有 HTTP 方法应用 30 秒超时。

嵌套 Polly 策略以增强功能是很常见的:
```csharp
services.AddHttpClient("multiplepolicies")
    .AddTransientHttpErrorPolicy(p => p.RetryAsync(3))
    .AddTransientHttpErrorPolicy(p => p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
```
上述示例中，添加了两个 Handler。 第一个使用 `AddTransientHttpErrorPolicy` 扩展添加重试策略。若请求失败，最多重试三次。第二个调用 `AddTransientHttpErrorPolicy` 添加断路器策略。如果尝试连续失败了五次，则会阻止后续外部请求 30 秒，并且通过此 `HttpClientFactory` 进行的所有调用都共享同样的线路状态。

## HttpClient 的生存期
每次调用 `IHttpClientFactory.CreateClient` 都会返回一个新的 `HttpClient` 实例。一个命名 `HttpClient` 服务关联一个 `HttpMessageHandler` 实例。`IHttpClientFactory` 将这些 `HttpMessageHandler` 实例汇集到池中，以减少资源消耗。

## 日志记录
由 `IHttpClientFactory` 创建的客户端包含了请求的所有日志消息。单个客户端的管道外部以 `LogicalHandler` 类别来记录消息，而管道内部以 `ClientHandler` 类别记录。
