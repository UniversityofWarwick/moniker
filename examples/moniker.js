var Moniker = require('moniker');

var names = Moniker.generator([Moniker.adjective, Moniker.noun]);

console.log(names.choose());
console.log(names.choose('Jane Doe'));
console.log(names.choose('Jane Doe', 'Have salt in yourselves, and be at peace with one another.'));