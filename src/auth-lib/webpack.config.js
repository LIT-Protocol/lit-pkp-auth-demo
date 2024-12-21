const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.ts'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'litAuthLib'
    },
    globalObject: 'this'
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'next': 'next',
    '@walletconnect/modal': '@walletconnect/modal',
    'tweetnacl-util': 'tweetnacl-util',
    'web-vitals': 'web-vitals'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'esnext',
                moduleResolution: 'node',
                target: 'es5',
                jsx: 'react',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                skipLibCheck: true
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.m?js$/,
        include: /node_modules/,
        resolve: {
          fullySpecified: false
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-import-meta'],
            sourceType: 'unambiguous'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      events: require.resolve('events/')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node:crypto/,
      require.resolve('crypto-browserify')
    )
  ]
};
