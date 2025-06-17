const path = require('path');

module.exports ={
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: '/dist/' // Указываем publicPath
    },

   devServer: {
  host: '0.0.0.0',
  port: 8080,
  allowedHosts: ['.digitalshadows.run.place', 'localhost'], // точка в начале = все поддомены
  hot: true,
  historyApiFallback: true,
  open: {
    target: 'index.html'
  },
  static: {
    directory: path.join(__dirname, 'dist')
  }
}
};