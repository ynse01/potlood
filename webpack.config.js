const path = require('path');

module.exports = {
    mode: 'development',
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
    output: {
        filename: 'potlood.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Potlood',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    stats: {
        modules: false
    }
}