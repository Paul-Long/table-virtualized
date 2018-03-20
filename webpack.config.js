const webpack = require('webpack');
const path = require('path');
const cpus = require('os').cpus().length;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
const WebpackMd5Hash = require('webpack-md5-hash');
const happyThreadPool = HappyPack.ThreadPool({size: cpus});
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const StatsOutPlugin = require('stats-out-plugin');

const ENV = process.env.NODE_ENV;

const config = {
  cache: true,
  entry: {
    main: path.resolve(__dirname, 'client/index.js'),
    vendor: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'client'),
      'node_modules'
    ],
    alias: {
      '@client': path.resolve(__dirname, 'client'),
      '@containers': path.resolve(__dirname, 'client/containers'),
      '@components': path.resolve(__dirname, 'client/components'),
      '@styles': path.resolve(__dirname, 'client/styles'),
      '@socket': path.resolve(__dirname, 'socket'),
    }
  },
};

// mode 环境
config.mode = ENV;

// module loaders
config.module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'client')
      ],
      // loader: 'babel-loader'
      loader: 'happypack/loader?id=js'
    }, {
      test: /\.(less|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'less-loader']
      })
    }, {
      test: /\.(png|jpe?g|gif)$/,
      include: [
        path.resolve(__dirname, './client')
      ],
      use: 'url-loader?limit=100&name=img/[name].[hash:8].[ext]'
    }, {
      test: /\.(ttf|svg|eot|woff)$/,
      include: [
        path.resolve(__dirname, './client')
      ],
      use: 'url-loader?limit=100&name=fonts/[name].[hash:8].[ext]'
    }, {
      test: /\.(svg)$/,
      include: [
        path.resolve(__dirname, './client/components/icon')
      ],
      use: 'svg-sprite-loader?limit=100&name=svg/[name].[hash:8].[ext]'
    }
  ]
};

// plugins
config.plugins = [
  new WebpackMd5Hash(),
  new CaseSensitivePathsPlugin(),
  new CleanPlugin([path.resolve(__dirname, 'dist')], {verbose: true}),
  new ExtractTextPlugin({filename: '[name].[contenthash:8].css', allChunks: true}),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: ENV === 'production'
  }),
  new HappyPack({
    id: 'js',
    threadPool: happyThreadPool,
    loaders: ['babel-loader']
  }),
  new webpack.HashedModuleIdsPlugin(),
];

// optimization
config.optimization = {
  splitChunks: {
    chunks: 'all',
    name: 'common',
    minSize: 0,
    minChunks: 1
  },
  runtimeChunk: {
    name: 'runtime'
  }
};

if (ENV === 'development') {
  config.devtool = 'eval-source-map';
  config.entry.main = ['webpack-hot-middleware/client?reload=true', config.entry.main];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (ENV === 'production') {
  config.optimization.minimize = true;
  config.optimization.noEmitOnErrors = true;
  config.optimization.concatenateModules = true;

  const stats = new StatsOutPlugin('chunkNames.json', {});
  config.plugins.push(stats);

  // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  // config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
