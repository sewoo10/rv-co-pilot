module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { unstable_transformImportMeta: true }],
    ],
     plugins: [
      ['module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',            
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],

  };
};
