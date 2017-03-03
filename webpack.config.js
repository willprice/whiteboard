const path = require('path')
const webpack = require('webpack')

const debug = process.env.NODE_ENV === 'dev'

module.exports = {
  // See https://github.com/webpack/docs/wiki/configuration#devtool for options
  //
  // eval executes each model with eval specifying a `//@ sourceURL`
  //
  // see https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
  // for more details on how sourcemaps works
  devtool: debug ? '#source-map' : false,
  // Paths in entry are resolved relative to `context`
  // defaults to process.cwd()
  context: path.join(__dirname, 'public/'),
  entry: [
    './client/app.js'
  ],
  // Instruct how compiled files should be written to disk
  output: {
    // output directory of compiled files
    path: path.join(__dirname, 'public', 'build'),
    // URL path in server from which the files can loaded
    publicPath: '/build',
    // name of each output file on disk, can only be a name, not a path
    filename: 'whiteboard.js'
  },
  plugins: debug ? [
    new webpack.NoEmitOnErrorsPlugin()
  ] : [],
  resolve: {
    modules: [
      path.resolve('./public'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        'presets': ['env']
      }
    }]
  }
}
