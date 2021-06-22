module.exports = {
  devServer: {
    https: true,
    port: 8080,
    host: '0.0.0.0',
    hot: true,
  },
  configureWebpack: {
    module: {
    rules: [
        {
          test: /\.(glb)(\?.*)?$/,
            use: [{
              loader: 'file-loader',
              options: {}
            }]
        },
      ],
    }
  }
}