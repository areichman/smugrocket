// based on http://blog.andydenmark.com/2009/03/how-to-build-oauth-consumer.html

SmugRocket.Lib.Oauth = function() {
  this.request_token_url = 'https://api.smugmug.com/services/api/json/1.3.0/';
  
  this.params = {
    oauth_consumer_key:     '',  // provided by SmugMug
    oauth_consumer_secret:  '',  // provided by SmugMug
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
  return str + this.timestamp();
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
  return ['GET', encodeURIComponent(this.request_token_url), encodeURIComponent(this.sortedParams())].join('&');
};

// Create the signature that will be sent with the request
//
SmugRocket.Lib.Oauth.prototype.signature = function() {
  return b64_hmac_sha1(auth.params.oauth_consumer_secret+'&', auth.signatureBaseString());
};

// Get the unauthorized request token
//
SmugRocket.Lib.Oauth.prototype.getRequestToken = function() {
  this.params.method = 'smugmug.auth.getRequestToken';
  this.params.oauth_signature = this.signature();
  $.ajaxJSONP({url: this.request_token_url + '?' + this.sortedParams()});
};

// Store the request token in localStorage
//
SmugRocket.Lib.Oauth.storeRequestToken = function(data) {
  localStorage.oauth_token_id = data.Auth.Token.id;
  localStorage.oauth_token_secret = data.Auth.Token.Secret;
};
