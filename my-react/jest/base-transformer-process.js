const { transform } = require("@babel/core");

const generateProcessFunc = (presets, plugins) => {
  return (src, filename) => {
    console.log("filename..", filename);

    const result = transform(src, {
      sourceMap: "inline",
      filename,
      presets,
      plugins,
      babelrc: false,
      configFile: false,
    });

    if (!/node_modules/.test(filename) && result) {
      console.log("foo", result.code);
    }

    return result ? result.code : src;
  };
};

module.exports = {
  generateProcessFunc,
};
