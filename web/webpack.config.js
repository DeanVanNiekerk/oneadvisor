var path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.jsx'
    },

    devtool: 'eval',

    devServer: {
        https: true,
        port: 5001,
        contentBase: './dist',
        hot: true,
        historyApiFallback: true
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    resolve: {
        alias: {
            config: path.resolve(__dirname, 'src/config/'),
            state: path.resolve(__dirname, 'src/state/'),
            ui: path.resolve(__dirname, 'src/ui/'),
            '@': path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebPackPlugin({
            template: './public/index.html',
            filename: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ErrorOverlayPlugin()
    ]
};
