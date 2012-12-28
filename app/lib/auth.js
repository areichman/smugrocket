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
