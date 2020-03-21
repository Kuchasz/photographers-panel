const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: path.resolve("./src/index.tsx"),
    output: {
        filename: "bundle.js"
    },
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "resolve-url-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [require('autoprefixer')]
                            }
                        }, "sass-loader"]
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        'less-loader?javascriptEnabled=true'
                    ]
                })
            }
            // this rule handles images
            // {
            //     test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
            //     use: 'file-loader?name=[name].[ext]?[hash]'
            // },
            //
            // // the following 3 rules handle font extraction
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            // },
            //
            // {
            //     test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: 'file-loader'
            // },
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
            cache: false
        }),
        new ExtractTextPlugin("styles.css")
    ],
    devServer: {
        port: 8080,
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
