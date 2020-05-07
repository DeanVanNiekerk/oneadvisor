const path = require("path");
const config = require("config");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const oaBaseApi = config.get("baseApi");
const environment = config.get("environment");
const fullStoryKey = config.get("fullStoryKey");

// console.log("Config Settings");
// console.log("========================================");
// console.log("environment: " + environment);
// console.log("oa.baseApi: " + oaBaseApi);
// console.log("========================================");

module.exports = {
    entry: {
        app: "./src/index.tsx",
    },

    output: {
        path: path.resolve(__dirname, "server"),
        publicPath: "/",
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },

    plugins: [
        new AntdDayjsWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "dist/[name].[contenthash].css",
            chunkFilename: "dist/[id].[contenthash].css",
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "server/dist")],
        }),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, "template/index.html"),
            filename: "index.html",
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "template/favicon.png"),
                to: path.resolve(__dirname, "server/dist"),
            },
            {
                from: path.resolve(__dirname, "template/fonts"),
                to: path.resolve(__dirname, "server/dist/fonts"),
            },
        ]),
        new webpack.DefinePlugin({
            __ENVIRONMENT__: JSON.stringify(environment),
            __OA_BASE_API__: JSON.stringify(oaBaseApi),
            __FULLSTORY_KEY__: JSON.stringify(fullStoryKey),
        }),
    ],
};
