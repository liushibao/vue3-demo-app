[English read me](./README.md)

# vue3-demo-app前端

这是一个Vue3前端应用Demo，按照Vue3官方文档推荐的框架设计，使用了pinia做应用数据管理，vue3-router做前端路由控制。目前已实现的功能包括前端表单输入验证, canvas绘制二维码, apache echarts数据可视化,瀑瀑流信息卡展示, jwt-token验证网络请求等.

## Back-end后端配置

见本账号下的项目：asp.net core minimal api。

## 项目安装配置

在.env.development或.env.production文件中配置后端api地址前缀VITE_API_BASE_URL，开发环境使用默认配置即可。安装依赖项:

```sh
npm install
```

### 开发环境运行

```sh
npm run dev
```

### 打包部署

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
