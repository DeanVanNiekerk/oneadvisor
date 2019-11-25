var path = require("path");
var config = require("config");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const oaBaseApi = config.get("baseApi");
const appInsightsKey = config.get("appInsightsKey");
const googleAnalyticsKey = config.get("googleAnalyticsKey");

// console.log("Config Settings");
// console.log("========================================");
// console.log("environment: " + environment);
// console.log("oa.baseApi: " + oaBaseApi);
// console.log("appInsightsKey: " + appInsightsKey);
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
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["server/dist"],
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
        ]),
        new webpack.DefinePlugin({
            __OA_BASE_API__: JSON.stringify(oaBaseApi),
            __APP_INSIGHTS_KEY__: JSON.stringify(appInsightsKey),
            __GOOGLE_ANALYTICS_KEY__: JSON.stringify(googleAnalyticsKey),
        }),
    ],
};