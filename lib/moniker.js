var Fs = require('fs'),
    Path = require('path');

exports.choose = choose;
exports.noun = noun;
exports.verb = verb;
exports.adjective = adjective;
exports.read = read;
exports.generator = generator;
exports.Dictionary = Dictionary;
exports.Generator = Generator;


// ## Shortcuts ##

function noun(opt) {
  return read(builtin('nouns'), opt);
}

function verb(opt) {
  return read(builtin('verbs'), opt);
}

function adjective(opt) {
  return read(builtin('adjectives'), opt);
}

function read(path, opt) {
  return (new Dictionary()).read(path, opt);
}

function generator(dicts, opt) {
  var gen = new Generator(opt);

  dicts.forEach(function(dict) {
    gen.use(dict, opt);
  });

  return gen;
}

var _names;
function choose(src, salt) {
  if (!_names)
    _names = generator([adjective, noun]);
  return _names.choose(src, salt);
}

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// ## Dictionary ##

function Dictionary() {
  this.words = [];
}

Dictionary.prototype.read = function(path, opt) {
  var words = this.words,
      maxSize = opt && opt.maxSize,
      enc = (opt && opt.encoding) || 'utf-8',
      data = Fs.readFileSync(path, enc);

  data.split(/\s+/).forEach(function(word) {
    if (word && (!maxSize || word.length <= maxSize))
      words.push(word);
  });

  return this;
};

Dictionary.prototype.choose = function(src, salt) {
  var range = this.words.length, moniker;
  if (typeof src == 'string' && src.trim().length) {
      var clearText = '' + (salt || '') + src;
      var hash = hashString(clearText);
      moniker = this.words[hash % range];
  } else {
      moniker = this.words[random(range)];
  }
  return moniker;
};


// ## Generator ##

function Generator(opt) {
  this.dicts = [];
  this.glue = (opt && opt.glue) || '-';
}

Generator.prototype.choose = function(src, salt) {
  var dicts = this.dicts,
      size = dicts.length;

  if (size === 0)
    throw new Error('no available dictionaries.');

  if (size === 1)
    return dicts[0].choose(src, salt);

  var probe, tries = 10, used = {};
  var seq = dicts.map(function(dict) {
    for (var i = 0; i < tries; i++) {
      if (!used.hasOwnProperty(probe = dict.choose(src, salt)))
        break;
    }

    if (i === tries)
      throw new Error('too many tries to find a unique word');

    used[probe] = true;
    return probe;
  });

  return seq.join(this.glue);
};

Generator.prototype.use = function(dict, opt) {
  var dicts = this.dicts;

  if (dict instanceof Dictionary)
    dicts.push(dict);
  if (typeof dict == 'string')
    dicts.push((new Dictionary()).read(dict, opt));
  else if (typeof dict == 'function')
    dicts.push(dict(opt));
  else
    next(new Error('unrecognized dictionary type'));

  return this;
};


// ## Helpers ##

function builtin(name) {
  return Path.join(__dirname, '../dict', name + '.txt');
}

function random(limit) {
  return Math.floor(Math.random() * limit);
}
