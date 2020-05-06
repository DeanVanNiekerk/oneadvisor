const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    output: {
        filename: "dist/[name].[contenthash].js",
    },

    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        // Ignore all locale files of moment.js
        //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    performance: {
        hints: "error",
        maxEntrypointSize: 1450000,
        maxAssetSize: 2000000,
    },

    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
});
