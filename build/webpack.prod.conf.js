'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const d = new Date();
const time = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`
const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production', // webpack3->4后添加
    module: {
        rules: utils.styleLoaders({
            sourceMap: true,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: "#source-map",
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: utils.assetsPath('js/[name].'+time+'.[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].'+time+'.[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: true,
            parallel: true
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].'+time+'.[contenthash].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
                map: {
                    inline: false
                }
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            //filename: 'index.html', //路径相对于output.path 默认是index.html
            template: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
        }])
    ]
})
//生成分析图表
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// webpackConfig.plugins.push(new BundleAnalyzerPlugin())
module.exports = webpackConfig
