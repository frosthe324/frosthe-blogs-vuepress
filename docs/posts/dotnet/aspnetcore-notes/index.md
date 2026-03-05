---
title: ASP.NET Core 开发实践汇总
date: 2017-07-31 09:26:45
description: 本文汇总了有关 ASP.NET Core 开发的常见问题和具体应用实践，用作快速开始和参考手册，将长期更新并置顶
top: true
categories: 
- ASP.NET Core
tag: 
- aspnet-core

---

本文索引:
- [ASP.NET Core 的入口点在哪？](#aspnet-core-%E7%9A%84%E5%85%A5%E5%8F%A3%E7%82%B9%E5%9C%A8%E5%93%AA)
  - [Startup 从何而来？](#startup-%E4%BB%8E%E4%BD%95%E8%80%8C%E6%9D%A5)
  - [IStartupFilter 是什么？](#istartupfilter-%E6%98%AF%E4%BB%80%E4%B9%88)
- [使用 ASP.NET Core 2.1 开发 Api Controller](#%E4%BD%BF%E7%94%A8-aspnet-core-21-%E5%BC%80%E5%8F%91-api-controller)
  - [自动 HTTP 400 相应](#%E8%87%AA%E5%8A%A8-http-400-%E7%9B%B8%E5%BA%94)
  - [自动参数源推定](#%E8%87%AA%E5%8A%A8%E5%8F%82%E6%95%B0%E6%BA%90%E6%8E%A8%E5%AE%9A)
  - [Route 特性现在是必须的](#route-%E7%89%B9%E6%80%A7%E7%8E%B0%E5%9C%A8%E6%98%AF%E5%BF%85%E9%A1%BB%E7%9A%84)
  - [ApiBehaviorOptions](#apibehavioroptions)
- [DI 的 Scoped 生存期是什么？](#di-%E7%9A%84-scoped-%E7%94%9F%E5%AD%98%E6%9C%9F%E6%98%AF%E4%BB%80%E4%B9%88)
- [你真的了解中间件吗？](#%E4%BD%A0%E7%9C%9F%E7%9A%84%E4%BA%86%E8%A7%A3%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%90%97)
  - [如何定义中间件？](#%E5%A6%82%E4%BD%95%E5%AE%9A%E4%B9%89%E4%B8%AD%E9%97%B4%E4%BB%B6)
  - [IMiddleware 接口有什么用？](#imiddleware-%E6%8E%A5%E5%8F%A3%E6%9C%89%E4%BB%80%E4%B9%88%E7%94%A8)
- [IFilter 和 Attribute，我该用哪一个？](#ifilter-%E5%92%8C-attribute%E6%88%91%E8%AF%A5%E7%94%A8%E5%93%AA%E4%B8%80%E4%B8%AA)
  - [通过 Attribute 将 Filter 应用到 Controller 和 Action 级别](#%E9%80%9A%E8%BF%87-attribute-%E5%B0%86-filter-%E5%BA%94%E7%94%A8%E5%88%B0-controller-%E5%92%8C-action-%E7%BA%A7%E5%88%AB)
  - [ServiceFilter 和 TypeFilters 又是什么？](#servicefilter-%E5%92%8C-typefilters-%E5%8F%88%E6%98%AF%E4%BB%80%E4%B9%88)
  - [Middleware 还是 Filters？](#middleware-%E8%BF%98%E6%98%AF-filters)

## ASP.NET Core 的入口点在哪？
正常情况下，ASP.NET Core 应用的 `Program` 类型看上去大概如下:
```csharp
public class Program
{
    public static IHostingEnvironment HostingEnvironment { get; set; }
    public static IConfiguration Configuration { get; set; }

    public static void Main(string[] args)
    {
       var webHost = CreateWebHostBuilder(args).Build();
       webHost.Run();
    }
}
```
ASP.NET Core 的 `Main` 方法实际是启动了一个 `WebHost` 的实例，该 `WebHost` 通过一个 `Builder` 对其进行配置，以下是 `CreateWebHostBuilder` 方法的实现:
```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   ///...
               })
               .Configure(app =>
               {
                   //...
               });
```

> 多次调用 `ConfigureServices` 将追加到前一个调用，多次调用 `Configure` 将基于上一个调用。

### Startup 从何而来？
微软认为，调用 `IWebHostBuilder` 的配置方法，诸如 `ConfigureServices` 以及 `Configure` 应该交由单独的类型来控制，于是对 `IWebHostBuilder` 接口添加了扩展方法 `UseStartup<TStartup>`。`TStartup` 可以不实现任何接口，但必须以约定命名的方式命名并实现框架要求的方法：
- 必须包括 `Configure` 方法，以创建应用的请求处理管道。
- 可选择性地包括 `ConfigureServices` 方法。

可以为不同的环境定义对应的 `Startup` 类型(例如 `StartupDevelopment`)，同样基于约定，如果应用在开发环境中运行并包含 `Startup` 类和 `StartupDevelopment` 类，则使用 `StartupDevelopment` 类。详情参考[Startup 类约定](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/environments?view=aspnetcore-2.1#startup-class-conventions)

### IStartupFilter 是什么？
通过其命名可以看出，该接口是一种 `Filter`，用于在 `Startup` 类型外部添加中间件注册，这意味着:
- 在 `StartupFilter` 中注册的中间件将先于 `Startup.Configure` 方法注册的任何中间件执行
- 多个 `IStartupFilter` 接口将按照注册顺序决定中间件的执行顺序
- 可利用外部程序集增强 ASP.NET Core 的功能而不影响其原本的业务逻辑

`IStartupFilter` 仅定义了一个方法:
```csharp
public class RequestSetOptionsStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return builder =>
        {
            builder.UseMiddleware<TMiddleware>();
            next(builder);
        };
    }
}
```
通过 `IWebHostBuilder.ConfigureServices` 方法来注册该 Filter:
```csharp
public static IWebHostBuilder CreateWebHostBuilder(string[] args)
{
  WebHost.CreateDefaultBuilder(args)
      .ConfigureServices(services =>
      {
          services.AddTransient<IStartupFilter, RequestSetOptionsStartupFilter>();
      })
      .UseStartup<Startup>()
      .Build();
}
```

___
## 使用 ASP.NET Core 2.1 开发 Api Controller
ASP.NET Core 2.1 版本新增了部分便于开发 Web Api 的功能。现在，当创建用于 Web Api 的控制器时:
- 从 `ControllerBase` 类继承: Api 控制器类型不再需要继承自传统的 Mvc 控制器 `Controller` 类型，`ControllerBase` 提供了诸如 `BadRequest()`、`CreateAtAction()` 等分别返回相应状态码的行为
- 对类型标注 `ApiController` 特性: ASP.NET Core 2.1 版本引入了 `ApiController` 特性，该特性通常结合 `ControllerBase` 来为控制器启用 REST 的行为。为了确保在控制器级别该特性能够正常工作，需要在 `Startup.ConfigureServices` 方法设置兼容版本:
  ```bash
  services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
  ```

`ApiController` 添加了以下行为:
### 自动 HTTP 400 相应
当模型验证失败时，`ModelState.IsValid` 的计算结果为 `false`，并自动返回包含问题详细信息的 HTTP 400 响应。因此，不再需要以下类似代码:
```bash
if (!ModelState.IsValid)
{
    return BadRequest(ModelState);
}
```

### 自动参数源推定
应用了 `ApiController` 的控制器类，将根据下表隐式推定参数的绑定源:

| FromBody     | 请求正文                   |
|--------------|----------------------------|
| FromForm     | 表单数据                   |
| FromHeader   | 请求头                     |
| FromQuery    | 查询字符串参数             |
| FromRoute    | 路由数据                   |
| FromServices | 作为操作参数插入的请求服务 |

没有 `ApiController` 特性时，需要为入站请求参数显式定义绑定源特性。在下例中，`FromQuery` 特性指示 discontinuedOnly 参数值在请求 URL 的查询字符串中提供:
```csharp
[HttpGet]
public async Task<ActionResult<List<Product>>> GetAsync([FromQuery]bool discontinuedOnly = false)
```

### Route 特性现在是必须的
使用 `ApiController` 特性标注的控制器类型将不再采用 `Startup.Configure` 方法中为 Mvc 程序定义的诸如 `UseMvc().UseMvcWithDefaultRoute` 的约定式路由策略。转而要求必须为每个标注了 `ApiController` 特性的控制器类型添加 `Route` 特性标注。

### ApiBehaviorOptions
上述讨论的默认行为可通过 `ApiBehaviorOptions` 对象启用或禁用，在 `Startup.ConfigureServices` 方法中修改这些配置的值:
```csharp
services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressConsumesConstraintForFormFileParameters = true;
    options.SuppressInferBindingSourcesForParameters = true;
    options.SuppressModelStateInvalidFilter = true;
    options.InvalidModelStateResponseFactory = ...
});
```
具体每项配置的影响可参考 [ApiBehaviorOptions](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.apibehavioroptions?view=aspnetcore-2.1)


___
## DI 的 Scoped 生存期是什么？
初次接触 ASP.NET Core 的开发人员可能对 `Scoped` 生存期心存疑惑: 
- 作用域生存期的服务以每个请求一次的方式创建，即 `instance per HttpContext`
- 默认情况下，在中间件内使用有作用域的服务必须在 `Invoke` 或 `InvokeAsync` 方法参数注入服务，而不要通过构造函数进行注入，因为「按约定激活」的中间件总是以单例创建，在构造函数中注入 `Scoped` 生存期的服务将导致**不一致的状态**。

___
## 你真的了解中间件吗？
中间件的特点是:
- 选择是否将请求传递到管道中的下一个组件
- 可在调用管道中的下一个组件前后执行工作

中间件可定义为匿名委托或创建单独的类型实现，可借助以下方法应用中间件:
- `Run`: 该方法进传入一个 `HttpContext` 参数，指示该中间件总在管道的最后执行
- `Map`: 传入匹配条件，使得中间件在某些条件下执行
- `Use`: 传入参数中包含下一个中间件的引用，如果不调用 `next.Invoke`，可短路管道

### 如何定义中间件？
ASP.NET Core 大量使用了命名约定的方式来隐式定义组件，中间件也不例外，默认情况下，以 `Middleware` 后缀结尾的类型被认为是隐式定义的中间件，该类型必须遵循:
- 构造函数接收一个代表下一个中间件的 `RequestDelegate` 参数注入
- 包含一个 `Task InvokeAsync(HttpContext context)` 的方法签名

> 如前文所述，中间件实例在应用程序启动时创建，如果定义的中间件需要使用 `Scoped` 生存期的服务，则必须在 `Task InvokeAsync(HttpContext context)` 方法的参数列表中添加注入。

随后，框架在 `IStartupFilter` 和 `Startup.Configure` 方法中调用 `IApplicationBuilder.Use<TMiddleware>` 以激活中间件。通常，为了方便使用，会专门为中间件定义 `IApplicationBuilder.Use<Middlware>` 的扩展方法。例如 `IApplicationBuilder.UseMvc()`。

### IMiddleware 接口有什么用？
除了基于命名约定的方式定义和激活中间件，微软提供了 `IMiddleware` 接口用于显式定义中间件并以工厂模式激活中间件。`UseMiddleware` 方法检查中间件的注册类型是否实现了 `IMiddleware` 接口，如果是，则从服务容器中解析 `IMiddlewareFactory` 实例激活中间件，这样做的好处在于:
- 可实现按作用域管理中间件的生存期
- 中间件强类型化

`IMiddleware` 接口定义了 `InvokeAsync(HttpContext, RequestDelegate)` 方法，其实现类可在构造函数中注入 `Scoped` 或 `Singleton` 生存期的服务。同时，基于工厂的中间件在调用 `IApplicationBuilder.UseMiddleware<TMiddleware>` 时不再支持传入参数。

___
## IFilter 和 Attribute，我该用哪一个？
首先要明确一点，`Filter` 是组件，而 `Attribute` 支持以标注方式使用 `Filter` 的一种方式。

`Filter` 在 ASP.NET 中由来已久，ASP.NET Core 中定义了诸多内置 `Filter`，例如 `IActionFilter`, `IResultFilter` 等等，可通过创建实现这些接口的类型或继承现有类型来定义 `Filter`。定义好 `Filter` 之后，便可在 `ConfigureServices` 中注册该 `Filter`，随后便可在 `AddMvc` 方法中以服务或实例的方式对该 `Filter` 进行应用。
```csharp
    services.AddMvc(options => {
        options.Filters.Add(new XXXFilter())
        options.Filters.AddService<TFilter>();
    });
```

### 通过 Attribute 将 Filter 应用到 Controller 和 Action 级别
上述方式展示了在「全局级别」应用 `Filter` 的案例，ASP.NET Core 还提供了在 `Controller` 和 `Action` 级别应用 `Filter` 的方式，这是结合 `Attribute` 和 `IFilterMetadata` 接口实现的。

`IFilterMetadata` 用于标记 `Filter` 类型，该接口未定义任何方法签名，仅仅是告知框架该类型是一个 `Filter`。另一个接口 `IFilterFactory` 派生自 `IFilterMetadata` 接口，进一步告知框架该 `Filter` 的实例应该如何创建。与 `Middleware` 的工厂激活模式相似，这种模式不必在应用程序中显式指定 `Filter` 的创建时机，转而通过引入 `Attribute` 来扮演 `IFilterFactory` 的角色。所以定义的 `FilterAttribute` 通常都实现了 `IFilterFactory` 接口，并在接口方法中返回一个与之对应的真正的 `Filter` 实例。此处的 `Attribute` 实际上是 `Filter` 的提供器。

### ServiceFilter 和 TypeFilters 又是什么？
由于 `Attribute` 在语言层面的限制(必须显式传入构造参数)，它无法通过自身提供有 DI 依赖的 `Filter` 实例，为了解决这个问题，微软提供了 `ServiceFilterAttribute` 和 `TypeFilterAttribute`: 
- `ServiceFilterAttribute`: 通过 `Attribute` 的方式 从 DI 解析目标 `Filter` 类型的实例，该 `Filter` 必须要在 `Startup` 的 `ConfigureServices` 中注册，否则将抛出异常
- `TypeFilterAttribute`: 与 `ServiceFilterAttribute` 类似，但引入的 `Filter` 无需事先在 `Startup` 的 `ConfigureServices` 中注册，且可以部分传入构造函数的参数。

### Middleware 还是 Filters？
中间件在请求抵达 Mvc 之前对请求进行处理，在这里还访问不到任何有关 Mvc 的内容，所以如果不依赖 Mvc 的组件，如 `Routes`, `Actions`, `Controllers` 等，优先使用 `Middleware`，反之使用 `Filters`。另外，`ResourceFilter` 是抵达 Mvc 之前的最后一种 `Filter`，此时它具有最完整的 `HttpContext` `信息。ResourceFilter` 是将 `Middleware` 以 `Filter` 的形式应用到指定 `Controller` 或 `Action` 的最佳选择。
