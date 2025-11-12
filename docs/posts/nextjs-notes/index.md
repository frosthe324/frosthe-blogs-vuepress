
## 基于文件夹的 Routing

### 路由分组

`()`: `()` 括号创建了一个路由组 (Route Groups)，它允许将文件按逻辑组进行整理，同时不影响 URL 路径结构。当用括号 `()` 创建新文件夹时，文件夹名称不会包含在 URL 路径中。因此，`/dashboard/(overview)/page.tsx` 将依然对应 `/dashboard` URL。

详情查看 [🌐Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

### 动态路由

`[]`: `[]` 定义动态路由参数，如 `[id]`，如 `[post]`, `[slug]` 等。中括号中的值将被视为 route token 的 key，以属性名附加到 `params` 的，并将整个对象传递给 `page.tsx` 的函数。

详情查看 [🌐Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

### 安全插件

- `auth.config.ts`: 该文件必须位于项目根目录，用以配置 [🌐next-auth.js](https://authjs.dev/reference/nextjs) 实现认证、授权等安全功能。
- `proxy.ts`: 该文件必须位于项目根目录下，用于编写请求发送前后的拦截功能，类似于传统的中间件。详情查看 [🌐proxy.ts](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)。

### 约定注意项

- `redirect()` 函数基于抛出 Error 工作，在编写 try-catch 块时不要把它写在 try 块内。

___
## 特殊组件或约定

### 特殊组件

- `layout.tsx`: 
- `page.tsx`: 
- `loading.tsx` 文件: 一个基于 React `Suspense` 构建的特殊 Next.js 文件。它使得在页面内容加载期间作为替代页面显示出来。在 `loading.tsx` 中添加的任何 UI 元素都将作为静态文件的一部分，并在页面加载时发送给客户端。
- `error.tsx`: 用于路由级别的错误处理，它可作为一段路由对异常/错误的 catch-all 处理方式，向用户展示准备好的 UI 界面。详情见 [error.tsx 通用异常处理](#errortsx-通用异常处理)
  - `not-found.tsx`: 用于处理 `notFound` 错误场景。详情见[特定错误场景](#特定错误场景)
  - 特定错误函数诸如 `notFound` 会优先于 `error.tsx` 被调用。
- `global-error.tsx`: 全局错误处理组件，该文件需放置在应用程序的根路由下。该组件必须定义 `<html>` 和 `<body` 标签，因为它会在渲染时替换根 layout 的模板。

### 内置组件

- Link
- Suspense

### 客户端组件

Next.js 默认是服务端组件，可以在组件顶部编写 "use client" 来指示该组件是纯客户端运行的组件。

```typescript
"use client"

```

客户端组件与传统 SPA 程序组件的功能一样，可以访问 DOM API，使用事件处理器及 hooks。

___
## 错误处理

### `error.tsx` 通用异常处理

[🌐error](https://nextjs.org/docs/app/api-reference/file-conventions/error)

`error.tsx` 用于路由级别的错误处理边界 (捕获所有子路由)，它可作为一段路由对异常/错误的通用处理方式。该组件有以下几个特点: 

- `error.tsx` 是客户端组件 -> `"use client"`。
- `error.tsx` 中定义的 React 组件接收两个参数，`error` 和 `reset`，将有 nextjs 框架传入:
  - `error`: JavaScript 原生的 `Error` 对象的一个实例。
  - `reset()`: 该函数重置错误处理边界。执行该函数时，程序会尝试重新渲染其对应的路由。

> 注意: `error.tsx` 代表的错误边界机制不会捕获事件处理程序中的错误，因为它们的设计初衷是捕获渲染过程中的错误以防止应用程序崩溃。事件处理程序或异步代码中的错误是在渲染之后才出现的，这些错误应当手动处理并在适当时机向用户展示友好的 UI。

`error.tsx` 样板代码: 

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
```

### 特定错误场景

[🌐not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

- `not-found.tsx`: Next 框架提供了 `next/notFound` 函数来抛出 404 异常，通过引入该函数并调用可实现触发该异常。之后，在路由级别文件夹下创建 `not-found.tsx` 组件以在异常触发时告知框架渲染该组件。

___
## 局部预渲染 (PPR - Partial Prerendering)

Next.js 14 引入的一种全新的渲染模型，能够在同一路由下同时利用静态渲染和动态渲染的双重优势。PPR 利用 React 的 `Suspense` 组件让应用程序的部分内容延迟，直到满足某些条件 (例如数据加载完成) 时再进行渲染。可以将动态组件包裹在 `Suspense` 组件中，并为它传递一个 fallback 组件，以便在动态组件加载期间显示该组件。传递给 `fallback` 的组件会同其他静态元素一起嵌入到初始 HTML 文件中，在构建时 (或重新验证时) 静态内容先行预渲染为一个壳，并为动态内容预留占位符。动态内容直到用户访问该路由时才开始渲染。

```typescript
<Suspense fallback={<RevenueChartSkeleton />}>
  <RevenueChart />
</Suspense>
```

将一个组件包裹在 `Suspense` 中并不会使该组件本身变得具有动态性，而是将 `Suspense` 视作静态代码和动态代码之间的分界线。

### 启用 PPR 功能

要在 Next.js 项目中启用 PPR，打开 `next.config.ts` 文件:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
};

export default nextConfig;
```

之后，在需要启用 PPR 的路由对应的 `layout.tsx` 文件中添加一行代码:

```typescript
export const experimental_ppr = true;
```

___
## 插件

___
## React 特性

Nextjs 利用了一些 React 服务端渲染的新特性以支撑其框架。

### React Server Component


[🌐Server Components](https://react.dev/reference/rsc/server-components)

### React Server Actions

React Server Actions 允许直接在服务器上运行异步代码，无需创建 API 端点来修改数据。具体来说，可编写在服务器上直接执行的 `async` 异步函数，并从客户端代码或服务器组件调用这些函数。

React Server Actions 专门针对 web 常见的安全场景提供了诸如加密闭包 (encrypted closures)、严格的输入检查、错误消息哈希、主机限制 (host restrictions) 等众多功能。所有这些功能协同工作能显著提升应用程序的安全性。

[🌐Server Functions](https://react.dev/reference/rsc/server-functions)

#### Server Actions 与 `useActionState` 一起使用:

[🌐useActionState](https://react.dev/reference/react/useActionState)

`const [state, formAction, isPending] = useActionState(action, initialState, permalink?)` 是基于表单操作来更新状态的钩子函数。

参数:

- `action(prevState, ...)`: 传递给 form 的真实 `action` 函数，当表单提交时，该函数会被调用，其第一个参数是 `prevState`，即前一次提交表单时的状态值。
- `initialState`: 状态的初始值。
- `permalink`: 表单提交后指示浏览器导航至的 URL，可选。

返回值:

- `state`: 当前状态的值。首次提交时，与 `initialState` 相同；多次提交后，与 `action` 返回的状态一致。
- `formAction`: 一个新的 action 函数，可传递给表单组件或在 `startTransition` 中直接调用。
- `isPending`: 告知当前是否有正在提交的表单处理。