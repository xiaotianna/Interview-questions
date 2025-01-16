# 同一个页面三个组件请求同一个API

思路：进行缓存

```js
// 模拟请求
const fetchData = id => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(id)
        }, 1000)
    })
}

// 记录缓存
const cache = {}

// 缓存请求
const cacheFetchData = id => {
    if (cache[id]) {
        return cache[id]
    }
    cache[id] = fetchData(id)
    return cache[id]
}

// 测试
cacheFetchData(3).then(id => console.log(id))
cacheFetchData(3).then(id => console.log(id))
cacheFetchData(3).then(id => console.log(id))
```

<img src="./img/同一个页面三个组件请求同一个API.png" alt="同一个页面三个组件请求同一个API.png" style="zoom:50%;" />