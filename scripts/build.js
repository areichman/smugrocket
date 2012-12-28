#!/usr/bin/env node

// Required modules
//
var fs   = require('fs'),
    glob = require('glob'),
    _    = require('underscore');

// Concatentate all of the js files into a single file
//


// Compile the js templates
//
glob('../app/templates/*.jst', {}, function(err, files) {
  fs.open('../tmp.app.js', 'a', 0744, function (err, fd) {
    for (var i=0; i<files.length; i++) {
      var file     = files[i],
          basename = file.split('/').pop().replace('.jst',''), 
          prefix   = 'SmugRocket.Templates.' + basename + ' = ',
          tmpl     = fs.readFileSync(file, 'utf8'),
          compiled = _.template(tmpl).source + '\n';  
      fs.writeSync(fd, prefix + compiled, null, 'utf8');
    }
  });
});
