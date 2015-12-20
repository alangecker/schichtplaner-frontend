module.exports =
  port: 4000
  gulp:
    srcPath: "./app"
    distPath: "./dist"

    js:
      srcFile: './app/src/client.cjsx'
      rootPath: './app/src'
      distPath: './dist/js'
      distFilename: 'app.js'

    css:
      srcFile: './app/styles/app.sass'
      srcPath: './app/styles'
      distPath: './dist/css'
