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
  (res, err) => {
    console.log('success', res)
  },
  (err) => {
    console.log(err)
  }
)

console.log(p)
