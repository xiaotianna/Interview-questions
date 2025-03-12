# 手写题

## 问题 1：实现一个函数柯里化 add

1. add(1,2,3).valueOf() // 6
2. add(1,2)(3)(4,5).valueOf() // 15
3. add(1)(2)(3)(4,5,6)(7).valueOf() // 28

```js
const curry = (...args1) => {
  let params = args1

  const addFn = (...args2) => {
    params = params.concat(args2)
    return addFn
  }

  addFn.valueOf = () => {
    return params.reduce((pre, cur) => {
      return pre + cur
    }, 0)
  }

  return addFn
}
```

## 问题 2：实现响应式数据 + 依赖收集

要求：编写 `constructor`，让其实现数据修改触发 render，且同步变更需要合并。

```js
class Component {
  data = { name: '' }

  constructor() {}

  render() {
    console.log(`render - name:${this.proxyData.name}`)
  }
}

// 要求以下代码需要触发render, 且同步变更需要合并。
const com = new Component()
com.proxyData.name = 'a'
com.proxyData.name = 'b'
com.proxyData.name = 'wifi'
// 上面三个执行完后，第一次触发 render

setTimeout(() => {
  com.proxyData.name = 'hello wifi'
})
// 定时器执行完后，第二次触发 render
```

解析：通过 `Proxy` 触发响应式，加上 `Promise` 实现依赖收集。

```js {3,5-19,22}
class Component {
  data = { name: '' }
  pending = false

  constructor() {
    this.proxyData = new Proxy(this.data, {
      set: (target, key, value) => {
        // target => sthis.data
        target[key] = value
        if (!this.pending) {
          this.pending = true
          // 第一次和第二次触发，相差一个微任务，只需要在微任务中重新执行render就行
          Promise.resolve().then(() => {
            this.render()
          })
        }
      }
    })
  }

  render() {
    this.pending = false
    console.log(`render - name:${this.proxyData.name}`)
  }
}

// 要求以下代码需要触发render, 且同步变更需要合并。
const com = new Component()
com.proxyData.name = 'a'
com.proxyData.name = 'b'
com.proxyData.name = 'wifi'
// 上面三个执行完后，第一次触发 render

setTimeout(() => {
  com.proxyData.name = 'hello wifi'
})
// 定时器执行完后，第二次触发 render
```

## 问题 3：手写 intanceof 操作符

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
/**
 * 思路：
 *  1、通过 Object.getPrototypeOf 获取 obj 的原型
 *  2、循环判断 objProtoType 是否和 constructor 的原型相等
 *    2.1、如果相等就返回 true
 *    2.2、如果不相等 就重新赋值一下 obj 的原型 进入下一次循环
 *  3、判断是 objProtoType 是否为空 如果为空就说明不存在 返回 false
 */
function myInstanceof(obj, constructor) {
  // 检查obj是否为对象或函数
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false
  }

  // 获取构造函数的原型对象 obj.__proto__
  let proto = Object.getPrototypeOf(obj)

  // 检查构造函数的原型链是否包含给定的构造函数的原型
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true
    }
    // obj.__proto__.__proto__ ...
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

class A {}
class B extends A {}
class C extends B {}

let obj = new C()
console.log(myInstanceof(obj, A))
```
