// import { join, resolve, dirname } from 'path';
// import webpack from 'webpack';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import { AngularWebpackPlugin } from '@ngtools/webpack';
// // import linkerPlugin from '@angular/compiler-cli/linker/babel';
// import { config } from 'dotenv';
// import { fileURLToPath } from 'url';

import { join, resolve, dirname } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { createRequire } from 'module';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { AngularWebpackPlugin } from '@ngtools/webpack';
import linkerPlugin from '@angular/compiler-cli/linker/babel';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
    path: resolve('../.env'),
});

const rootModuleDirectory = (packageName) => join(__dirname, '../../node_modules/', packageName);

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

var miniCssExtractLoader = {
    loader: MiniCssExtractPlugin.loader,
};

var plugins = [
    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, resolve(__dirname, './src')),
    new HtmlWebpackPlugin({
        template: resolve(__dirname, 'src/demo/index.html'),
        title: 'Galeria zdjęć',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new AngularWebpackPlugin({
        tsconfig: resolve(__dirname, './tsconfig.json'),
        jitMode: false,
        enableIvy: false,
        angularCompilerOptions: {
            enableIvy: false,
        },
        // entryModule: 'src/demo/app.module#AppModule',
        // sourceMap: true,
        // locale: 'en',
    }),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
];

const optimization =
    process.env.NODE_ENV === 'production'
        ? {
              minimize: true,
              nodeEnv: 'production',
          }
        : {
              minimize: false,
              nodeEnv: process.env.NODE_ENV,
          };

export default {
    entry: resolve(__dirname, './src/demo/main.ts'),
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, './dist'), //,
        publicPath: '/galeria/',
    },
    devtool: 'eval-source-map',
    performance: {
        hints: false,
    },
    optimization,
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack',
                include: [
                    join(__dirname, 'src'),
                    // rootModuleDirectory('@pp/server'),
                    rootModuleDirectory('@pp/utils'),
                    rootModuleDirectory('@pp/api'),
                ],
                options: {
                    jitMode: false,
                    enableIvy: false,
                },
            },
            {
                test: /\.m?js$/,
                resolve: { fullySpecified: false },
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [linkerPlugin],
                    },
                },
            },
            {
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: {
                    system: true,
                },
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
            },
            {
                test: /\.scss$/,
                exclude: [resolve(__dirname, 'src/demo/component'), resolve(__dirname, 'src/component')],
                use: [miniCssExtractLoader, cssLoader, postcssLoader, 'sass-loader'],
            },
            {
                test: /\.scss$/,
                include: [resolve(__dirname, 'src/demo/component'), resolve(__dirname, 'src/component')],
                use: ['to-string-loader', cssLoader, postcssLoader, 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'file-loader?name=fonts/[name].[ext]',
            },
        ],
    },
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.js'],
        modules: [resolve('node_modules'), resolve('../node_modules'), resolve('../../node_modules')],
        fallback: {
            timers: require.resolve('timers-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: false,
        },
    },
    resolveLoader: {
        modules: [resolve('node_modules'), resolve('../node_modules'), resolve('../../node_modules')],
    },
    plugins: plugins,
    devServer: {
        port: 8081,
        host: '192.168.1.68',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        contentBase: './dist',
        open: true,
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ['/dist/'],
    },
};
