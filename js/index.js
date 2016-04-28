var photoId = 0;
$(function() {
    var Photo = Backbone.Model.extend();
    var flickrURL = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&size=s&jsoncallback=?";
    var PhotoList = Backbone.Collection.extend({
        model: Photo,
        url: function() {
            return flickrURL;
        },
        sync: function(method, collection, options) {
            options.dataType = "jsonp";
            options.jsonpCallback = "jsonpCallback";
            return Backbone.sync(method, collection, options);
        },
        parse: function(resp) {
            return resp.items;
        }
    });   

    var PhotoView = Backbone.View.extend({
        el: "#photos",
        events: {
            'click .expandPost': 'expandPost',
            'click .back-button': 'showListView'
        },

        template: _.template($('#photo-template').html()),
        descTemplate: _.template($('#desc-template').html()),

        expandPost: function(e) {
            e.preventDefault();
            var id = e.target.id - 1; 
            var photo = this.model.models[id];
            var descTemplate = this.descTemplate(photo.toJSON());
            $(this.el).html(descTemplate);
        },

        showListView: function(e) {
            e.preventDefault();
            $(this.el).find(".desc-row").hide(); 
            this.render(); 
        },

        render: function() {
            photoId = 0;
            _.each(this.model.models, function(photo){
                var photoTemplate = this.template(photo.toJSON());
                $(this.el).append(photoTemplate);
            }, this);
            return this;
        }
    });

    var photos = new PhotoList();    
    var photosView = new PhotoView({model: photos});
    photos.fetch({
		success: function() {
        	photosView.render();
        }
    });
});

function htmlToText(desc) {
    var tag = document.createElement('span');
    tag.innerHTML = desc;
    return tag.innerText;
}