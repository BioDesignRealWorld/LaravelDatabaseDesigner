DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {

    Modal.CreateNodeContainer = Modal.BaseModal.extend({
        template: _.template($('#createnode-template').html()),
        events: {
            'click .addnode': 'okClicked'
        },
        idPrefix: "container",
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });

    Modal.EditNodeContainer = Modal.BaseModal.extend({
        template: _.template($('#createnode-template').html()),
        events: {
            'click .addnode': 'okClicked'
        },
        idPrefix: "container",
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get("increment") === true) this.$("#container-increment").prop("checked", true);
            if (this.model.get("timestamp") === true) this.$("#container-timestamp").prop("checked", true);
            if (this.model.get("softdelete") === true) this.$("#container-softdelete").prop("checked", true);

            this.$('#container-color').find('option[value=' + this.model.get("color") + ']').attr('selected', 'selected'); //make destination selected by default
            return this.el;
        }
    });


});