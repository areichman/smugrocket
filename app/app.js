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
