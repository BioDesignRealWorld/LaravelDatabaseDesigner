DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------
    Modal.CreateNodeItem = Backbone.View.extend({
            initialize: function() {

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
                //this.$('#columnType').find('option[value=' + that.model.get('type') + ']').attr('selected', 'selected');
                return this.el;
            }
    });


    Modal.CreateNodeContainer = Backbone.View.extend({
        template: _.template($('#createnode-template').html()),
        events: {
            'click .addnode': 'addNode'
        },
        addNode: function() {
            //  var newnode = coll.createNode({
            //      name: this.$('#tableName').val(),
            //      modelclass: this.$('#tableModelName').val(),
            //      namespace: this.$('#tableNamespace').val(),
            //      color: this.$('#tableColor').val(),
            //      position: {
            //          x: 20,
            //          y: 20
            //      }
            //  });
        },
        render: function() {
            this.$el.html(this.template());
            return this.el;
        }
    });

    Modal.CreateRelation = Backbone.View.extend({
        initialize: function(param) {
            //this.bind("ok", this.addOne);
        },
        model: Node,
        template: _.template($('#relationcreate-template').html()),
        addOne: function() {

            var that = this;

           // var newrelation = new RelationModel({
           //     sourcenode: this.model.get('name'),
           //     name: this.$("#functionName").val(),
           //     relationtype: this.$("#tableRelation").val(),
           //     usenamespace: this.$("#tableNamespace").val(),
           //     relatedmodel: this.$("#tableRelatedModel").val(),
           //     foreignkeys: this.$("#tableFK").val(),
           //     extramethods: this.$("#tableExtraMethod").val()
           // });

           // createConnection(newrelation, this.model);

           // this.model.get('relation').add(newrelation);
            //console.log(test);
        },
        render: function() {
//
          //  var templatevar = {
          //      relationship: this.model.get('relation').toJSON(),
          //      relatedmodel: this.parent.toJSON(),
          //      title: "Create Relation in Table " + this.model.get('name')
          //  };
//
//
          //  if (this.target) {
          //      templatevar.title = "Create Relation Between " + this.model.get('name') + " and " + this.target;
          //  }
//
//
          //  this.$el.html(this.template(templatevar));
//
          //  if (this.target) {
          //      this.$('.classoption').hide(); //hide option box
          //      this.$('#tableRelatedModel').find('option[value=' + this.target + ']').attr('selected', 'selected'); //make destination selected by default
          //  }
          //  this.$('#tableRelatedModel').find('option[value=' + this.model.get('name') + ']').remove(); //remove self (model) from option list
//
          //  return this.el;
        }
    });



    Modal.EditRelationItem = Backbone.View.extend({
        template: _.template($('#relationcreate-template').html()),
        initialize: function(options, param) {
            this.container = param.container;
            //                    this.bind("ok", this.addOne);
        },
        addOne: function() {
            this.model.set({
                name: this.$("#functionName").val(),
                relationtype: this.$("#tableRelation").val(),
                usenamespace: this.$("#tableNamespace").val(),
                relatedmodel: this.$("#tableRelatedModel").val(),
                foreignkeys: this.$("#tableFK").val(),
                extramethods: this.$("#tableExtraMethod").val()
            });
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
            this.$('#tableRelatedModel').find('option[value=' + this.model.get('relatedmodel') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#tableRelation').find('option[value=' + this.model.get('relationtype') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#tableRelatedModel').find('option[value=' + this.container.get('name') + ']').remove(); //remove self (model) from option list

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
        },
        deleteRelation: function() {
            console.log("delete relation");
            this.model.destroy();
        },
        editRelation: function() {
            console.log("edit relation");
            Modal.CreateTestModal(new Modal.EditRelationItem({
                model: this.model
            }, {
                container: this.container
            }));
        },
        render: function() { // console.log('destroy render');
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });


    Modal.ViewRelations = Backbone.View.extend({
        template: _.template($("#relationcollection-template").html()),
        events: {

        },
        initialize: function() {
            this.listenTo(this.model.get("relation"), 'destroy', this.render);
            this.listenTo(this.model.get("relation"), 'add', this.addOne);
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
    };

    // Initializers
    // -------------------------
});