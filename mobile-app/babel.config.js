module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove console.* in production builds (keep error/warn for debugging)
      process.env.NODE_ENV === 'production' ? [
        'transform-remove-console',
        {
          exclude: ['error', 'warn']
        }
      ] : []
    ],
  };
};