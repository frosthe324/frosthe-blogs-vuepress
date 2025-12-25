---
title: Python 学习笔记
description: 
excerpt: 记录了所有学习 Python 过程中的笔记
author: Frost He
date: 2025-11-21
lang: zh-CN
category:
- Python
tag:
- sytax
---

## 语法笔记

### 类型及转换

```python
# type functions
print(type("123"))
print(type(123))
print(type(123.123))
print(type(True))
print(type(None))


# type convertions
a = int("123")
b = float("123.123")
c = str(123.123)
d = bool("False")
```

### 可选参数 `ame="world!"`

```python
def hello(name="world!"):
    print(f"Hello {name}")
```

### 无限数量参数 `*args: int`，类似 Typescript 中的 `...params`

```python
# *args: Unlimited positional arguments
# * tells Python treat args to take in unlimited number of arguments
def add(*args: int):
    print(type(args))
    print(args)
    print(args[0])
    sum = 0
    for n in args:
        sum += n
    print(sum)
    return sum
```

### 键值对参数 `**kwargs`

```python
# **kwargs: Key word arguments
# ** tells python to treat kwargs to take unlimited keyword arguments
def calculate(**kwargs):

    print(type(kwargs))
    print(kwargs)
    result = 1
    for key, value in kwargs.items():
        print(f"{key}: {value}")
    result += kwargs["add"]
    result *= kwargs["multiply"]
    return result

result = calculate(add=3, multiply=5)
print(result)
```

### 错误处理模式 `try-except-else-finally`

```python
# Something that might cause an exception
try:
    file = open("a_file.txt")
# Catch particular FileNotFoundError exception
except FileNotFoundError as e:
    file = open("a_file.txt", "w")
    file.write("Something")
# Catch all other exceptions
except:
    print("Log other Errors")
# Do this if there were no exceptions
else:
    content = file.read()
    print(content)
# Do this no matter what happens
finally:
    file.close()

height = float(input("Height: "))
weight = int(input("Weight: "))

if height > 3:
    raise ValueError("Human height should not be over 3 meters")

bmi = weight / height ** 2
```

## 模块管理

### 目录所搜

当运行 `python main.py` (或 `uv run main.py`) 时，Python 的导入逻辑如下：

1. 初始化 `sys.path`: Python 会自动维护一个搜索路径列表 (sys.path)
   - 第一优先级：当前运行脚本所在的工作目录
   - 第二优先级：安装的第三方库目录（site-packages，即你的 `.venv` 里的包）。
   - 第三优先级：Python 标准库目录。
2. 执行 `import xxx`: 当代码执行到 `from pdf_parser import ...` 时，Python 会遍历 sys.path 里的每一个目录，寻找名为 `pdf_parser.py` 的文件（或者名为 `pdf_parser` 的包含 `__init__.py` 的文件夹）。

- 在 Python 中，模块（文件名）必须遵循变量命名规则。横杠 `-` 在 Python 里是减号，所以模块必须以 `snake_case` 命名。例如，文件名为 `pdf-parser.py` 的文件无法作为模块导入。