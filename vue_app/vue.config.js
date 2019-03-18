const path = require('path')
module.exports = {
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
    },
    interface: {
      // entry for the page
      entry: 'src/interface.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'interface.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Interface'
    }
  }
}
