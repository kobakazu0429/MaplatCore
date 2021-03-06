"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");

module.exports = merge(common, {
  entry: {
    "maplat_core": path.resolve(__dirname, "../tmpl/web-bridge_packed.js")
  },

  output: {
    path: path.resolve(__dirname, "../dist_packed"),
    filename: '[name].js'
  },

  devServer: {
    openPage: "index_packed.html",
  }
});
