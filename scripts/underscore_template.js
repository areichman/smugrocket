#!/usr/bin/env node

// Compile and underscore js template and send the results to stdout
var fs       = require('fs'), 
    _        = require('underscore');
    file     = process.argv.pop();
    tmpl     = fs.readFileSync(file, 'utf8'),
    compiled = _.template(tmpl).source;

console.log(compiled);

