SmugRocket.Router = Backbone.Router.extend({
  transition: function(view) {    
    
  },
  
  routes: {
    '':        'home',
    '!/':      'home',
    '!/login': 'login'
  },
  
  home: function() {
    var view = new SmugRocket.Views.Home();
    SmugRocket.transition(view);
  },
  
  login: function() {
    var view = new SmugRocket.Views.Login();
    SmugRocket.transition(view);
  }
});
