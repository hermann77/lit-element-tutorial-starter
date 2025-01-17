const { merge } = require('webpack-merge');

const loadPresets = (env = { presets: [] }) => {
  const presets = env.presets || [];

  const mergedPresets = [].concat(...[presets]);
  const mergedConfigs = mergedPresets.map(presetName => {
    return require(`./presets/webpack.${presetName}`)(env);
  });

  return merge({}, ...mergedConfigs);
};

module.exports = loadPresets;
