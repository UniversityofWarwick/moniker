var Assert = require('assert'),
    M = require('../lib/moniker');

module.exports = {
  'the default generator works': function() {
    Assert.equal(typeof M.choose(), 'string');
  },

  'names are random': function() {
    var names = M.generator([M.adjective, M.noun], { maxSize: 7 });
    Assert.equal(typeof names.choose(), 'string');
    Assert.notEqual(names.choose(), names.choose());
  },

  'names based on same source string are repeated': function() {
    var names = M.generator([M.adjective, M.noun], { maxSize: 7 });
    Assert.equal(names.choose('test phrase'), names.choose('test phrase'));
  },

  'names based on different source string are different': function() {
    var names = M.generator([M.adjective, M.noun], { maxSize: 7 });
    Assert.notEqual(names.choose('first test phrase'), names.choose('second test phrase'));
  },

  'names based on same source string with different salts are different': function() {
    var names = M.generator([M.adjective, M.noun], { maxSize: 7 });
    Assert.notEqual(names.choose('another test phrase', 'sodium chloride'), names.choose('another test phrase', 'NaCl'));
    Assert.notEqual(names.choose('another test phrase', 'sodium chloride'), names.choose('another test phrase'));
  }
};