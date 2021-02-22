const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config({ path: path.resolve("../.env") });
const EnvironmentPlugin = require("webpack").EnvironmentPlugin;

module.exports = {
    entry: path.resolve("./src/index.tsx"),
    output: {
        filename: "bundle.js",
        publicPath: '/',
        library: 'Root',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    "css-loader",
                    "resolve-url-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    },
                    "sass-loader"]
            }, {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        }
                    },
                    "css-loader",
                    "resolve-url-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    },
                    'less-loader?javascriptEnabled=true'
                ]

            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    "css-loader",
                    "resolve-url-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }
                ]
            },
            // this rule handles images
            {
                test: /\.webp|\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
                use: 'file-loader?name=[name].[ext]?[hash]'
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
                loader: 'file-loader'
            },
            // {
            //     test: /\.otf(\?.*)?$/,
            //     use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
            // }
        ]
    },
    resolve: {
        extensions: [".scss", ".ts", ".tsx", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            alwaysWriteToDisk: true,
            cache: false,
            favicon: "src/images/favicon.ico"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyPlugin([{
            from: "src/images", to: "media/images"
        }]),
        new EnvironmentPlugin(Object.keys(process.env))
    ],
    devServer: {
        port: 8081,
        host: "192.168.56.102",
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: path.resolve("./dist"),
        open: true
    }
};
