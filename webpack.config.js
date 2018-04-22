const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve("./src/index.tsx"),
  output: {
    filename: "bundle.js"
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader"
        })
      },
      {
        test: /\.(png|woff|eot|woff2|eot|ttf|svg)$/,
        use: "url-loader?limit=100000"
      }
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
    host: "localhost",
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    contentBase: path.resolve("./dist"),
    open: true
  }
};
