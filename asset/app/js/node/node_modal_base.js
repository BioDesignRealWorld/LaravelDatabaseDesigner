DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------
    Modal.BaseModal = Backbone.View.extend({
        formDataInvalid: function(error) {
            var self = this;
            this.$el.find(".has-error").each(function() {
                $(this).removeClass("has-error");
            });
            var markError = function(value, key) {
                var $control_group = self.$el.find("#" + self.idPrefix + "-" + key).parent();
                $control_group.parent().addClass("has-error");
                var $error_el = $("<span>", {
                    class: "help-block",
                    text: value
                });
                //$control_group.append($error_el);
            };
            _.each(error, markError);
        },
        render: function() {
            this.$el.html(this.template());
            return this.el;
        }

    });
    
    // Public
    // -------------------------
    Modal.CreateTestModal = function(view) {
        var modal = new Backbone.BootstrapModal({
            showFooter: false
        });
        modal.options.content = view;
        modal.on("hidden", function(){
            modal.off();
           if (typeof view.destroy == 'function') view.destroy(); 
           if (typeof view.remove == 'function') view.remove(); 
           if (typeof view.close == 'function') view.close(); 

        });
        modal.open();
        return modal;
    };

    // Initializers
    // -------------------------
});