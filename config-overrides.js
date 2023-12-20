module.exports = function override(config) {
  return {
    ...config,
    ignoreWarnings: [
      {
        // react-script@5アップによるWarning(Failed to parse source map of react-double-scrollbar)を回避するために追加
        module: /node_modules\/react-double-scrollbar/,
      },
    ],
  };
};
