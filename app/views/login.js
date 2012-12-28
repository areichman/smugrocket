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
*/