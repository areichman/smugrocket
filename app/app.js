// Create the app namespace
var SmugRocket = {
	Models:      {},
	Collections: {},
	Views:       {},
	Templates:   {},
	
	initialize: function() {
		new SmugRocket.Router();
		Backbone.history.start();
	},
	
	transition: function(view) {
	
	}
};


// Routes
SmugRocket.Router = Backbone.Router.extend({
	'/':  'home',
	'!/': 'home',
	
	'home': function() {
		console.log('SmugRocket started.');
	}
});


// Initialize the app when the page is ready
$(function() { SmugRocket.initialize() });
