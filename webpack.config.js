var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: [
        './client.cjsx',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server'
    ],
    vendor: [
      'react',
      'react-router',
      'history'
    ]
  },
  output: {
    path: path.join(__dirname, './public/assets'),
    filename: 'app.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js", ".jsx", ".coffee", ".cjsx", ".sass", ".css"],
    root: path.join(__dirname, 'src'),
  },
  externals: {
    "moment": "moment",
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loader: "coffee-loader"
      },
      {
        test: /\.cjsx$/,
        loader: "react-hot!coffee!cjsx",
        exclude: /node_modules/
      },
      {
        test: /\.sass$/, // /\.scss$/, /\/styles/],
        loader: 'style!css!sass?indentedSyntax=sass',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, './public'),
    publicPath: "/assets/",
    hot: true
  }
}



// js:
//   srcFile: './app/src/client.cjsx'
//   rootPath: './app/src'
//   distPath: './dist/js'
//   distFilename: 'app.js'

// watch: watch
// cache: true
// devtool: "source-map"
// output:
//   filename: config.js.distFilename
//   sourceMapFilename: "[file].map"
// resolve:
//   root: path.resolve(config.js.rootPath),
//   extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".coffee", ".cjsx"]
//   modulesDirectories: [components_path, modules_path]
// externals:
//   "moment": "moment"
//   # "react-router": "ReactRouter"
//   # "react": 'React'
// module:
//   loaders: [
//     {
//       test: /\.coffee$/
//       loader: "coffee-loader"
//     }
//     {
//       test: [/\.js$/, /\.jsx$/]
//       exclude: [new RegExp(modules_path), new RegExp(components_path)]
//       loader: "babel-loader"
//     }
//     {
//       test: /\.cjsx$/
//       loader: "transform?coffee-reactify"
//     }
//   ]
