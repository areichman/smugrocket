SmugRocket.Router = Backbone.Router.extend({
  routes: {
    '':             'home',
    '!/':           'home',
    '!/categories': 'showCategories'
	},
	
  home: function() {
    var view = new SmugRocket.Views.Home();
    SmugRocket.transition(view);
  },
  
  showCategories: function() {
    var view = new SmugRocket.Views.Categories();
    SmugRocket.transition(view);
  }
});
