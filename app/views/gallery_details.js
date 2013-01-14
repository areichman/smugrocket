SmugRocket.Views.GalleryDetails = Backbone.View.extend({
  el: $('#gallery-details'),
  
  render: function() {
    var template = SmugRocket.Templates.gallery_details();
    this.$el.html(template);
    return this;
  }
});
