SmugRocket.Views.Home = Backbone.View.extend({
  el: $('#home'),
  
  // If we don't have an access token, prompt the user to login to SmugMug.
  // Otherwise, show the various options available in the app.
  //
  render: function() {
    var template = !localStorage.oauth ? SmugRocket.Templates.connect() : SmugRocket.Templates.home();
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
