var path = require('path');
var config = require('config');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const oidcConfig = config.get('oidc');
const oaBaseApi = config.get('baseApi');

console.log('Config Settings');
console.log('========================================');
console.log('environment: ' + process.env.NODE_ENV);
console.log('oidcConfig.clientId: ' + oidcConfig.clientId);
console.log('oidcConfig.issuer: ' + oidcConfig.issuer);
console.log('oa.baseApi: ' + oaBaseApi);
console.log('========================================');

module.exports = {
    entry: {
        app: './src/index.tsx'
    },

    output: {
        path: path.resolve(__dirname, 'server'),
        publicPath: '/'
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
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
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['server/dist']),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'template', 'index.html'),
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            __OIDC_CLIENT_ID__: JSON.stringify(oidcConfig.clientId),
            __OIDC_ISSUER__: JSON.stringify(oidcConfig.issuer),
            __OA_BASE_API__: JSON.stringify(oaBaseApi)
        })
    ]
};
