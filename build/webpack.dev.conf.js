// 'use strict'
const path = require('path')
// const StyleLintPlugin = require('stylelint-webpack-plugin')

const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')


const getIpAddress = () => {
    let ip = ''
    const interfaces = require('os').networkInterfaces()
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            const alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ip = alias.address
                console.log(`running on ${ip}`)
                return ip
            }
        }
    }
    console.log(`running on localhost`)
    return 'localhost'
}
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development', // webpack3->4后添加
    module: {
        rules: utils.styleLoaders({
            sourceMap: false,
            usePostCSS: true
        })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: 'eval-source-map',
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: getIpAddress(),
        port: 8080,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        publicPath: '/',
        proxy: {
            '/template/': {
                // target: 'http://' + getIpAddress() + ':3034',
                target: `http://${getIpAddress()}:3000`,
                changeOrigin: true, // set the option changeOrigin to true for name-based virtual hosted sites
                pathRewrite: {
                    '^/template/': '/template/'
                }
            }
        },
        quiet: true,
        watchOptions: {
            poll: false
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // new StyleLintPlugin({
        //     context: 'src',
        //     // configFile: path.resolve(__dirname, '../stylelint.config.js'),
        //     files: '**/*.vue'
        //     // failOnError: false,
        //     // quiet: true
        // }),
        // new SpritesmithPlugin({
        //     // 解决白边问题
        //     spritesmithOptions: {
        //         padding: 4,
        //         algorithm: 'top-down'
        //     },
        //     src: {
        //         cwd: path.resolve(__dirname, '../static/icons'),
        //         glob: '*.png'
        //     },
        //     target: {
        //         image: path.resolve(__dirname, '../static/sprites/sprite.png'),
        //         // 默认配置css: path.resolve(__dirname, '../src/sprites/sprite.css')
        //         css: [
        //             [path.resolve(__dirname, '../static/sprites/sprite.css'), {
        //                 format: 'function_based_template'
        //             }]
        //         ]//自定义css模板
        //     },
        //     apiOptions: {
        //         cssImageRef: '../../static/sprites/sprite.png'
        //     },
        //     customTemplates: {
        //         'function_based_template': templateFunction
        //     }
        // })
    ]
})
module.exports = devWebpackConfig
