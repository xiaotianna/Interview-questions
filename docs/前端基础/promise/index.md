# 问题 18：Promise 和 PromiseA+ 规范

## Promise A+ 规范

是一个民间规范，是一个有 `then` 方法的对象或者函数（就是一套定义如何实现 `Promise` 的标准）。

## Promise

ES6 的 `Promise` 是一个满足 `Promise A+` 规范的 `Promise` 实现。是 JS 中处理异步操作的一种模式和对象，它提供了一种更优雅的方式来处理异步代码，尤其是处理回调地狱（callback hell）问题。

- **Promise 有三种状态**：
  - Pending（进行中）：Promise 的初始状态，表示异步操作尚未完成，也不失败。
  - Fulfilled（已完成）：表示异步操作成功完成，其结果值可用。
  - Rejected（已失败）：表示异步操作失败，包含失败的原因。

::: tip 注意

1. `Promise` 的回调是立即执行的

```js
new Promise(() => {
  // ...
})
```

2. 只有当 `Promise` 状态完成，才会执行 `.then()` 回调

```js
new Promise((resolve) => {
  console.log(1)
}).then(() => {
  console.log(2)
})

// 结果：只会输出 1

new Promise((resolve) => {
  console.log(1)
  resolve()
}).then(() => {
  console.log(2)
})

// 结果：输出 1 2
```

3. 调用 `Promise` 的 `resolve` / `reject` 方法后，再是不会再改变 `Promise` 的状态

```js
new Promise((resolve, reject) => {
  resolve('success')
  reject('fail') // 不会执行
})
```

4. 带有 `async` 和 `await` 的 `Promise` 的执行顺序

> `await` 后面的那一部分是同步代码（因为 `await` 等待的是后面内容的运行结果，所以会立即执行）
>
> 当 `await` 后的 `Promise` 完成后，将剩余代码放入微队列中，也就是下面的 `console.log(3)` 会放入微队列中

```js
const fn = async () => {
  console.log(2)
  await p // 这里的 await 后面的 Promise 是同步执行的
  console.log(3)
}

fn()
```

:::

## Promise all/allSettle/any/race 的使用场景

### 1、Promise.all

场景：并发请求多个任务，且不允许失败

```js
/**
 * 全部任务执行“成功”后，进入 then 逻辑
 * 返回所有任务的“结果”
 * 只要一个任务失败，进入 catch 逻辑
 */
Promise.all([
  Promise.resolve('p1'),
  Promise.resolve('p2'),
  Promise.resolve('p3')
])
  .then((results) => {
    console.log('success', results)
  })
  .catch((error) => {
    console.error('error', error)
  })
```

### 2、Promise.allSettled

场景：并发请求多个任务，且能允许失败（例如：前端埋点日志上报）

```js
/**
 * 全部任务执行“完成”（不论成功还是失败）后，进入 then 逻辑
 * 返回所有任务的“结果”和“状态”。
 * 不会进入 catch 逻辑，成功或失败内容的状态和值，都以数组的形式返回（.then中）
 */
Promise.allSettled([
  Promise.resolve('p1'),
  Promise.reject('p2'),
  Promise.resolve('p3')
])
  .then((results) => {
    console.log('success: ', results)
  })
  .catch((error) => {
    console.log('fail: ', error)
  })
```

### 3、Promise.any

场景：一个任务成功即可继续，不关心其他失败任务（例如：寻找有效 CDN、抢票）

```js
/**
 * 首个任务执行“成功”后，进入 then 逻辑
 * 返回该任务的“结果”
 * 若全部任务失败，进入 catch 逻辑
 */
Promise.any([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 100)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    }, 200)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p3')
    }, 300)
  })
])
  .then((result) => {
    console.log('success ', result)
  })
  .catch((error) => {
    console.log('error ', error)
  })
```

### 4. Promise.race

场景：需要获取最快返回的结果，不关心其他任务。

```js
/**
 * 首个任务执行“完成”（不论成功还是失败）后触发
 * 首任务状态是成功：进入 then 逻辑，返回该任务“结果”
 * 首任务状态是失败：进入 catch 逻辑
 */
Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p1'), 100)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p2'), 200)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p3'), 300)
  })
])
  .then((res) => {
    console.log('success ', res)
  })
  .catch((error) => {
    console.log('error ', error)
  })
```

## Promise 和 await/async 的关系

- Promise：一种用于处理异步操作的对象，它代表了一个异步操作的最终完成或失败，并允许在异步操作完成后执行相关的代码。`Promise` 提供了一种更灵活的方式来管理异步代码，尤其是在处理多个异步操作的情况下。
- async/await：一种构建在 Promise 之上的**语法糖**。它是 ECMAScript 2017 (ES8) 引入的特性，旨在简化异步代码的编写和理解。<u>async 函数返回一个 Promise，允许在函数内使用 await 关键字等待异步操作完成。</u>

**关系：**

- async 函数返回一个 Promise 对象。这意味着你可以在 async 函数内使用 await 来等待一个 Promise 对象的解决。await 暂停 async 函数的执行，直到 Promise 状态变为 resolved（成功）或 rejected（失败）。
- async/await 是一种更直观的方式来处理 Promise，可以避免嵌套的回调函数（回调地狱）。

## 手写 Promise

### 1、Promise 构造器的实现


### 2、Promise 的 then 方法的实现

> - `then` 方法返回的也是一个 `Promise` 对象
>
> - `then` 方法的执行时机：当前 `Promise` 完成后，才会执行 `then` 方法
