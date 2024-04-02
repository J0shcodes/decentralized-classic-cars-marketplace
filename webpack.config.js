const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  mode: "development",
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    } 
  },
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    clean: true,
    assetModuleFilename: "[name][ext]"
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    //   {
    //     test: /\.js$/,
    //     exclude: /node__modules/,
    //     use: {
    //       loader: "babel-loader",
    //       options: {
    //         preset: ["@babel-preset-env"],
    //       },
    //     },
    //   },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"

      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Decentralized Classic Cars Marketplace",
      filename: "index.html",
      template: "src/template.html",
    }),
    new NodePolyfillPlugin()
  ],
};
