module.exports = {
    presets: [
      '@babel/preset-env',
      [ 
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    plugins: ["@babel/plugin-transform-react-jsx"]
  };