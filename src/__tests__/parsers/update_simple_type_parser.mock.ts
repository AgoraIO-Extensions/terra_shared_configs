module.exports = {
  'Test': 'ABC',
  '^Optional<(.*)>': '$1',
  'customHook': () => {
    return 'customHook';
  },
};
