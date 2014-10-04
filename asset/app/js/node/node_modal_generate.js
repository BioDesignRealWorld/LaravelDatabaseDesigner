DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {

    Modal.Generate = Modal.BaseModal.extend({
        template: _.template($("#generate-template").html()),
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