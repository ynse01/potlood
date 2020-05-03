const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/potlood.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options:  {
                        transpileOnly: true
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js']
    },
    optimization: {
        minimize: true
    },
    output: {
        filename: 'potlood.min.js',
        path: path.resolve(__dirname, '../dist'),
        library: 'Potlood',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    stats: {
        modules: false
    }
}