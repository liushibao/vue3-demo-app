[中文说明](./README.CN.md)

# vue3-demo-app

This is a demo project of vue3 front-end app. The design followed vue3 official recommendation, using pinia for app state management and vue3-router for client side routing. The currently implemented functions are form input vailidation, canvas drawn qrcode, apache echarts data visualization,walterfall information card layout, jwt-token authenticated http request.

## Back-end configuration

See the asp.net core minimal api repository of this git account.

## Project Setup

Config the back-end api base url environment variable VITE_API_BASE_URL in .env.development or .env.production file. Using the default config shoud be enough for development. And install npm packages:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
