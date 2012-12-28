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
