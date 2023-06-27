---
title: 解决 Property key of ObjectProperty got "BooleanLiteral" 的问题
date: 2017-01-04 23:45:31
category: 学以致用
tags:
- 实践
- 问题排查
- Webpack
- JavaScript
- HMR
---

今天在写 [react-koa-isomorphic-boilerplate](https://github.com/zhuscat/react-koa-isomorphic-boilerplate)，期间出现了一个问题，错误原因是 ` Property key of ObjectProperty expected node to be of a type ["Identifier","StringLiteral","NumericLiteral"] but instead got "BooleanLiteral"`，很快就找到错误所在的地方，但是一直不知道如何解决这个错误，然后通过各种尝试总算是解决了这个错误，但是还是不知道错误的根本原因是什么，找个时间研究一下，下面就详细介绍一下这个问题的解决办法吧。



## 错误详情

```shell
TypeError: /Users/Leaf/Downloads/douban-book/webpack.development.config.js: Property key of ObjectProperty expected node to be of
 a type ["Identifier","StringLiteral","NumericLiteral"] but instead got "BooleanLiteral"
    at validate (/Users/Leaf/Downloads/douban-book/node_modules/babel-types/lib/definitions/index.js:109:13)
    at Object.validate (/Users/Leaf/Downloads/douban-book/node_modules/babel-types/lib/definitions/core.js:505:63)
    at Object.validate (/Users/Leaf/Downloads/douban-book/node_modules/babel-types/lib/index.js:511:9)
    at NodePath._replaceWith (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/replacement.js:176:7)
    at NodePath.replaceWith (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/replacement.js:160:8)
    at PluginPass.Identifier (/Users/Leaf/Downloads/douban-book/node_modules/babel-plugin-inline-replace-variables/lib/index.js:2
7:18)
    at newFn (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/visitors.js:276:21)
    at NodePath._call (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/context.js:76:18)
    at NodePath.call (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/context.js:48:17)
    at NodePath.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/context.js:105:12)
    at TraversalContext.visitQueue (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:150:16)
    at TraversalContext.visitSingle (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:108:19)
    at TraversalContext.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:192:19)
    at Function.traverse.node (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/index.js:114:17)
    at NodePath.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/context.js:115:19)
    at TraversalContext.visitQueue (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:150:16)
    at TraversalContext.visitMultiple (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:103:17)
    at TraversalContext.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:190:19)
    at Function.traverse.node (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/index.js:114:17)
    at NodePath.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/path/context.js:115:19)
    at TraversalContext.visitQueue (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:150:16)
    at TraversalContext.visitMultiple (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:103:17)
    at TraversalContext.visit (/Users/Leaf/Downloads/douban-book/node_modules/babel-traverse/lib/context.js:190:19)
```



## 错误描述

我在 `webpack` 配置里面使用了 `DefinePlugin`，使用了 `koa-webpack-middleware`，该配置作为开发模式下的配置，具有热更新的功能，整个配置如下：

```javascript
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractStyle = new ExtractTextPlugin('all.min.css');
const nodeModules = fs.readdirSync('node_modules')
  .filter(function (i) {
    return ['.bin', '.npminstall'].indexOf(i) === -1;
  });

const clientConfig = {
  devtool: 'cheap-source-map',
  entry: ['./client/index.js'],
  output: {
    path: 'public/build',
    filename: '[name].js',
    publicPath: '/build/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime', 'add-module-exports'],
        },
      },
      {
        test: /\.scss$/,
        loader: extractStyle.extract(['css', 'sass']),
      },
      { test: /\.woff2?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'url?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot$/, loader: 'file' },
      { test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml' },
      { test: /\.(png|jpg|jpeg|gif|webp)$/i, loader: 'url?limit=10000' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.html?$/, loader: 'file?name=[name].[ext]' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    extractStyle,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __SERVER__: false,
      __CLIENT__: true,
    }),
  ],
};

const serverConfig = {
  entry: ['./server/index.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/build/',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  node: {
    fs: 'empty',
    __dirname: true,
    __filename: true,
  },
  externals: [
    function findExternals(context, request, callback) {
      const pathStart = request.split('/')[0];
      if (pathStart && (pathStart[0] === '!') || nodeModules.indexOf(pathStart) >= 0 && request !== 'webpack/hot/signal.js') {
        callback(null, 'commonjs ' + request);
      } else {
        callback();
      }
    },
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [
            ['babel-plugin-transform-require-ignore', {
              extensions: ['.css', '.sass'],
            }],
            'add-module-exports',
            'transform-runtime',
          ],
        },
      },
      {
        test: /\.scss$/,
        loader: 'null',
      },
      { test: /\.woff2?$/, loader: 'null' },
      { test: /\.ttf$/, loader: 'null' },
      { test: /\.eot$/, loader: 'null' },
      { test: /\.svg$/, loader: 'null' },
      { test: /\.(png|jpg|jpeg|gif|webp)$/i, loader: 'url?limit=10000' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __SERVER__: true,
      __CLIENT__: false,
    }),
  ],
};

module.exports = [clientConfig, serverConfig];

```

经过排查，发现问题出在这两行，删除这两行就没事了

```javascript
__SERVER__: true,
__CLIENT__: false,
```

## 错误解决

但是我需要这两个全局变量，最后发现给这两个变量加上引号就行了，如下：

```javascript
'__SERVER__': true,
'__CLIENT__': false,
```

更正后的配置：

```javascript
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractStyle = new ExtractTextPlugin('all.min.css');
const nodeModules = fs.readdirSync('node_modules')
  .filter(function (i) {
    return ['.bin', '.npminstall'].indexOf(i) === -1;
  });

const clientConfig = {
  devtool: 'cheap-source-map',
  entry: ['./client/index.js'],
  output: {
    path: 'public/build',
    filename: '[name].js',
    publicPath: '/build/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime', 'add-module-exports'],
        },
      },
      {
        test: /\.scss$/,
        loader: extractStyle.extract(['css', 'sass']),
      },
      { test: /\.woff2?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'url?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot$/, loader: 'file' },
      { test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml' },
      { test: /\.(png|jpg|jpeg|gif|webp)$/i, loader: 'url?limit=10000' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.html?$/, loader: 'file?name=[name].[ext]' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    extractStyle,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __SERVER__: false,
      __CLIENT__: true,
    }),
  ],
};

const serverConfig = {
  entry: ['./server/index.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/build/',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  node: {
    fs: 'empty',
    __dirname: true,
    __filename: true,
  },
  externals: [
    function findExternals(context, request, callback) {
      const pathStart = request.split('/')[0];
      if (pathStart && (pathStart[0] === '!') || nodeModules.indexOf(pathStart) >= 0 && request !== 'webpack/hot/signal.js') {
        callback(null, 'commonjs ' + request);
      } else {
        callback();
      }
    },
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [
            ['babel-plugin-transform-require-ignore', {
              extensions: ['.css', '.sass'],
            }],
            'add-module-exports',
            'transform-runtime',
          ],
        },
      },
      {
        test: /\.scss$/,
        loader: 'null',
      },
      { test: /\.woff2?$/, loader: 'null' },
      { test: /\.ttf$/, loader: 'null' },
      { test: /\.eot$/, loader: 'null' },
      { test: /\.svg$/, loader: 'null' },
      { test: /\.(png|jpg|jpeg|gif|webp)$/i, loader: 'url?limit=10000' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__SERVER__': true,
      '__CLIENT__': false,
    }),
  ],
};

module.exports = [clientConfig, serverConfig];

```

## 错误原因

目前不清楚会发生这种错误的原因是什么，我开发模式下的配置并没有加引号，但并不会出现错误，一切正常，我怀疑跟热更新组件有关，希望有高人指点，唯一欣慰的一点是问题解决了。