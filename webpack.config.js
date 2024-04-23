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
        open: {
            target: 'index.html' // указываем цель открытия
        },
        static: {
            directory: path.join(__dirname, 'dist') // указываем папку dist как статическую директорию
        }
    }
};