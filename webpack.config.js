const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].bundle.js",
    },
    entry: {
        index: "./src/index.js",
        background: "./src/utils/findSelector.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "src/img",
                    to: "static",
                },
                {
                    from: "manifest.json",
                    to: "manifest.json"
                }
            ],
        }),
    ],
    devServer: {
        port: 3030, // you can change the port
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // .js and .jsx files
                exclude: /node_modules/, // excluding the node_modules folder
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(sa|sc|c)ss$/, // styles files
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
        ],
    },
};