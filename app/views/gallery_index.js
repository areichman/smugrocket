SmugRocket.Views.GalleryIndex = Backbone.View.extend({
  el: $('#gallery-index'),
  
  render: function() {
    var template = SmugRocket.Templates.gallery_index();
    this.$el.html(template);
    return this;
  }
});
