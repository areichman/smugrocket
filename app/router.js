SmugRocket.Router = Backbone.Router.extend({
  routes: {
    '':             'home',
    '!/':           'home',
    '!/login':      'login'
  },
  
  login: function() {
    var view = new SmugRocket.Views.Login;
    SmugRocket.transition(view);
  }
});
