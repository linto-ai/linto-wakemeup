const path = require('path')
module.exports = {
  configureWebpack: config => {
    config.mode = 'production';
    config.devtool = false;
  },
  outputDir: path.resolve(__dirname, '../webserver/dist'),
  publicPath: path.resolve(__dirname, '/assets'),
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page'
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./public/styles/sass/styles.scss")]
    }
  }
}
