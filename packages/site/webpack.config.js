const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config({
    path: path.resolve('../.env'),
});
const EnvironmentPlugin = require('webpack').EnvironmentPlugin;
const ProfilingPlugin = require('webpack').debug.ProfilingPlugin;

var postcssLoader = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [['autoprefixer', {}]],
        },
    },
};

var cssLoader = {
    loader: 'css-loader',
    options: {
        esModule: false,
    },
};

var lessLoader = {
    loader: 'less-loader',
    options: {
        lessOptions: {
            javascriptEnabled: true,
        },
    },
};

var fileLoader = {
    loader: 'file-loader',
    options: {
        esModule: false,
        name: '[name].[ext]?[hash]',
    },
};

module.exports = {
    entry: path.resolve('./src/index.tsx'),
    output: {
        filename: 'bundle.js',
        publicPath: '/',
        library: 'Root',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    cssLoader,
                    'resolve-url-loader',
                    postcssLoader,
                    'sass-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    cssLoader,
                    'resolve-url-loader',
                    postcssLoader,
                    lessLoader,
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    cssLoader,
                    'resolve-url-loader',
                    postcssLoader,
                ],
            },
            // this rule handles images
            {
                test: /\.webp|\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
                use: [fileLoader],
            },
            //
            // // the following 3 rules handle font extraction
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            // },
            //
            {
                test: /\.(ttf|eot|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [fileLoader],
            },
            // {
            //     test: /\.otf(\?.*)?$/,
            //     use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
            // }
        ],
    },
    resolve: {
        extensions: ['.scss', '.ts', '.tsx', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            alwaysWriteToDisk: true,
            cache: false,
            favicon: 'src/images/favicon.ico',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/images',
                    to: 'media/images',
                },
            ],
        }),
        new EnvironmentPlugin(Object.keys(process.env)),
    ],
    devServer: {
        port: 8081,
        host: 'localhost',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        contentBase: path.resolve('./dist'),
        open: true,
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ['/dist/'],
    },
};
