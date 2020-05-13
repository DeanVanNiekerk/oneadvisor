const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    output: {
        filename: "dist/[name].[contenthash].js",
    },

    plugins: [new webpack.HashedModuleIdsPlugin()],

    performance: {
        hints: "error",
        maxEntrypointSize: 1390000, // 1.39 mg
        maxAssetSize: 2000000, //This is very big because of React-Pdf
    },

    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
});
