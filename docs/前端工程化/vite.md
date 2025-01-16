Vite 打包优化策略
Vite 的优化主要是围绕以下几个方面：

- 代码拆分
利用动态导入 (import()) 实现代码分割。

使用 rollupOptions 中的 output 和 input 来控制输出和输入配置，进一步优化代码拆分。
- 资源压缩
使用 Terser 或其他插件来压缩 JavaScript。

使用 html-minifier-terser 或类似插件压缩 HTML。

使用 imagemin 插件来压缩图像资源。
- 缓存利用
Vite 内置的 HMR 和增量构建可以减少构建时间。

使用 .vite 目录下的缓存文件来加速后续构建。
- 构建配置
通过 rollupOptions 配置来排除不需要打包的外部依赖。

调整 chunkSizeWarningLimit 来调整警告的 chunk 大小限制。
- 按需加载
使用插件来实现第三方库的按需加载，比如 lodash-es 和 babel-plugin-import。
- 路径别名
配置 resolve.alias 来简化和标准化模块导入路径。
- CDN 加速
将一些稳定的外部依赖通过 CDN 加载，而不是打包进项目中。
- 分析工具
使用 @rollup/plugin-analyzer 或类似插件来分析打包后的文件大小分布，帮助识别优化点。

## vite 依赖预构建

## 指定vite 插件构建顺序

enforce:"pre" | "post" | undefined;

## vite插件常用hook

transformIndexHtml

## 为什么说vite比webpack快

