const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    devtool: "eval-source-map",

    output: {
        filename: "dist/bundle.js",
    },

    devServer: {
        https: true,
        port: 5002,
        contentBase: "./dist",
        hot: true,
        historyApiFallback: true,
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],
});
