var ColumnModel = Backbone.Model.extend({
    defaults: {
        name: '',
        type: '',
        length: 0,
        defaultvalue: '',
        enumvalue: ''
    }
});


var ColumnModelView = Backbone.View.extend({
    initialize: function() {
        this.model.on('change', function() {
            this.render();
        }, this);
    },
    model: ColumnModel,
    template: _.template($('#columnview-template').html()),
    tagName: 'li',
    className: 'node-column',
    events: {
        'click .edit': 'editColumn'
    },
    editColumn: function() {

        var that = this;
        var MyView = Backbone.View.extend({
            initialize: function() {
                this.bind("ok", this.okClicked);
            },
            template: _.template($("#table-modal-template").html()),
            okClicked: function(modal) {

                var newColumn = {
                    name: this.$('#columnName').val(),
                    type: this.$('#columnType').val(),
                    length: this.$('#columnLength').val(),
                    defaultvalue: this.$('#columnDef').val(),
                    enumvalue: this.$('#columnEnum').val(),
                };

                that.model.set(newColumn);
                //modal.preventClose();
            },
            render: function() {
                this.$el.html(this.template(that.model.toJSON()));
                this.$('#columnType').find('option[value=' + that.model.get('type') + ']').attr('selected', 'selected');
                return this.el;
            }


        });

        this.modal = new Backbone.BootstrapModal({
            showFooter: false
        });

        var view = new MyView();
        this.modal.options.content = view;
        //        console.log(this.modal.options);
        this.modal.open();




        //console.log(this.model);
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this.el;
    }
});

var ColumnCollection = Backbone.Collection.extend({
    model: ColumnModel,
    comparator: 'order'
});



var ColumnCollectionView = Backbone.View.extend({
    columnViewList: [],
    tagName: 'ul',
    className: 'ui-sortable',
    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('createnode', this.render, this);

        var that = this;
        this.$el.sortable({
            update: function(ev, ui) {
                that.updateIndex();
            }
        });

    },
    addOne: function(col) {

        var colView = new ColumnModelView({
            model: col
        });

        this.columnViewList.push(colView);
        this.$el.append(colView.render());

        col.set('order', colView.$el.index());
        //this.updateIndex();
    },
    updateIndex: function() {
        {
            for (var i in this.columnViewList)
                this.columnViewList[i].model.set('order', this.columnViewList[i].$el.index());
            this.collection.sort({
                silent: true
            });
            ///console.log(this.collection.toJSON());
        }
    },
    render: function() {
        var that = this;
        this.collection.each(function(item) {
            this.addOne(item);
        }, this);
        return this.el;
    }
});


var RelationModel = Backbone.Model.extend({
    defaults: {
        name: '',
        relationtype: '',
        usenamespace: '',
        relatedmodel: '',
        foreignkeys: '',
        extramethods: ''
    }
});


var RelationCollection = Backbone.Collection.extend({
    model: RelationModel
});

var RelationView = Backbone.View.extend({
    initialize: function(param) {
        this.parent = param.parent;
        //this.model.on('destroy', this.render, this);
        this.model.on('change', this.render, this);
    },
    model: RelationModel,
    tagName: 'tr',
    template: _.template($("#relationitem-template").html()),
    events: {
        'click .delete': 'deleteRelation',
        'click .edit': 'editRelation'
    },
    deleteRelation: function() {
        this.model.destroy();
    },
    editRelation: function() {
        //console.log(this.parent);
        var relationEditView = new RelationEditView({
            model: this.model,
            parent: this.parent,
            title: 'Edit Relation in Table '
        });

        var modal = new Backbone.BootstrapModal({
            showFooter: false,
            content: relationEditView
        });

        modal.open();
    },
    render: function() { //	console.log('destroy render');

        this.$el.html(this.template(this.model.toJSON()));
        return this.el;
    }
});

var RelationEditView = Backbone.View.extend({
    model: RelationModel,
    template: _.template($('#relationcreate-template').html()),
    initialize: function(param) {
        //console.log(param.parent);
        this.parent = param.parent;
        this.title = param.title;
        this.bind("ok", this.addOne);
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
        //console.log(this.parent);
        var templatevar = {
            title: 'Edit Relation ' + this.parent.get('name'),
            relationship: this.model.toJSON(),
            relatedmodel: this.parent.get('parent').toJSON()
        };

        this.$el.html(this.template(templatevar));
        // console.log(this.parent);
        this.$('#tableRelatedModel').find('option[value=' + this.model.get('relatedmodel') + ']').attr('selected', 'selected'); //make destination selected by default
        this.$('#tableRelation').find('option[value=' + this.model.get('relationtype') + ']').attr('selected', 'selected'); //make destination selected by default
        this.$('#tableRelatedModel').find('option[value=' + this.parent.get('name') + ']').remove(); //remove self (model) from option list


        //this.$('#tableRelatedModel').find('option[value=' + this.model.get + ']').attr('selected','selected'); //make destination selected by default

    }
});


var RelationCreateView = Backbone.View.extend({
    initialize: function(param) {
        this.target = param.target;
        this.parent = param.parent;
        this.bind("ok", this.addOne);
    },
    model: Node,
    template: _.template($('#relationcreate-template').html()),
    addOne: function() {

        var that = this;

        var newrelation = new RelationModel({
            sourcenode: this.model.get('name'),
            name: this.$("#functionName").val(),
            relationtype: this.$("#tableRelation").val(),
            usenamespace: this.$("#tableNamespace").val(),
            relatedmodel: this.$("#tableRelatedModel").val(),
            foreignkeys: this.$("#tableFK").val(),
            extramethods: this.$("#tableExtraMethod").val()
        });

        var relationModal = function(that) {
            //console.log(that);
            var relationEditView = new RelationEditView({
                model: newrelation,
                parent: that.model,
                title: 'Edit Relation in Table '
            });

            var modal = new Backbone.BootstrapModal({
                showFooter: false,
                content: relationEditView
            });

            modal.open();
        };

        newrelation.on('add', function() {
            var conn = jsPlumb.connect({
                source: newrelation.get('sourcenode'),
                target: newrelation.get('relatedmodel'),
                overlays: [
                    ["Arrow", {
                        location: 1
                    }],
                    ["Label", {
                        cssClass: "label",
                        label: newrelation.get('sourcenode') + ' ' + newrelation.get('relationtype') + ' ' + newrelation.get('relatedmodel'),
                        location: 0.3,
                        id: "label"
                    }]
                ]
            });

            conn.bind("click", function() {
                relationModal(that);
            });

            var targetModel = this.parent.where({
                name: newrelation.get('relatedmodel')
            })[0];
           // console.log(this.target);

           var targetCallback = function() {
                newrelation.destroy();
            };

            var targetListen = targetModel.on('destroy', targetCallback , this);

            var detachListen = function(){
            	targetModel.off('destroy', targetCallback);
            };

            newrelation.set('detachListen', detachListen);
            newrelation.set('conn', conn);
        }, this);

        newrelation.on('change:relationtype', function() {
        	$(this.get('conn').getOverlay('label').canvas).html(newrelation.get('sourcenode') + ' ' + newrelation.get('relationtype') + ' ' + newrelation.get('relatedmodel'));
      
        });

        newrelation.on('change:relatedmodel', function() {

        	newrelation.get('detachListen')();

            jsPlumb.detach(newrelation.get('conn'));
            var conn = jsPlumb.connect({
                source: newrelation.get('sourcenode'),
                target: newrelation.get('relatedmodel'),
                overlays: [
                    ["Arrow", {
                        location: 1
                    }],
                    ["Label", {
                        cssClass: "label",
                        label: newrelation.get('sourcenode') + ' ' + newrelation.get('relationtype') + ' ' + newrelation.get('relatedmodel'),
                        location: 0.3,
                        id: "label"
                    }]
                ]
            });
            
            conn.bind("click", function() {
                relationModal(that);
            });

            var targetModel = this.parent.where({
                name: newrelation.get('relatedmodel')
            })[0];

           var targetCallback = function() {
                newrelation.destroy();
            };

            var targetListen = targetModel.on('destroy', targetCallback , this);

            var detachListen = function(){
            	targetModel.off('destroy', targetCallback);
            };

            newrelation.set('detachListen', detachListen);
            newrelation.set('conn', conn);
        }, this);

        newrelation.on('destroy', function() {
            if (newrelation.get('conn').connector !== null) {
                jsPlumb.detach(newrelation.get('conn'));
            }
        }, this);
        this.model.get('relation').add(newrelation);
        //console.log(test);
    },
    render: function() {

        var templatevar = {
            relationship: this.model.get('relation').toJSON(),
            relatedmodel: this.parent.toJSON(),
            title: "Create Relation in Table " + this.model.get('name')
        };


        if (this.target) {
            templatevar.title = "Create Relation Between " + this.model.get('name') + " and " + this.target;
        }


        this.$el.html(this.template(templatevar));

        if (this.target) {
            this.$('.classoption').hide(); //hide option box
            this.$('#tableRelatedModel').find('option[value=' + this.target + ']').attr('selected', 'selected'); //make destination selected by default
        }
        this.$('#tableRelatedModel').find('option[value=' + this.model.get('name') + ']').remove(); //remove self (model) from option list

        return this.el;
    }
});

var RelationCollectionView = Backbone.View.extend({
    model: Node,
    template: _.template($('#relationview-template').html()),
    initialize: function() {
        //console.log(this.model);
        this.model.get('relation').on('add', this.addOne, this);
        this.model.get('relation').on('destroy', this.render, this);
    },
    addOne: function(item) {
        //console.log(item);
        //console.log(item);
        var relationitem = new RelationView({
            model: item,
            parent: this.model
        });
        this.$('tbody').append(relationitem.render());
        //console.log(relationitem.render());
    },
    render: function() {
        //console.log('wew');
        this.$el.html(this.template({
            node: this.model.toJSON()
        }));
        this.model.get('relation').each(function(item) {
            this.addOne(item);
        }, this);

        return this.el;
    }
});

//name,class name, namespace, color
var Node = Backbone.Model.extend({
    initialize: function(param) {
        this.set('name', param.name);
        this.set('modelclass',param.modelclass);
        this.set('namespace',param.namespace);
        this.set('color',param.color);
        this.set('position',param.position);
		
		this.set('parent', param.parent);
        this.set('column', new ColumnCollection());
        this.set('relation', new RelationCollection());
    },
    toJSON: function() {
        return {
            name: this.get('name'),
            modelclass: this.get('modelclass'),
            namespace: this.get('namespace'),
            color: this.get('color'),
            position: this.get('position'),
            column: this.get('column').toJSON(),
            relation: this.get('relation').toJSON()
        };
    }
});




var NodeView = Backbone.View.extend({
    initialize: function(param) {
        this.parent = param.parent;
    },
    model: Node,
    tagName: 'div',
    template: _.template($('#nodeview-template').html()),
    className: 'node-view item',
    events: {
        'click .add': 'addNew',
        'click .dump': 'dumpJSON',
        'click .relation': 'viewRelation',
        'click .parent': 'testParent',
        'click .relationadd': 'relationAdd',
        'click .delete': 'deleteNode'
    },
    deleteNode: function() {
        //        jsPlumb.detachAllConnections(this.$el);
        //      jsPlumb.removeAllEndpoints(this.$el);

        this.model.get('relation').each(function(item) {
            jsPlumb.detach(item.get('conn'));
            item.set('conn', '');
        }, this);

        this.model.get('relation').each(function(item) {
            item.destroy();
        }, this);

        jsPlumb.detachAllConnections(this.$el);
        jsPlumb.removeAllEndpoints(this.$el);


        $(this.$el).remove();
        //console.log('destroy');
        this.model.destroy();
    },
    relationAdd: function() {

        var relationAddView = new RelationCreateView({
            model: this.model,
            parent: this.parent,
        });

        var modal = new Backbone.BootstrapModal({
            showFooter: false,
            content: relationAddView
        });

        modal.open();
    },
    testParent: function() {
        console.log(this.parent);
    },
    viewRelation: function() {
        //console.log(this.model);
        var relationView = new RelationCollectionView({
            model: this.model
        });

        var modal = new Backbone.BootstrapModal({
            showFooter: true,
            content: relationView
        });

        modal.open();

    },
    dumpJSON: function() {
        console.log(this.model.toJSON());
    },
    addNew: function() {

        var that = this;
        var MyView = Backbone.View.extend({
            initialize: function() {
                this.bind("ok", this.okClicked);
                this.model = new ColumnModel();
            },
            template: _.template($("#table-modal-template").html()),
            okClicked: function(modal) {
                this.model.set({
                    name: this.$('#columnName').val(),
                    type: this.$('#columnType').val(),
                    length: this.$('#columnLength').val(),
                    defaultvalue: this.$('#columnDef').val(),
                    enumvalue: this.$('#columnEnum').val(),
                });

                that.model.get('column').add(this.model);
                //modal.preventClose();
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this.el;
            }


        });

        modal = new Backbone.BootstrapModal({
            showFooter: false
        });

        var view = new MyView();
        modal.options.content = view;
        modal.open();


    },
    render: function() {
        var that = this;

        var position = this.model.get('position');
        //console.log(position);

        this.$el.css("left",position.x);
        this.$el.css("top", position.y);

        this.$el.append(this.template({
            name: this.model.get('name')
        }));

        this.$(".conn").draggable({
            revert: true
        });
        this.$(".conn").droppable({
            drop: function(event, ui) {
                
                $(this).data("uiDraggable").originalPosition = {
                    top: 0,
                    left: 0
                };

                var source = ui.draggable.attr('id');
                var dest = that.model.get('name');


                var relationAddView = new RelationCreateView({
                    model: that.parent.where({
                        name: source
                    })[0], //drag source model
                    parent: that.parent, //parent node collection 
                    target: dest, // drop destination model
                });

                var modal = new Backbone.BootstrapModal({
                    showFooter: false,
                    content: relationAddView
                });


                modal.open();



                //console.log(that.parent.where({name: source})[0]);
                /* jsPlumb.connect({
        	source:source, 
        	target:dest,
       		overlays:[
       		[ "Arrow", { location:1 } ]
       		]
        });*/

            }
        });

        var colview = new ColumnCollectionView({
            collection: this.model.get('column')
        });
        this.$el.append(colview.render());
        return this.$el;
    }
});

var NodeCollection = Backbone.Collection.extend({
    model: Node,
    createNode: function(param) {
        
        var nod = this.add({
			modelclass : param.modelclass,
			namespace : param.namespace,
			color: param.color,
			position: param.position,
            name: param.name,
            parent: this
        });

        nod.get('column').add(param.column, {
            silent: true
        });

        nod.get('column').sort();
        nod.get('column').trigger('createnode');
        nod.get('relation').add(param.relation);

        return nod;
    },
    //connectNode('nodeName1', 'nodeName2')
    connectNode: function(source, target) {
        jsPlumb.connect({
            source: "element1",
            target: "element2"
        });
    },
    //addColumnToNode('nodeName', new Column({var...,..}))
    addColumnToNode: function() {

    }
});




var NodeCollectionView = Backbone.View.extend({
    id: 'container',
    collection: NodeCollection,
    template: _.template($("#nodecontainer-template").html()),
    events: {
    	'click .addnode' : 'addNode'
    },
    addNode: function()
    {
    	var coll = this.collection;

		var CreateNodeView = Backbone.View.extend({
			template: _.template($('#createnode-template').html()),
			events: {
				'click .addnode' : 'addNode'
			},
			addNode : function(){

			var newnode = coll.createNode({
				name:  this.$('#tableName').val(),
				modelclass:  this.$('#tableModelName').val(),
				namespace:  this.$('#tableNamespace').val(),
				color:  this.$('#tableColor').val(),
				position: {x:0,y:0}
			});
			
			//console.log(newnode);
			},
			render: function()
			{
				this.$el.html(this.template());
				return this.el;
			}
		});



    	var modal = new Backbone.BootstrapModal({
            showFooter: false,
            content: new CreateNodeView()
        });

        modal.open();
    	//alert('yadda');
    },
    initialize: function() {
        this.collection.on("add", this.addOne, this);
    },
    addOne: function(node) {
        var nodeView = new NodeView({
            id: node.get('name'),
            model: node,
            parent: this.collection
        });
        var nodeRendered = nodeView.render();

        this.$el.append(nodeRendered);

        var connect = nodeRendered.find('.connect');


        jsPlumb.makeTarget(nodeRendered, {
            allowLoopback: false,
            anchor: 'Continuous'
        });


        jsPlumb.makeSource(connect, {
            parent: nodeRendered,
            anchor: 'Continuous',
            allowLoopback: false,
        });

        jsPlumb.draggable(nodeRendered, {
            containment: 'parent'
        });

        //console.log('addone');
    },
    render: function() {
    	this.$el.html(this.template());
        return this.el;
    }
});


var nodeCollection = new NodeCollection();
var nodeCollectionView = new NodeCollectionView({
    collection: nodeCollection
});

$('body').append(nodeCollectionView.render());


var userNode = [{
    name: 'id',
    type: 'increments',
    length: 30,
    order: 1
}, {
    name: 'username',
    type: 'string',
    length: 30,
    order: 0
}, {
    name: 'email',
    type: 'string',
    length: 200,
    order: 2
}, {
    name: 'password',
    type: 'string',
    length: 100,
    order: 3
}];


var roleNode = [{
    name: 'id',
    type: 'increments',
    length: 30,
    order: 0
}, {
    name: 'username',
    type: 'string',
    length: 30,
    order: 1
}, {
    name: 'email',
    type: 'string',
    length: 200,
    order: 2
}, {
    name: 'password',
    type: 'string',
    length: 100,
    order: 3
}];


var relationTest = [{
    name: 'machines',
    relationtype: 'hasMany',
    usenamespace: '',
    relatedmodel: 'Machine',
    foreignkeys: 'user_id',
}, {
    name: 'machines',
    relationtype: 'hasMany',
    usenamespace: '',
    relatedmodel: 'Machine',
    foreignkeys: 'user_id',
}, {
    name: 'machines',
    relationtype: 'hasMany',
    usenamespace: '',
    relatedmodel: 'Machine',
    foreignkeys: 'user_id',
}];


nodeCollection.createNode({
    name: 'Users',
    column: userNode,
    position: {x: 300, y:400},
});

nodeCollection.createNode({
    name: 'Roles',
    column: roleNode,
    position: {x: 600, y:200},
});




nodeCollection.createNode({
    name: 'Map',
    column: roleNode,
    position: {x: 100, y:100},
});

/*
nodeCollection.createNode({
    name: 'Test',
    column: roleNode,
});


nodeCollection.createNode({
    name: 'Inventori',
    column: roleNode,
});
*/
//nodeCollection.where({name: 'Users'})[0].addColumn(userNode);
//console.log(nodeCollection.where({name: 'Users'})[0].get('column').toJSON());

/*
var node = new Node({name: "User"});
var nodeView = new NodeView({model: node});

$('#container').append(nodeView.render());


node.addColumn({name: 'id', type: 'bigincrements', length: 30});
node.addColumn({name: 'username', type: 'varchar', length: 30});
node.addColumn({name: 'email', type: 'varchar', length: 100});
node.addColumn({name: 'password', type: 'varchar', length: 100});
*/

//var columnCollection = new ColumnCollection({name: 'User x'});
//var nodeView = new ColumnCollectionView({collection: columnCollection});
//$('#container').append(nodeView.render());

//columnCollection.add({name: 'id', type: 'bigincrements', length: 30});
//columnCollection.add({name: 'username', type: 'varchar', length: 30});
//columnCollection.add({name: 'email', type: 'varchar', length: 100});
//columnCollection.add({name: 'password', type: 'varchar', length: 100});

/*

name
type
length
defaultvalue
enum value

*/

jsPlumb.Defaults.Connector = ["Flowchart", {
    stub: [40, 60],
    gap: 10,
    cornerRadius: 5,
    alwaysRespectStubs: true
}];
jsPlumb.Defaults.HoverPaintStyle = {
    strokeStyle: "#637b94",
    lineWidth: 6
};
jsPlumb.Defaults.EndpointHoverStyle = {
    fillStyle: "#637b94"
};

jsPlumb.ready(function() {
    var instance = jsPlumb.importDefaults({
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        PaintStyle: {
            strokeStyle: '#666',
            lineWidth: 2,
            joinstyle: "round",
        },
        Anchors: ["TopCenter", "TopCenter"],
        endpointStyle: {
            fillStyle: "yellow"
        }

    });


});