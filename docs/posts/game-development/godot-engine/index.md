
## Scenes

## Nodes

- Node2D: 
- Sprite2D: 图像型 2D 节点
  - AnimatedSprite2D: 
- Area2D: 预设区域型 2D 节点
- RigidBody2D: 刚体 2D 节点，
- CollisionShape2D: 碰撞 2D 节点，通常用于覆盖图形节点的触碰体积
- VisibleOnScreenNotifier2D: 检测节点当前是否在屏幕上，并发送信号。定义 `screen_entered` 和 `screen_exited` 信号。
- Timer: 
- Marker2D: 标记节点。通常用于确定一个起始位置点。
- Path2D: 路径节点，用于绘制一个闭合的路径。
  - PathFollow2D: 当作为子节点至于 Path2D 之下时，可自动跟随该路径。
- CanvasLayer: 允许绘制位于其他游戏元素之上的 HUD 层节点。
- Control: 控件节点，传统 UI 元素的父节点
  - Label: 文本节点，用于展示单行文本。
  - Button: 按钮节点。
- TileMapLayer: 瓦片地图节点，用于绘制 2D 瓦片地图。
- ColorRect: 纯色矩形节点。
  - TextureRect: 纹理矩形节点，可用自定义图片填充纹理。
- AudioStreamPlayer: 音频播放器节点，用于播放音频。
- Camera2D: 2D 摄像机节点，用于控制游戏视图，初始视角将自动跟随父节点。
  - `Limit`: 限制摄像机视角的范围。


- Tween: 在两个值之间变化的平滑类型，允许实现在两个值之间的平滑过渡。
- NoiseTexture: 

## 概念厘清

- Vector: 向量
  - 向量相减：得到另一个向量，通常用来计算 A 与 B 向量的指向关系。
  - 单位向量：长度为 1 的向量通常称为单位向量，或方向向量或正常向量。单位向量通常用于追踪方向
  - 向量 Normalize：向量归一，将向量转换为单位向量，但保持方向。Godot 提供了 `Vector.normalized()` 方法快速实现。
  - 反射向量：代表向量 A 之于单位向量 (0, -1) 的镜像向量，通常用于表示碰撞后的反弹方向。
  - Dot product：点乘，计算两个向量之间的夹角。两个向量的 x 相乘 + y 相乘，得到的一个标量。Godot 提供了 `Vector.dot(Vector b)` 方法来实现。夹角的其中一个应用是检测对象之间的朝向关系。
- Scalar: 标量
- Magnitude: 大小，长度
- Position: 位置
- Velocity: 速率，单位时间内移动的距离。游戏开发中通常以**像素/秒**为单位
- Radians: 弧度，而非角度。通常用 PI 表示，一个 PI 表示一个半圆的弧度。PI / 4 表示 45 度圆弧。Godot 还提供了 `TAU` 表示全圆弧。

## Scripts

Scripts 是附加在 Node 上的脚本代码，用以扩展 Node 的功能。每个 Script 代表着直接或间接继承了 Godot 引擎内置的类型。

### 虚函数笔记

基于约定，带有下划线为前缀的函数名为 Godot 引擎的内置虚函数。这意味着我们可以重写并扩展这些函数的行为。

- `func _init()`: `Node._init()` 虚函数，被引擎识别为类型构造函数。引擎会在构造每个对象时调用该函数。
- `func _ready()`: `Node._ready()` 虚函数，当 Node 及其子节点全部准备好时被引擎调用
- `func _process(delta)`: `Node._process(delta)` 虚函数，可被继承类型重写。引擎会在每一帧渲染时调用该函数，并传入一个 `delta` 参数，代表距离上一帧渲染的差值。
- `func _unhandled_inpuit()`: 当玩家输入时，引擎将调用该函数。

### 常用函数笔记

- `Node.get_node(path)`: 以当前节点根据 Node 名称获取 Node 实例的引用，通过相对路径查找，例如 `get_node("Timer")`，"Timer" 字面值为该 Node 的名称，如果其修改名称，则需要相应修改这个字符串值。
- `Vector2.clamp(min: Vector2, max: Vector2)`: 该方法确保向量不会超出指定范围。
- `Object.set_deffered(property: string, value)`: 在当前帧的末尾，将 `property` 的值设置为 `value`。
- `Array.pick_random()`: 从数组元素中随机挑选一个元素。
- `queue_free()`: 帧结束时，排队进入销毁节点队列。

### 语法/关键字

- `extends`: 永生声明类型继承
- `var`: 声明变量
- `signal`: 声明自定义 Signal，一般命名约定为动词过去时，如 `signal health_depleted`。
  - Signal 声明时可包含参数，如 `signal health_depleted(old_value, new_value)`。
  - `.emit()` 函数: 每个声明的 Signal 都带有一个 `emit()` 函数，调用时发布该 Signal。若 signal 声明包含参数，则 emit 调用时也应对应传入这些参数：`emit(old_value, new_value)`
- `@export`: 使用该关键字导出的变量允许该属性由 Godot 引擎的 Inspector 在 GUI 界面上调整。例如 `@export var speed = 400`
- `$AnimatedSprite2D` 当中的 `$` 是调用 `get_node` 方法的简写。因此，`$AnimatedSprite2D.play()` 与 `get_node("AnimatedSprite2D").play()` 是等价的。

## Signals

Signals 是游戏对象 (Scene 或 Node) 之间传递消息的机制，其基于观察者或 (发布/订阅) 模式实现。例如当 Node A 的某个按钮被按下后可以发出 Signal，Node B 或 C 或更多的 Node 可以侦听该 Signal，以实现通信。

- Signal 侦听处理方法的命名约定: `_on_node_name_signal_name`

## Resources

TBD