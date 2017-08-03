# Moniker #

A pseudorandom name generator for Node.js.

## Synopsis ##

Moniker provides a default adjective/noun generator. Use it like this:

    var Moniker = require('moniker');
    console.log(Moniker.choose());
    // Example output: murky-hands
      
    console.log(Moniker.choose());
    // Example output on second run: material-authority

You can also make a custom generator. Generators create random names
using dictionaries. Moniker has built-in `noun`, `verb`, and
`adjective` dictionaries, or you can add your own.

    var Moniker = require('moniker');
    var names = Moniker.generator([Moniker.adjective, Moniker.noun]);
    console.log(names.choose());
    
If you pass a string (and optional salt) to the `choose()` function,
then the same pseudo-random name will be returned for that combination.

    var Moniker = require('moniker');    
    console.log(Moniker.choose('John Doe'));
    // Example output: absurd-discovery
      
    console.log(Moniker.choose('John Doe'));
    // Example output still: absurd-discovery
      
    console.log(Moniker.choose('John Doe', 'goodbye rainbows'));
    // Example output with salt: glorious-hospital
      
    console.log(Moniker.choose('John Doe', 'goodbye rainbows'));
    // Example output still: glorious-hospital

## Installation ##

Install Moniker using NPM:

    npm install git://github.com/UniversityofWarwick/moniker.git

## API ##

### Generators ###

**generator(dictionaries, options)**

Create a new `Generator`. When a new name is generated, a word is
chosen from each item in `dictionaries` in order.

Each dictionary may be a `Dictionary` instance, a string path to a
file of words separated by spaces or newlines, or a function that
should return a `Dictionary` when called.

The `options` are optional and are passed along to the new
`Generator` and any new `Dictionary`. They default to:

    {
      maxSize: undefined,
      encoding: 'utf-8',
      glue: '-'
    }

**Generator(options)**

A name generator. Be sure to `.use()` some dictionaries
afterward. Options may include:

    {
      glue: '-'
    }

**generator.use(dictionary, options)**

Add a new dictionary to this generator. When a new name is generated,
a word is chosen from each dictionary in order.

The `dictionary` may be a `Dictionary` instance, a string path to a
file of words separated by spaces or newlines, or a function that
should return a `Dictionary` when called. The `options` are passed
along to each newly-constructed `Dictionary`.

**generator.choose(src, salt)**

Create a new name. The arguments are optional; see `dict.choose()`
below for details.

### Dictionaries ###

**adjective(options)**

Create a `Dictionary` of using the builtin adjectives list.

**noun(options)**

Create a `Dictionary` of using the builtin noun list.

**verb(options)**

Create a `Dictionary` of using the builtin verb list.

**read(path, options)**

Create a `Dictionary` by reading words from a file. The file should be
a list of words separated by spaces or newlines.

**Dictionary()**

A dictionary is a list of words.

**dict.read(path, options)**

Load words from `path` into this dictionary. Options default to:

    {
      maxSize: undefined,
      encoding: 'utf-8',
    }

Words larger than `maxSize` are ignored.

**dict.choose(src, salt)**

Return a word from this dictionary. If a `src` is supplied, the same
word should be returned every call, otherwise it will be random.
Any supplied `salt` will salt the lookup.



