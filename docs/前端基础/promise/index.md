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

## 手写 Promise

### 1、Promise 构造器的实现

```js
class MyPromise {
  // 定义内部私有属性
  #state = 'pending'
  #value = undefined
  constructor(exceutor) {
    const resolve = (data) => {
      // resolve 函数作用：调用后，改变 Promise 的状态
      this.#changeState('fulfilled', data)
    }
    const reject = (reason) => {
      this.#changeState('rejected', reason)
    }
    try {
      exceutor(resolve, reject)
    } catch (error) {
      reject(error) // 处理 Promise 中
    }
  }

  #changeState = (state, value) => {
    if (this.#state === 'pending') {
      // 状态只能改变一次
      this.#state = state
      this.#value = value
    }
  }
}

const p = new MyPromise((resolve, reject) => {
  // 在 Promise 中抛出异步错误，是捕获不到的
  setTimeout(() => {
    throw new Error('出错了')
  }, 1000)
})
```

### 2、Promise 的 then 方法的实现

> - `then` 方法返回的也是一个 `Promise` 对象
>
> - `then` 方法的执行时机：当前 `Promise` 完成后，才会执行 `then` 方法

```js {5,26,30-48,50-60}
class MyPromise {
  // 定义内部私有属性
  #state = 'pending'
  #value = undefined
  #handlers = [] // 存储 then 方法的内容
  constructor(exceutor) {
    const resolve = (data) => {
      // resolve 函数作用：调用后，改变 Promise 的状态
      this.#changeState('fulfilled', data)
    }
    const reject = (reason) => {
      this.#changeState('rejected', reason)
    }
    try {
      exceutor(resolve, reject)
    } catch (error) {
      reject(error) // 处理 Promise 中
    }
  }

  #changeState = (state, value) => {
    if (this.#state === 'pending') {
      // 状态只能改变一次
      this.#state = state
      this.#value = value
      this.#run()
    }
  }

  #run = () => {
    if (this.#state === 'pending') {
      return
    }
    while (this.#handlers.length) {
      const { onFullfilled, onRejected, resolve, reject } =
        this.#handlers.shift()
      if (this.#state === 'fulfilled') {
        if (typeof onFullfilled === 'function') {
          onFullfilled(this.#value)
        } else {
        }
      }
      if (this.#state === 'rejected') {
        if (typeof onRejected === 'function') {
          onRejected(this.#value)
        }
      }
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFullfilled,
        onRejected,
        resolve,
        reject
      })
      this.#run()
    })
  }
}

const p = new MyPromise(
  (resolve, reject) => {
    // 在 Promise 中抛出异步错误，是捕获不到的
    setTimeout(() => {
      // throw new Error('出错了')
      reject('出错了')
      // resolve('成功')
    }, 1000)
  },
  (err) => {}
)
p.then(
  (res) => {
    console.log('success', res)
  },
  (err) => {
    console.log(err)
  }
)
```

### 3、Promise 的 then 方法的返回值

`then` 的返回值，也就是调用 `resolve` / `reject`

```js
class MyPromise {
  // 定义内部私有属性
  #state = 'pending'
  #value = undefined
  #handlers = [] // 存储 then 方法的内容
  constructor(exceutor) {
    const resolve = (data) => {
      // resolve 函数作用：调用后，改变 Promise 的状态
      this.#changeState('fulfilled', data)
    }
    const reject = (reason) => {
      this.#changeState('rejected', reason)
    }
    try {
      exceutor(resolve, reject)
    } catch (error) {
      reject(error) // 处理 Promise 中
    }
  }

  #changeState = (state, value) => {
    if (this.#state === 'pending') {
      // 状态只能改变一次
      this.#state = state
      this.#value = value
      this.#run()
    }
  }

  #run = () => {
    if (this.#state === 'pending') {
      return
    }
    while (this.#handlers.length) {
      const { onFullfilled, onRejected, resolve, reject } =
        this.#handlers.shift()
      if (this.#state === 'fulfilled') {
        if (typeof onFullfilled === 'function') {
          try {
            // 在 onFullfilled 中抛出异常，则该异常会传递到下一个 then 的 onRejected 中
            const data = onFullfilled(this.#value)
            resolve(data)
          } catch (error) {
            reject(error)
          }
        } else {
          // 当传入的参数不是函数，then 的 Promise 状态为【这个参数】（也就是 Promise 穿透）
          resolve(this.#value)
        }
      }
      if (this.#state === 'rejected') {
        if (typeof onRejected === 'function') {
          try {
            const data = onRejected(this.#value)
            resolve(data)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(this.#value)
        }
      }
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFullfilled,
        onRejected,
        resolve,
        reject
      })
      this.#run()
    })
  }
}

const p = new MyPromise((resolve, reject) => {
  // 在 Promise 中抛出异步错误，是捕获不到的
  setTimeout(() => {
    // throw new Error('出错了')
    reject('出错了')
    // resolve('成功')
  }, 1000)
})
p.then(
  //   (res) => {
  //     console.log('success', res)
  //   },
  123,
  (err) => {
    console.log(err)
    return '失败123'
  }
).then((res) => {
  console.log(res)
})

console.log(p)
```
