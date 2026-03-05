---
title: ASP.NET Core 框架基础 - 配置系统 Options 模式
date: 2017-06-01 19:53:44
description: ASP.NET Core 配置系统 Options 模式详解
category: 
- ASP.NET Core
tag: 
- aspnet-core
---

参考资料:
- [Options pattern in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-2.1)
- http://www.cnblogs.com/artech/p/new-config-system-01.html
- [Options Github Source](https://github.com/aspnet/Options)

本文大纲: 
<!-- TOC -->
- [Options 模式](#options-%E6%A8%A1%E5%BC%8F)
    - [配置绑定](#%E9%85%8D%E7%BD%AE%E7%BB%91%E5%AE%9A)
    - [扩展方法 AddOptions](#%E6%89%A9%E5%B1%95%E6%96%B9%E6%B3%95-addoptions)
        - [OptionsManager<TOptions>](#optionsmanagertoptions)
        - [IConfigureOptions<in TOptions>](#iconfigureoptionsin-toptions)
        - [ConfigureOptions<TOptions>](#configureoptionstoptions)
    - [扩展方法 Configure](#%E6%89%A9%E5%B1%95%E6%96%B9%E6%B3%95-configure)
    - [创建 Options 对象](#%E5%88%9B%E5%BB%BA-options-%E5%AF%B9%E8%B1%A1)

<!-- /TOC -->

# Options 模式
在真实的项目中我们大多采用 `Options` 模式来使用配置，`Options` 是配置的逻辑结构在对象层面的体现，通常，可以将一个 `Configuration` 对象绑定为一个 `Options` 对象。这样的绑定称为**「配置绑定」**。

## 配置绑定

`Microsoft.Extensions.Configuration.Binder` 包为 `IConfiguration` 接口定义了 `Bind` 扩展方法，该方法接收一个代表 `Options` 的 `object` 类型的参数，并将 `Configuration` 的配置数据绑定到该对象上。
```csharp
public static class ConfigurationBinder
{
    public static void Bind(this IConfiguration configuration, object instance);
}
```

配置绑定的目标类型可以是一个简单的基元类型，也可以是一个自定义数据类型，还可以是一个数组、集合或者字典类型。上述 `Bind` 方法在进行配置绑定的过程中会根据不同的目标类型采用不同的策略。

`Options` 模式是对依赖注入的应用，通过调用 `IServiceCollection` 扩展方法 `AddOptions` 添加 `Options` 模式的服务注册，再通过 `Configure<TOptions>` 扩展方法配置目标 `Options` 的 T 类型。消费方利用 `ServiceProvider` 得到一个类型为 `IOptions<TOptions>` 的服务对象后，读取 `Value` 属性得到由配置绑定生成的 `TOptions` 实例。
```csharp
IConfiguration config = ...;
FormatOptions options = new ServiceCollection()
    .AddOptions()
    .Configure<FormatOptions>(config.GetSection("Format"))
    .BuildServiceProvider()
    .GetService<IOptions<FormatOptions>>()
    .Value;
```
## 扩展方法 AddOptions
当调用 `IServiceCollection` 的 `AddOptions` 时，该方法对 `IOptions<>` 接口注册一个服务，该服务的实现类型为 `OptionsManager<TOptions>` ，生命周期为 `Singleton`。配置绑定生成的 `Options` 对象最终都是通过 `OptionsManager<TOptions>` 创建的。
```csharp
public static IServiceCollection AddOptions(this IServiceCollection services)
{
    services.TryAdd(ServiceDescriptor.Singleton(typeof(IOptions<>), typeof(OptionsManager<>)));
    return services;
}
```
以下是几个相关类型的定义:
### OptionsManager<TOptions>
```csharp
public class OptionsManager<TOptions> : IOptions<TOptions> where TOptions: class, new()
{
    public OptionsManager(IEnumerable<IConfigureOptions<TOptions>> setups);
    public virtual TOptions Value { get; }
}
```
`OptionsManager<TOptions>` 类型的构造函数接受一个 `IConfigureOptions<TOptions>` 的集合，`Options` 对象的创建体现在 `Value` 属性上。该属性的实现非常简单，它先调用 `TOptions` 类型的默认无参构造函数(`TOptions` 代表的类型必须具有一个默认无参构造函数)创建一个空的 `TOptions` 对象，然后将其传递给构造函数中指定的`ConfigureOptions<TOptions>` 对象逐个进行转换处理。

### IConfigureOptions<in TOptions>
```csharp
public interface IConfigureOptions<in TOptions> where TOptions: class
{
    void Configure(TOptions options);
}
```
`IConfigureOptions<TOptions>` 接口定义了一个唯一的 `Configure` 方法，该方法将 `Options` 对象作为输入参数。

### ConfigureOptions<TOptions>
```csharp
public class ConfigureOptions<TOptions>: IConfigureOptions<TOptions> where TOptions : class, new()
{
    public Action<TOptions> Action { get; private set; }
    public ConfigureOptions(Action<TOptions> action)
    {
        this.Action = action;
    }
    public void Configure(TOptions options)
    {
        this.Action(options);
    }
}
```
`IConfigure<TOptions>` 的默认实现类型 `ConfigureOptions<TOptions>` 在其构造函数中接收一个 `Action<TOptions>` 委托对象，再在 `Configure` 方法中调用该委托实现对 `TOptions` 的操作。

## 扩展方法 Configure
```csharp
public static IServiceCollection Configure<TOptions>(this IServiceCollection services, string name, IConfiguration config, Action<BinderOptions> configureBinder)
            where TOptions : class
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            if (config == null)
            {
                throw new ArgumentNullException(nameof(config));
            }

            return services.AddSingleton<IConfigureOptions<TOptions>>(new NamedConfigureFromConfigurationOptions<TOptions>(name, config, configureBinder));
        }
```
在调用 `IServiceCollection` 的 `Configure` 方法时，其内部注册了一个 `IConfigureOptions<TOptions>` 接口的单例服务，其实际类型为 `NamedConfigureFromConfigurationOptions<TOptions>`，该类型最终继承自 `ConfigureOptions<TOptions>` 类型，并且在其构造函数中声明了一个匿名方法作为 `Action<TOptions>` 的参数传入 `NamedConfigureFromConfigurationOptions<TOptions>` 中，最终实现配置绑定。
```csharp
public NamedConfigureFromConfigurationOptions(string name, IConfiguration config, Action<BinderOptions> configureBinder)
            : base(name, options => config.Bind(options, configureBinder))
```

## 创建 Options 对象
Options 编程模式以两个注册到 `ServiceCollection` 的服务为核心，这两个服务对应的服务接口分别是: 
- `IOptions<TOptions>`: 直接提供最终绑定了配置数据的 `Options` 对象
- `IConfigureOptions<TOptions>`: 在 `Options` 对象返回之前对它实施相应的初始化工作。

这个两个服务分别通过扩展方法 `AddOptions` 和 `Configure` 方法注册到指定的 `ServiceCollection` 中，服务的真实类型分别是 `OptionsManager<TOptions>` 和 `NamedConfigureFromConfigurationOptions<TOptions>`，后者派生于 `ConfigureOptions<TOptions>`。下图所示的 UML 体现了 `Options` 模型中涉及的这些接口／类型以及它们之间的关系。

![对象关系图](./options-uml.png)

