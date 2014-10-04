DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {

    Modal.GistLoad = Modal.BaseModal.extend({
        template: _.template($("#gistload-template").html()),
        initialize: function(param)
        {
            this.content = param.content;
        },
        render: function() {
            //console.log(view.render().el);
            this.$el.html(this.template({
                content: this.content
            }));
            return this.el;
        }
    });

    Modal.GistSave = Modal.BaseModal.extend({
        template: _.template($("#gistsave-template").html()),
        initialize: function(param)
        {
            this.content = param.content;
        },
        render: function() {
            //console.log(view.render().el);
            this.$el.html(this.template({
                content: this.content
            }));
            return this.el;
        }
    });    

});