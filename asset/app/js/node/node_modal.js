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

    Modal.CreateNodeItem = Backbone.View.extend({
        initialize: function() {

        },
        template: _.template($("#nodemodel-template").html()),
        events: {
            "click .ok": "okClicked"
        },
        okClicked: function() {

            //   var newColumn = {
            //       name: this.$('#columnName').val(),
            //       type: this.$('#columnType').val(),
            //       length: this.$('#columnLength').val(),
            //       defaultvalue: this.$('#columnDef').val(),
            //       enumvalue: this.$('#columnEnum').val(),
            //   };
            //
            //   that.model.set(newColumn);
            //modal.preventClose();
            console.log("wewdew");
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            //this.$('#columnType').find('option[value=' + that.model.get('type') + ']').attr('selected', 'selected');
            return this.el;
        }
    });

    Modal.EditNodeItem = Backbone.View.extend({
        initialize: function() {
            //this.bind("ok", this.okClicked);
        },
        template: _.template($("#nodemodel-template").html()),
        okClicked: function(modal) {

            //   var newColumn = {
            //       name: this.$('#columnName').val(),
            //       type: this.$('#columnType').val(),
            //       length: this.$('#columnLength').val(),
            //       defaultvalue: this.$('#columnDef').val(),
            //       enumvalue: this.$('#columnEnum').val(),
            //   };
            //
            //   that.model.set(newColumn);
            //modal.preventClose();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$('#columnType').find('option[value=' + this.model.get('type') + ']').attr('selected', 'selected');
            return this.el;
        }
    });



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
            if (this.model.get("increment") === true) this.$("#container-increment").prop( "checked", true );
            if (this.model.get("timestamp") === true) this.$("#container-timestamp").prop( "checked", true );
            if (this.model.get("softdelete") === true) this.$("#container-softdelete").prop( "checked", true );
            
            this.$('#container-color').find('option[value=' + this.model.get("color") + ']').attr('selected', 'selected'); //make destination selected by default
            return this.el;
        }
    });

    Modal.CreateRelation = Modal.BaseModal.extend({
        initialize: function(param) {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
            this.target = param.target;
            //console.log(param.target);
        },
        model: Node,
        idPrefix: "relation",
        template: _.template($('#relationcreate-template').html()),
        events: {
            "click .ok": "okClicked"
        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            var parent = DesignerApp.request("nodeentities:canvas");
            var templatevar = {
                relationship: this.model.get('relation').toJSON(),
                relatedmodel: parent.toJSON(),
                title: "Create Relation in Table " + this.model.get('name')
            };
            //
            //
            if (this.target) {
                templatevar.title = "Create Relation Between " + this.model.get('name') + " and " + this.target;
            }
            //
            //
            this.$el.html(this.template(templatevar));
            //

            if (this.target) {
                this.$('.classoption').hide(); //hide option box
                this.$('#relation-relatedmodel').find('option[value=' + this.target + ']').attr('selected', 'selected'); //make destination selected by default
            }

            this.$('#relation-relatedmodel').find('option[value=' + this.model.get('name') + ']').remove(); //remove self (model) from option list
            //
            return this.el;
        }
    });



    Modal.EditRelationItem = Modal.BaseModal.extend({
        template: _.template($('#relationcreate-template').html()),
        idPrefix: "relation",
        initialize: function(options, param) {
            this.container = param.container;
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        events: {
            "click #btnsave.ok": "okClicked",
            "click #btndelete.delete": "delClicked"
        },
        delClicked: function(e) {
            this.trigger("delClicked", this.model);
        },
        okClicked: function() {
            //todo
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            var templatevar = {
                title: 'Edit Relation in Table ' + this.container.get('name'),
                relationship: this.model.toJSON(),
                //todo: change to reqreq
                relatedmodel: DesignerApp.NodeEntities.getNodeCanvas().toJSON()
            };
            this.$el.html(this.template(templatevar));
            // console.log(this.parent);
            this.$('#relation-relatedmodel').find('option[value=' + this.model.get('relatedmodel') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relationtype').find('option[value=' + this.model.get('relationtype') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relatedmodel').find('option[value=' + this.container.get('name') + ']').remove(); //remove self (model) from option list

            return this.el;

        }
    });


    Modal.RelationItem = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($("#relationitem-template").html()),
        events: {
            'click .delete': 'deleteRelation',
            'click .edit': 'editRelation'
        },
        initialize: function(options, param) {
            this.container = param.container;
            this.listenTo(this.model, "change", this.render);
        },
        deleteRelation: function() {
            //todo refactor this
            this.model.destroy();
        },
        editRelation: function() {
            DesignerApp.execute("nodecanvas:edit:relation", this.container, this.model);
        },
        render: function() { // console.log('destroy render');
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });


    Modal.ViewRelations = Backbone.View.extend({
        template: _.template($("#relationcollection-template").html()),
        events: {
            "click .ok": "addNewRelationClicked"
        },
        initialize: function() {
            this.listenTo(this.model.get("relation"), 'destroy', this.render);
            this.listenTo(this.model.get("relation"), 'add', this.addOne);
        },
        addNewRelationClicked: function() {
            this.trigger("addNewRelationClicked");
        },
        addOne: function(relation) {
            var view = new Modal.RelationItem({
                model: relation
            }, {
                container: this.model
            });
            this.$("tbody").append(view.render());
        },
        render: function() {
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.model.get("relation").each(function(item) {
                self.addOne(item);
            });
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
        modal.open();
        return modal;
    };

    // Initializers
    // -------------------------
});