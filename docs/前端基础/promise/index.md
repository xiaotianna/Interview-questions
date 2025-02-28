## 问题 18：Promise 和 PromiseA+ 规范

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
```

```js
new Promise((resolve) => {
  console.log(1)
  resolve()
}).then(() => {
  console.log(2)
})

// 结果：输出 1 2
```

:::