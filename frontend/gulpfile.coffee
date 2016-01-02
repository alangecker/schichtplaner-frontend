gulp = require 'gulp'
gutil = require 'gulp-util'
nodemon = require 'gulp-nodemon'
plumber = require 'gulp-plumber'
gwebpack = require 'gulp-webpack'
sass = require 'gulp-sass'
postcss = require 'gulp-postcss'
autoprefixer = require 'autoprefixer-core'
GLOBAL.Promise = (require 'es6-promise').Promise # to make gulp-postcss happy
config = require('./config').gulp
path = require 'path'
components_path = "bower_components"
modules_path = "node_modules"

err = (x...) -> gutil.log(x...); gutil.beep(x...)

webpack = (name, ext, watch) ->



js = (watch) ->
  file =
  options =
#    bail: true
    watch: watch
    cache: true
    devtool: "source-map"
    output:
      filename: config.js.distFilename
      sourceMapFilename: "[file].map"
    resolve:
      root: path.resolve(config.js.rootPath),
      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".coffee", ".cjsx"]
      modulesDirectories: [components_path, modules_path]
    externals:
      "moment": "moment"
      # "react-router": "ReactRouter"
      # "react": 'React'
    module:
      loaders: [
        {
          test: /\.coffee$/
          loader: "coffee-loader"
        }
        {
          test: [/\.js$/, /\.jsx$/]
          exclude: [new RegExp(modules_path), new RegExp(components_path)]
          loader: "babel-loader"
        }
        {
          test: /\.cjsx$/
          loader: "transform?coffee-reactify"
        }
      ]


  gulp.src(config.js.srcFile)
  .pipe(gwebpack(options))
  .pipe(gulp.dest(config.js.distPath))

gulp.task 'js', -> js(false)

gulp.task 'js-dev', -> js(true)

gulp.task 'css', ->
  gulp.src(config.css.srcFile)
  .pipe(plumber())
  .pipe(sass())
  .on('error', err)
  .pipe(postcss([autoprefixer(browsers: ["last 2 versions", "ie 8", "ie 9"])]))
  .pipe(gulp.dest(config.css.distPath))

gulp.task 'copy', ->
  gulp.src("#{config.srcPath}/*.html").pipe(gulp.dest(config.distPath))
  gulp.src("#{config.srcPath}/favicon.ico").pipe(gulp.dest(config.distPath))

gulp.task 'build', ['copy', 'css', 'js']

server_main = "./server.coffee"
gulp.task 'server', ->
  nodemon
    script: server_main
    watch: [server_main]
    execMap:
      coffee: "#{modules_path}/.bin/coffee"

gulp.task 'default', ['copy', 'css', 'server', 'js-dev', 'watch']

gulp.task 'watch', ['copy'], ->
  gulp.watch(["#{config.mainPath}/**/**/**/**/**/*.*"])
  gulp.watch ["#{config.css.srcPath}/**/**/**/**/**/**/*.sass"], ['css']
  gulp.watch ["#{config.mainPath}/**/**/**/*.html"], ['copy']
