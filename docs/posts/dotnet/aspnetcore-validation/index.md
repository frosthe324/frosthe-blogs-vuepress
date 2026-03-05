---
title: ASP.NET Core 应用 - 验证
description: ASP.NET Core 验证的最佳实践，阅读微软官网文档的摘抄和心得
date: 2017-07-13 20:21:06
categories: 
- ASP.NET Core
tag: 
- aspnet-core
- aspnet-core-mvc

---

参考资料: 
- [Model validation in ASP.NET Core MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/validation?view=aspnetcore-2.1)

本文大纲: 
- [验证特性(Attribute)](#%E9%AA%8C%E8%AF%81%E7%89%B9%E6%80%A7attribute)
- [Required 特性和 BindRequired 特性的使用说明](#required-%E7%89%B9%E6%80%A7%E5%92%8C-bindrequired-%E7%89%B9%E6%80%A7%E7%9A%84%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
- [模型状态(Model State)](#%E6%A8%A1%E5%9E%8B%E7%8A%B6%E6%80%81model-state)
- [手动验证](#%E6%89%8B%E5%8A%A8%E9%AA%8C%E8%AF%81)
- [自定义验证](#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%AA%8C%E8%AF%81)
  - [继承自 ValidationAttribute 定义自定义验证特性](#%E7%BB%A7%E6%89%BF%E8%87%AA-validationattribute-%E5%AE%9A%E4%B9%89%E8%87%AA%E5%AE%9A%E4%B9%89%E9%AA%8C%E8%AF%81%E7%89%B9%E6%80%A7)
  - [在类级别实现 IValidateObject 接口](#%E5%9C%A8%E7%B1%BB%E7%BA%A7%E5%88%AB%E5%AE%9E%E7%8E%B0-ivalidateobject-%E6%8E%A5%E5%8F%A3)


## 验证特性(Attribute)
结合 ASP.NET Core 的模型绑定，可基于「入站请求数据模型」对请求数据进行验证，ASP.NET Core 内置了一系列用于验证的 `attribute`(下称“特性”) 使得开发人员可以声明式地将它们应用于任何类型或属性。

```csharp
public class Movie
{
    public int ID { get; set; }

    [StringLength(60, MinimumLength = 3)]
    [Required]
    public string Title { get; set; }

    [Display(Name = "Release Date")]
    [DataType(DataType.Date)]
    public DateTime ReleaseDate { get; set; }

    [Range(1, 100)]
    [DataType(DataType.Currency)]
    public decimal Price { get; set; }

    [RegularExpression(@"^[A-Z]+[a-zA-Z""'\s-]*$")]
    [Required]
    [StringLength(30)]
    public string Genre { get; set; }

    [RegularExpression(@"^[A-Z]+[a-zA-Z""'\s-]*$")]
    [StringLength(5)]
    [Required]
    public string Rating { get; set; }
}
```

- `[CreditCard]`: 属性匹配信用卡格式
- `[Compare]`: 在一个模型中验证两个属性
- `[EmailAddress]`: 属性匹配电子邮件格式
- `[Phone]`: 属性匹配电话号码格式
- `[Range]`: 属性值匹配一个范围
- `[RegularExpression]`: 模式匹配
- `[Required]`: 要求属性必须有值
- `[StringLength]`: 属性匹配字符串长度
- `[Url]`: 属性匹配 url 格式

> DataType 特性提供格式化不提供验证。

所有继承自 `ValidationAttribute` 的类型均支持模型验证，查看 [System.ComponentModel.DataAnnotations](https://docs.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=netframework-4.7.2) 获取更多有用的验证类型。

当内置验证特性无法满足要求时，可新建继承自 `ValidationAttribute` 的自定义验证类或将模型实现 `IValidatableObject` 接口进行扩展。

## Required 特性和 BindRequired 特性的使用说明

需要不可为 null 的值类型(如 decimal、int、float 和 DateTime)不需要为其标注 `Required` 特性，应用程序将不会检查这些类型的 `Required` 特性。MVC 模型绑定系统会忽略表单中为 null 或空白的提交，导致传入的表单数据缺少表单域。`BindRequired` 特性用于保证传递至后台的数据是完整的，在一个属性上标注 `BindRequired` 特性时，模型绑定器要求该属性必须有值，在一个类型上标注 `BindRequired` 特性时，模型绑定器要求该类型下的所有属性都必须有值。

对于上述值类型的可空类型(`Nullable<T>`)，模型绑定器将执行验证检查，就像该属性是标准的可为 null 的类型(例如 `string`)一样。

## 模型状态(Model State)
MVC 会持续验证字段直到达到错误数量的最大值(默认值 200)，可以通过以下代码来改变该值: 
```csharp
services.AddMvc(options => options.MaxModelValidationErrors = 50);
```

> 调用 `ModelState.IsValid` 方法将显式评估应用到模型上的所有验证特性

## 手动验证
完成模型绑定和验证后，可能需要重复其中的某些步骤。 例如，用户可能在应输入整数的字段中输入了文本，或者你可能需要计算模型的某个属性的值。可通过调用 `ModelState.TryValidateModel` 方法来实施手动模型验证。

## 自定义验证
自定义验证支持两种方式，它们分别是
### 继承自 ValidationAttribute 定义自定义验证特性
创建继承自 `ValidationAttribute` 的类型并重写 `IsValid` 方法，该方法接受两个参数:
1. value: 要被验证的目标对象
2. validationContext: 获取与验证相关的其他信息，包括被模型绑定器已经绑定好的模型本身及其他属性

```csharp
public class ClassicMovieAttribute : ValidationAttribute
{
    private int _year;

    public ClassicMovieAttribute(int Year)
    {
        _year = Year;
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        Movie movie = (Movie)validationContext.ObjectInstance;

        if (movie.Genre == Genre.Classic && movie.ReleaseDate.Year > _year)
        {
            return new ValidationResult(GetErrorMessage());
        }

        return ValidationResult.Success;
    }
```
### 在类级别实现 IValidateObject 接口
也可以通过实现 `IValidatableObject` 接口上的 `Validate` 方法，将验证逻辑直接放入模型中，以实现类级别的验证。如果某些验证规则仅仅适用于某个类型或验证逻辑依赖类的状态，那么让该模型 `IValidateObject` 接口可能是更好的选择。
```csharp
public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
{
    if (Genre == Genre.Classic && ReleaseDate.Year > _classicYear)
    {
        yield return new ValidationResult(
            $"Classic movies must have a release year earlier than {_classicYear}.",
            new[] { "ReleaseDate" });
    }
}
```
