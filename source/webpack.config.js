const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { test: /\.(png|woff|woff2|eot|ttf|svg)\??.*$/, loader: 'url-loader?limit=100000' },
            { test: /\.css$/, loader: ['style-loader', 'css-loader?modules']}
        ]
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx']
    }
};