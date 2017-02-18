/* eslint-disable max-len */
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const __NODE_ENV__ = process.env.NODE_ENV;
const __PWA_ENV__ = process.env.PWA_ENV;
const __PWA_PUBLIC_PATH__ = process.env.PWA_PUBLIC_PATH;

const ifProd = (value, alternate) =>
  (__NODE_ENV__ === 'production' ? value : alternate);

export default {
  entry: './server/index.js',

  target: 'node',

  externals: [
    nodeExternals({ whitelist: [/\.css$/] }),
    /assetsMap.json/,
  ],

  output: {
    path: './build/server',
    publicPath: __PWA_PUBLIC_PATH__,
    filename: 'index.js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs',
  },

  module: {
    rules: ifProd([
      { test: /\.css$/, use: ['isomorphic-style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(gif|png|jpe?g|svg|ico)$/i, use: [{ loader: 'file-loader', options: { name: 'assets/images/[name].[hash:8].[ext]' } }] },
      { test: /\.(woff(2)?|ttf|otf|eot)(\?[a-z0-9=&.]+)?$/, use: [{ loader: 'url-loader', options: { limit: 1000, name: 'assets/fonts/[name].[hash:8].[ext]' } }] },
    ], [
      { test: /\.css$/, use: ['isomorphic-style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: [{ loader: 'babel-loader', options: { cacheDirectory: 'babel_cache' } }] },
      { test: /\.(gif|png|jpe?g|svg|ico)$/i, use: [{ loader: 'file-loader', options: { name: 'assets/images/[name].[ext]' } }] },
      { test: /\.(woff(2)?|ttf|otf|eot)(\?[a-z0-9=&.]+)?$/, use: [{ loader: 'url-loader', options: { limit: 1000, name: 'assets/fonts/[name].[ext]' } }] },
    ]),
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': ifProd('"production"', '"development"'),
      __BROWSER__: false,
      __PWA_ENV__: JSON.stringify(__PWA_ENV__),
      __LOCAL__: __PWA_ENV__ === 'local',
    }),
    ...ifProd([
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ], [
      new webpack.NamedModulesPlugin(),
    ]),
  ],

  devtool: 'source-map',
};
