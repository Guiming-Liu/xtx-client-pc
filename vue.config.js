const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // __dirname是一个全局对象，不用导入，可以在所有node.js模块中使用
        // __dirname总是指向被执行文件的绝对路径
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  devServer: {
    allowedHosts: "all",
    open:true,
    port: 8080,
  //   https: false,
    host:'127.0.0.1'
  },
  // chainWebpack: config => {
    // 图片加载
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => Object.assign(options, { limit: 10000 }))

    // 开启IP域名访问
  //   config.devServer.disableHostCheck(true)
  // },
  //设置外部扩展，模块为qc，变量名为QC，导入qc将不做打包
  // configureWebpack: {
  //   externals: {
  //     qc: 'QC'
  //   }
  // }
})
