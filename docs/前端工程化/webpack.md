# webpack

## webpack 有哪些核心概念？

1. entry：入口
2. output：输出
3. module：模块(loader)
4. plugin：插件
5. mode：模式
6. devServer：开发服务器
7. optimization：优化
8. code-splitting：代码切割

## 有哪些常见的 loader

- raw-loader：加载文件原始内容
- file-loader：把文件输出到文件夹中，在代码中通过相对 url 去引用输出的文件
- url-loader：与 file-loader 类似，可设置输出大小，小于大小 url-loader 会把文件转成 base64，并把 base64 输出到代码中，大于则输出文件
- source-map-loader：加载 source map 文件
- babel-loader：加载 ES6+ 语法，并转成 ES5
- ts-loader
- css-loader：加载 css 文件
- ...

## 有哪些常见的 plugin

- define-plugin：定义环境变量，在 `webpack5` 中，通过 `mode` 来定义环境变量
- html-webpack-plugin：生成 html 文件，并自动引入打包后的 js 文件
- mini-css-extract-plugin：将 css 提取到单独的文件中
- terser-webpack-plugin：压缩 js 文件
- webpack-bundle-analyzer：分析打包后的文件大小，并生成可视化的图表

## loader 和 plugin 的区别

### 1. 功能区别

- loader：本质是一个函数，对接收到的内容进行转换，返回转换后的结果。webpack 只认识 js，使用 loader 来转换其他类型的文件。
- plugin：插件，用于扩展 webpack 功能。在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

### 2. 运行时机区别

- loader 运行在打包文件之前上
- plugins 在整个编译周期都起作用

## webpack 构建流程

webpack 构建流程是一个 `串行` 的过程，

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得到最终的参数配置对象。
2. 开始编译：根据配置参数 `初始化 Compiler 对象`，加载所有配置的插件，执行对象的 `run` 方法，开始编译。
3. 确定入口：entry 找到所有入口。
4. 编译模块：调用所有 loader 对模块进行编译，找到模块依赖的的模块，在递归该步骤直到所有入口依赖的文件都被处理。
5. 完成模块编译：得到每个模块被编译后的最终内容以及他们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 chunk，再把 chunk 转换成文件输出。
7. 输出完成：根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

## compiler 和 compilation 的区别

- Compiler（提供 webpack 的钩子）：compiler 对象中保存着完整的 Webpack 环境配置，每次启动 webpack 构建时它都是一个独一无二，仅仅会创建一次的对象。

  这个对象会在首次启动 Webpack 时创建，我们可以通过 compiler 对象上访问到 Webapck 的主环境配置，比如 loader 、 plugin 等等配置信息。

- Compilation（对资源的处理）：compilation 对象代表一次资源的构建，compilation 实例能够访问所有的模块和它们的依赖。

<img src='./img/webpack运行流程.png' alt='webpack运行流程' style='zoom: 50%' />

> Compiler：只会创建一次
>
> Compilation：会创建多次

## webpack 事件机制

Webpack 的事件机制的核心是插件系统，通过丰富的钩子和插件机制，开发者可以在编译的不同阶段插入自定义逻辑，从而实现高度定制化的构建流程。

**常见事件**

- before-run：在 webpack 开始编译之前触发，可以用于清除上一次构建的文件
- run：在 webpack 开始编译触发
- before-compile：在 webpack 开始编译之前触发，可以用于添加额外的编译配置或预处理代码
- compile：在 webpack 开始编译触发，可以用于监听编译过程或者处理编译错误
- this-compilation：在创建新的 compilation 对象时触发，compilation 对象代表当前编译过程中的所有状态和信息
- compilation：在编译代码期间触发，可以监听编译过程或处理编译错误
- emit：输出文件之前触发，用于修改输出文件或生成一些附加文件
- after-emit：输出文件之后触发，可以用于清理临时文件或资源
- done：编译完成时触发，可以用于生成构建报告


## 使用 webpack 时，用过哪些可以提高效率的插件？

- webpack-merge：提取公共配置，减少重复代码
- webpack-dev-server：开发服务器
- hot-module-replacement-plugin：hmr 热更新

## 如何优化 webpack 构建速度？

1. `OneOf`：每个文件只能被其中一个 loader 处理，匹配上了第一个就不会去判断下面了
2. 使用 Cache（缓存），提升二次打包速度
3. Thread（多进程打包）：安装`thread-loader`
4. 代码压缩
   - `terser-webpack-plugin`
   - `minimize-css-extract-plugin`
5. 缩小打包作用域：`exclude` / `include`
6. 排除依赖`externals`，使用 cdn
7. code split 代码切割
8. tree-shake：只针对 esm 有效

## 文件指纹

**是什么？**

文件指纹：打包后输出的文件名后缀

- hash：整个项目的 hash 值，只要项目文件有变化，整个项目的 hash 值就会改变
- chunkhash：根据 chunk 生成 hash 值，如果 chunk 中的文件有变化，那么就会生成新的 hash 值
- contenthash：根据文件内容生成 hash 值，如果文件内容有变化，那么就会生成新的 hash 值

**js 文件指纹**

```js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

**css 文件指纹**

```js
modeule.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
}
```

**作用**

文件指纹，就是文件名加上 hash 值，可以防止缓存。

## webpack 热更新原理

获取到变化的文件，使用 websocket 发送给客户端文件 hash，客户端收到消息后，发送请求，获取到文件内容，替换掉内存中的文件。

## webpack5 比 webpack4 更新了什么？

- 优化了构建速度，开发模式，构建速度明显提升
- tree-shaking：算法优化
- 内置的持久化缓存：可以缓存每个模块的编译结果，减少重复构建时间。
- 支持 WebAssmbly
- 支持模块联邦(Module Federation)：支持模块共享，远程加载（微前端的架构支持）

## 模块联邦

### 概念

模块联邦：多个项目之间共享代码的机制，特别适用于微前端架构

特点：

- 按需加载：只加载当前页面需要的模块，减少初始加载时间。
- 跨应用共享：多个微前端应用可以共享公共模块，避免重复打包。
- 独立部署：各个微前端应用可以独立开发、测试和部署。

### 使用

例如：在 App1 和 App2 应用中，需要同时共享同一个 ui 组件库

::: code-group

```js [模块提供方]
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        // 需要共享的模块
        './Button': './src/components/Button'
      },
      shared: ['react', 'react-dom'] // 共享的第三方库
    })
  ]
}
```

```js [模块调用方]
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:3000/remoteEntry.js' // 模块提供方名称和地址
      },
      shared: ['react', 'react-dom'] // 共享的第三方库
    })
  ]
}
```

:::

### 模块联邦 和 monorepo 的区别

模块联邦（Module Federation）和 Monorepo 是两种不同的概念，模块联邦主要解决的是运行时的模块加载和共享问题，而 Monorepo 则是关于如何组织和管理代码仓库。

两者可以相辅相成，共同提升开发和部署的效率。

## 链接

::: tip 具体 webpack 内容

[https://blog.csdn.net/m0_65519288/article/details/143459980](https://blog.csdn.net/m0_65519288/article/details/143459980)

:::
