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
