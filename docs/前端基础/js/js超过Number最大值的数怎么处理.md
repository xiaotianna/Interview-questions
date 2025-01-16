# js超过Number最大值的数怎么处理

`Number.MAX_VALUE`

## 在哪些 `场景` 会超过Number最大值

- 大数据计算
- 格式展示
- 用户输入

针对大数据处理

- 金融
- 科学计算
- 数据分析

## 解决方案

- BigInt

```js
const bigNum = BigInt('12312312321323313123213123132343434343434');
bigNum + bigNum
```

- Decimal.js

- big.js

- 比如在用户输入场景，需要限制输入大小