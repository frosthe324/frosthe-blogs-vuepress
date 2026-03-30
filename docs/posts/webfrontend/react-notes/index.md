---
title: 理解 React 的渲染机制
author: Frost He
excerpt: 理解 React 组件何时 re-render、Hooks 在 re-render 中如何运作，以及 Fiber 架构下 Hooks 链表的核心机制
date: 2026-03-19
category:
- WebFrontend
tag:
- react
- hooks
- rendering
---

# 理解 React 的渲染机制

这篇笔记围绕两个核心问题展开：React 组件**何时**会 re-render，以及 re-render 发生时**Hooks 如何运作**。理解这两点是写出高性能 React 组件的基础。

## 1. 触发 re-render 的条件

React 组件本质上是一个函数。当 React 决定 re-render 某个组件时，它会**重新执行**这个函数，生成新的 JSX，然后与上一次的结果进行 diff。

触发 re-render 的条件有以下几种：

### 1.1 自身 state 变化

通过 `useState` 或 `useReducer` 更新 state 会触发当前组件的 re-render。需要注意的是，`useRef` 的值变化**不会**触发 re-render - 这是 `useRef` 与 `useState` 的关键区别。

```tsx
const [count, setCount] = useState(0);
setCount(1); // 触发 re-render

const ref = useRef(0);
ref.current = 1; // 不触发 re-render
```

### 1.2 父组件 re-render

默认情况下，当父组件 re-render 时，其所有子组件都会跟着重新执行，无论子组件的 props 是否发生了变化。这是 React 的默认行为，可以通过 `React.memo` 来优化：

```tsx
const Child = React.memo(({ name }: { name: string }) => {
  // 只有当 name 发生变化时才会 re-render
  return <div>{name}</div>;
});
```

### 1.3 消费的 Context 变化

当组件通过 `useContext` 消费的 Context 值发生变化时，该组件会 re-render。这也是 Context 在大型应用中需要谨慎使用的原因 - 如果 Context 的值频繁变化，所有消费该 Context 的组件都会跟着 re-render。

### 1.4 订阅的外部 Store 变化

使用 Redux (包括 RTK Query)、Zustand 等状态管理库时，当组件订阅的 store 片段发生变化，也会触发 re-render。例如，当 RTK Query 的 `useSomeQuery` 收到 API 响应后 store 更新，订阅该数据的组件就会 re-render。

## 2. Hooks 在 re-render 中的行为

每次 re-render 时，组件函数会被重新执行，所有 Hooks 也会被重新调用。但不同 Hook 的行为存在差异:

| Hook            | re-render 时的行为                           |
| --------------- | -------------------------------------------- |
| `useState`      | 返回当前 state 值，不重新初始化              |
| `useRef`        | 返回同一个 ref 对象，不重新创建              |
| `useMemo`       | 依赖项未变则返回缓存结果，变了才重新计算     |
| `useCallback`   | 同 `useMemo`，缓存的是函数引用               |
| `useEffect`     | 依赖项未变则跳过，变了才在 commit 阶段重新执行 |

关键点在于：**Hooks 每次都会被调用，但不一定产生新的值**。

## 3. Fiber 与 Hooks 链表

上述行为的底层实现依赖于 React 的 Fiber 架构。React 在内部为每个组件实例维护了一个 Hooks 链表，挂载在 Fiber 节点的 `memoizedState` 属性上。

每次 re-render 时，Hooks 按**调用顺序**从链表中读取上一次的值，再根据各自的逻辑决定是否更新。这也是为什么 React 要求 Hooks 必须在组件顶层调用、不能放在条件语句中 - 因为调用顺序必须与链表中的位置严格一一对应。

```
Fiber Node
└── memoizedState (Hooks 链表)
    ├── Hook 0: useState(count)     → 返回当前 state
    ├── Hook 1: useRef(inputRef)    → 返回同一个 ref 对象
    ├── Hook 2: useMemo(computed)   → 检查依赖项，决定是否重新计算
    └── Hook 3: useEffect(callback) → 检查依赖项，决定是否重新执行
```
