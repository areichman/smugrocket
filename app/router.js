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
