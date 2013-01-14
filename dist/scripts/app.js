// Create the app namespace
var SmugRocket = {
  Models:      {},
  Collections: {},
  Views:       {},
  Templates:   {},
  Lib:         {},
  
  initialize: function() {
    new SmugRocket.Router();
    Backbone.history.start();
  }
};

// Initialize the app when the page is ready
$(function() { 
  SmugRocket.initialize();
  console.log('SmugRocket started.');
});
SmugRocket.Router = Backbone.Router.extend({
  transition: function(view) {    
    // Render new content
    if (view.$el.hasClass('stage-right')) {
      $('.stage-center').removeClass('stage-center').addClass('stage-left');
      view.$el.removeClass('stage-right').addClass('stage-center');
      view.render();
    }
    
    // Move back in our history
    if (view.$el.hasClass('stage-left')) {
      $('.stage-center').removeClass('stage-center').addClass('stage-right');
      view.$el.removeClass('stage-left').addClass('stage-center');
      setTimeout(function() { $('.stage-right').reset(); }, 500);  // account for css transition timing
    }
    
    this.currentView = view;
  },
  
  routes: {
    '':                'home',
    '!/':              'home',
    '!/login':         'login',
    '!/galleries':     'galleryIndex',
    '!/galleries/:id': 'galleryDetails'
  },
  
  home: function() {
    var view = new SmugRocket.Views.Home();
    SmugRocket.transition(view);
  },
  
  login: function() {
    var view = new SmugRocket.Views.Login();
    SmugRocket.transition(view);
  },
  
  galleryIndex: function() {
    var view = new SmugRocket.Views.GalleryIndex();
    SmugRocket.transition(view);
  },
  
  galleryDetails: function(id) {
    var view = new SmugRocket.Views.GalleryDetails();
    SmugRocket.transition(view);
  }
});
SmugRocket.getRequestToken = function() {
  var auth = OAuthSimple().sign({
    path: 'https://api.smugmug.com/services/api/json/1.3.0/',
    parameters: 'Callback=SmugRocket.authorizeRequestToken&method=smugmug.auth.getRequestToken',
    signatures: {
      api_key:      'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI', 
      shared_secret:'f7e083fd7f0e6925767ab5824bad1a43'
    }
  });
  $.ajaxJSONP({url: auth.signed_url});
}
  
SmugRocket.authorizeRequestToken = function(data) {
  localStorage.oauth_token_id = data.Auth.Token.id;
  localStorage.oauth_token_secret = data.Auth.Token.Secret;
  var view = new SmugRocket.Views.Login({
    url: 'https://api.smugmug.com/services/oauth/authorize.mg?oauth_token=' + data.Auth.Token.id
  });
  SmugRocket.transition(view);
}
  
SmugRocket.getAccessToken = function() {
  var auth = OAuthSimple().sign({
    path: 'https://api.smugmug.com/services/api/json/1.3.0/',
    parameters: 'Callback=SmugRocket.saveAccessToken&method=smugmug.auth.getAccessToken',
    signatures: {
      api_key:       'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI', 
      shared_secret: 'f7e083fd7f0e6925767ab5824bad1a43',
      oauth_token:   localStorage.oauth_token_id,
      oauth_secret:  localStorage.oauth_token_secret
    }
  });
  $.ajaxJSONP({url: auth.signed_url});
}

SmugRocket.saveAccessToken = function(data) {
  console.log(data);
}
// based on http://blog.andydenmark.com/2009/03/how-to-build-oauth-consumer.html

SmugRocket.Lib.Oauth = function() {
  this.requestTokenUrl = 'https://api.smugmug.com/services/api/json/1.3.0/';
  this.authorizeUrl    = 'https://api.smugmug.com/services/oauth/authorize.mg';
  this.accessTokenUrl  = 'https://api.smugmug.com/services/oauth/getAccessToken.mg';
  
  this.params = {
    oauth_consumer_key:     'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI',  // provided by SmugMug
    oauth_consumer_secret:  'f7e083fd7f0e6925767ab5824bad1a43',  // provided by SmugMug
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version:          '1.0',
    oauth_nonce:            this.nonce(),
    oauth_timestamp:        this.timestamp(),
    Callback:               'SmugRocket.Lib.Oauth.storeRequestToken'
  };
};

// Get the current timestamp
//
SmugRocket.Lib.Oauth.prototype.timestamp = function() {
  var date = new Date();
  return Math.floor(date/1000);
};

// Create a unique number, used only once
//
SmugRocket.Lib.Oauth.prototype.nonce = function() {
  var str = '', chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  for (var i = 0; i < 30; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  //return str + this.timestamp();
  return this.timestamp();
};

// Create a string of all request params, sorted by their key
//
SmugRocket.Lib.Oauth.prototype.sortedParams = function() {
  var _this = this, sorted = {}, keys = _.keys(this.params).sort();
  _.each(keys, function(key) {
    sorted[key] = _this.params[key];
  });
  return _.map(sorted, function(val,key) { return key + '=' + val }).join('&');
};

// Determine the signature base string
//
SmugRocket.Lib.Oauth.prototype.signatureBaseString = function() {
  return ['GET', encodeURIComponent(this.requestTokenUrl), encodeURIComponent(this.sortedParams())].join('&');
};

// Create the signature that will be sent with the request
//
SmugRocket.Lib.Oauth.prototype.signature = function() {
  return b64_hmac_sha1(this.params.oauth_consumer_secret+'&', this.signatureBaseString());
};

// Get the unauthorized request token
//
SmugRocket.Lib.Oauth.prototype.getRequestToken = function() {
  this.params.method = 'smugmug.auth.getRequestToken';
  this.params.oauth_signature = this.signature();
  $.ajaxJSONP({url: this.requestTokenUrl + '?' + this.sortedParams()});
};

// Store the request token in localStorage
//
SmugRocket.Lib.Oauth.storeRequestToken = function(data) {
	console.log(data);
  localStorage.oauth_token_id = data.Auth.Token.id;
  localStorage.oauth_token_secret = data.Auth.Token.Secret;
  //window.location = 'http://api.smugmug.com/services/oauth/authorize.mg?oauth_token=' + data.Auth.Token.id;
};
// based on http://blog.andydenmark.com/2009/03/how-to-build-oauth-consumer.html

SmugRocket.Lib.Oauth = function() {
  this.consumerKey     = 'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI';  // provided by SmugMug
  this.consumerSecret  = 'f7e083fd7f0e6925767ab5824bad1a43';  // provided by SmugMug
  this.apiUrl          = 'https://api.smugmug.com/services/api/json/1.3.0/';
  this.authorizeUrl    = 'https://api.smugmug.com/services/oauth/authorize.mg';
  
  this.params = {
    oauth_consumer_key:     'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI',  // provided by SmugMug
    oauth_consumer_secret:  'f7e083fd7f0e6925767ab5824bad1a43',  // provided by SmugMug
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version:          '1.0',
    oauth_nonce:            this.nonce(),
    oauth_timestamp:        this.timestamp(),
    Callback:               'SmugRocket.Lib.Oauth.storeRequestToken'
  };
};

SmugRocket.Lib.Oauth.prototype = {
  sign: function(key, secret) {
    // get the current timestamp
    var timestamp = Math.floor(new Date() / 1000);
    
    // create a number, used only once
    var str = '', chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    for (var i = 0; i < 30; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    var nonce = str + this.timestamp();
    
    // sort the request params by their key
    var params = {
      oauth_consumer_key:     'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI',  // provided by SmugMug
      oauth_consumer_secret:  'f7e083fd7f0e6925767ab5824bad1a43',  // provided by SmugMug
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version:          '1.0',
      oauth_nonce:            this.nonce(),
      oauth_timestamp:        this.timestamp(),
      Callback:               'SmugRocket.Lib.Oauth.storeRequestToken'
    };
    var sorted = {}, keys = _.keys(params).sort();
    _.each(keys, function(key) {
      sorted[key] = params[key];
    });
    return _.map(sorted, function(val,key) { return key + '=' + val }).join('&');
  }  
};


// Determine the signature base string
//
SmugRocket.Lib.Oauth.prototype.signatureBaseString = function() {
  return ['GET', encodeURIComponent(this.requestTokenUrl), encodeURIComponent(this.sortedParams())].join('&');
};

// Create the signature that will be sent with the request
//
SmugRocket.Lib.Oauth.prototype.signature = function() {
  return b64_hmac_sha1(this.params.oauth_consumer_secret+'&', this.signatureBaseString());
};

// Get the unauthorized request token
//
SmugRocket.Lib.Oauth.prototype.getRequestToken = function() {
  this.params.method = 'smugmug.auth.getRequestToken';
  this.params.oauth_signature = this.signature();
  $.ajaxJSONP({url: this.requestTokenUrl + '?' + this.sortedParams()});
};

// Store the request token in localStorage
//
SmugRocket.Lib.Oauth.storeRequestToken = function(data) {
	console.log(data);
  localStorage.oauth_token_id = data.Auth.Token.id;
  localStorage.oauth_token_secret = data.Auth.Token.Secret;
  //window.location = 'http://api.smugmug.com/services/oauth/authorize.mg?oauth_token=' + data.Auth.Token.id;
};
Backbone.View.prototype.reset = function() {
  this.$el.empty().off();
};
// Perform a page transition. If our new view is stage-right, it is new content so 
// we need call its render method. If it's stage-left, it's already in our history 
// so we just need to transition back. In either case, all event handlers are removed
// from the old view, as they will be re-attached by the router when/if that view is
// brought back to stage-center. If the view is pushed back to stage right, its
// contents are also cleared to make room for any future renders from that view.
//
SmugRocket.transition = function(newView) {  
  // if body.hasClass('transition') do this else use setTimeout method
  $(document).one('webkitTransitionEnd transitionend', function(e) {
    $('.page').removeClass('transition');
    $('.stage-right').html('');
  });
  
  if (newView.$el.hasClass('stage-right')) {
    newView.render();
    $('.stage-center').removeClass('stage-center').addClass('transition stage-left').off();
    newView.$el.removeClass('stage-right').addClass('transition stage-center');
  }
  
  if (newView.$el.hasClass('stage-left')) {
    $('.stage-center').removeClass('stage-center').addClass('transition stage-right').off();
    newView.$el.removeClass('stage-left').addClass('transition stage-center');
  }
  
  /*
      // Render new content
    if (view.$el.hasClass('stage-right')) {
      $('.stage-center').removeClass('stage-center').addClass('stage-left');
      view.$el.removeClass('stage-right').addClass('stage-center');
      view.render();
    }
    
    // Move back in our history
    if (view.$el.hasClass('stage-left')) {
      $('.stage-center').removeClass('stage-center').addClass('stage-right');  // TODO: add .empty()
      view.$el.removeClass('stage-left').addClass('stage-center');
    }
    
    this.currentView = view;
    */
}
SmugRocket.Views.GalleryDetails = Backbone.View.extend({
  el: $('#gallery-details'),
  
  render: function() {
    var template = SmugRocket.Templates.gallery_details();
    this.$el.html(template);
    return this;
  }
});
SmugRocket.Views.GalleryIndex = Backbone.View.extend({
  el: $('#gallery-index'),
  
  render: function() {
    var template = SmugRocket.Templates.gallery_index();
    this.$el.html(template);
    return this;
  }
});
SmugRocket.Views.Home = Backbone.View.extend({
  el: $('#home'),
  
  // If we don't have an access token, prompt the user to login to SmugMug.
  // Otherwise, show the various options available in the app.
  //
  render: function() {
    //var template = !localStorage.oauth ? SmugRocket.Templates.connect() : SmugRocket.Templates.home();
    var template = SmugRocket.Templates.home();
    this.$el.html(template);
    return this;
  },
  
  events: {
    'click button': function() { console.log('connecting to smugmug') }
  },
  
  connect: function() {
    var template = SmugRocket.Templates.login();
    
  }
});
SmugRocket.Views.Login = Backbone.View.extend({
  el: $('#login'),
  
  initialize: function() {
    _.bindAll(this);
    
    window.getRequestTokenCallback = function(data) {
      $('#login').trigger('requestTokenReceived', data);
    }
  },
  
  render: function() {
    var template = SmugRocket.Templates.login_connect;
    this.$el.html(template);
    return this;
  },
  
  events: {
    'click button[data-connect]': 'getRequestToken',
    'requestTokenReceived': 'authorizeRequestToken'
  },
  
  // Request an OAuth access token
  //
  getRequestToken: function() {
    var auth = OAuthSimple().sign({
      path: 'https://api.smugmug.com/services/api/json/1.3.0/',
      parameters: 'Callback=getRequestTokenCallback&method=smugmug.auth.getRequestToken',
      signatures: {
        api_key:      'grmLMhnNGyFy2mGDiNwV7C1v6stxtfJI', 
        shared_secret:'f7e083fd7f0e6925767ab5824bad1a43'
      }
    });
    $.ajaxJSONP({url: auth.signed_url});
  },
  
  // Save the OAuth request token to local storage
  //
  authorizeRequestToken: function(e) {
    localStorage.oauth_token_id = e.data.Auth.Token.id;
    localStorage.oauth_token_secret = e.data.Auth.Token.Secret;
    var template = SmugRocket.Templates.login_smugmug({
      src: 'https://api.smugmug.com/services/oauth/authorize.mg?oauth_token=' + e.data.Auth.Token.id
    });
    this.$el.html(template);
  }
});



/* 
Try using callback=saveRequestToken and success: function saveRequestToken(data)
in the view directly instead of in separate functions.  At the very least, 
move those functions inside this file so they are in the same place for editing.
*/

/* Manage all login workflow from here with these templates:
login-setup: show a 'connect to smugmug' button' which gets a request token when pressed

if the request token is received, render:
login-smugmug: iframe wrapping smugmug's login page.  add a 'done' button using absolute
positioning.  when that button is pressed, transition to complete template

login-complete: show the user as successfully logged in and provide a link to the home
view

login-retry: if an error occurs anywhere (using the error callback in the ajax request?)
render this template.  also need to remove any auth tokens with the retry button doing
the same thing the 'connect to smugmug' button did in the first step -- get a request 
token and start the whole process again.
*/SmugRocket.Templates.gallery_details = 
function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='I am the Gallery Details page';
}
return __p;
}
SmugRocket.Templates.gallery_index = 
function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href="#!/galleries/1">Gallery Details</a>';
}
return __p;
}
SmugRocket.Templates.home = 
function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href="#!/galleries">Gallery Index</a>';
}
return __p;
}
SmugRocket.Templates.login_connect = 
function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<button data-connect>Connect to SmugMug</button>';
}
return __p;
}
SmugRocket.Templates.login_smugmug = 
function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="smugmug-connecting"></div>\n<div id="smugmug-auth" style="display: none">\n    <a href="#">Close</a>\n    <iframe src="'+
((__t=( src ))==null?'':__t)+
'" onload="$(\'#smugmug-connecting\').hide(); $(\'#smugmug-auth\').show();"></iframe>\n</div>';
}
return __p;
}
