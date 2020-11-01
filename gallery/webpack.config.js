var resolve = require("path").resolve;
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var autoprefixer = require("autoprefixer");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ngtools = require("@ngtools/webpack");
require('dotenv').config({ path: resolve("../.env") });

var postcssLoader = {
    loader: "postcss-loader",
    options: {
        plugins: function () {
            return [autoprefixer];
        }
    }
};

var miniCssExtractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: process.env.NODE_ENV === "development"
    }
};

var plugins = [
    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, resolve(__dirname, "./src")),
    new HtmlWebpackPlugin({
        template: resolve(__dirname, "src/demo/index.html"),
        title: "Galeria zdjęć"
    }),
    new MiniCssExtractPlugin({
        filename: "[name].css"
    }),
    new CopyWebpackPlugin({ patterns: [{ from: resolve(__dirname, "src/demo/example-gallery-images"), to: "example-gallery-url" }], options: { concurrency: 20 } }),
    new ngtools.AngularCompilerPlugin({
        tsConfigPath: resolve(__dirname, "./tsconfig.json"),
        // entryModule: 'src/demo/app.module#AppModule',
        sourceMap: true,
        locale: "en"
    }),
    new webpack.EnvironmentPlugin(Object.keys(process.env))
];

const optimization =
    process.env.NODE_ENV === "production"
        ? { minimize: true, nodeEnv: "production" }
        : { minimize: false, nodeEnv: process.env.NODE_ENV };

module.exports = {
    entry: resolve(__dirname, "./src/demo/main.ts"),
    output: {
        filename: "bundle.js",
        path: resolve(__dirname, "./dist"), //,
        publicPath: '/gallery/'
    },
    devtool: 'eval-source-map',
    performance: {
        hints: false
    },
    optimization,
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: "@ngtools/webpack"
            },
            {
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true }
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.scss$/,
                exclude: [resolve(__dirname, "src/demo/component"), resolve(__dirname, "src/component")],
                use: [miniCssExtractLoader, "css-loader", postcssLoader, "sass-loader"]
            },
            {
                test: /\.scss$/,
                include: [resolve(__dirname, "src/demo/component"), resolve(__dirname, "src/component")],
                use: ["to-string-loader", postcssLoader, "sass-loader"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [resolve("node_modules")]
    },
    resolveLoader: {
        modules: [resolve("node_modules")]
    },
    plugins: plugins,
    devServer: {
        port: 8080,
        host: "192.168.56.102",
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: "./dist",
        open: true
    }
};
