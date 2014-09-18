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
	initialize: function(){
		this.model.on('change', function(){this.render();}, this);
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




        console.log(this.model);
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


//name,class name, namespace, color
var Node = Backbone.Model.extend({
    initialize: function(param) {
        this.set('name', param.name);
        this.set('column', new ColumnCollection());
        this.set('relation', new RelationCollection());
    },
    toJSON: function() {
        return {
            name: this.get('name'),
            classname: this.get('classname'),
            namespace: this.get('namespace'),
            column: this.get('column').toJSON(),
            relation: this.get('relation').toJSON()
        };
    }
});

var NodeView = Backbone.View.extend({
	initialize: function()
	{

	},
    model: Node,
    tagName: 'div',
    template: _.template($('#nodeview-template').html()),
    className: 'node-view item',
    events: {
        'click .add': 'addNew'
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
		
		this.modal = new Backbone.BootstrapModal({
            showFooter: false
        });

        var view = new MyView();
        this.modal.options.content = view; 
//        console.log(this.modal.options);
        this.modal.open();


    },
    render: function() {
        this.$el.append(this.template({
            name: this.model.get('name')
        }));
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
            name: param.name
        });
        nod.get('column').add(param.column, {
            silent: true
        });
        nod.get('column').sort();
        nod.get('column').trigger('createnode');

        nod.get('relation').add(param.relation);
    },
    //connectNode('nodeName1', 'nodeName2')
    connectNode: function(param) {

    },
    //addColumnToNode('nodeName', new Column({var...,..}))
    addColumnToNode: function() {

    }
});

var NodeCollectionView = Backbone.View.extend({
    id: 'container',
    collection: NodeCollection,
    initialize: function() {
        this.collection.on("add", this.addOne, this);
    },
    addOne: function(node) {
        var nodeView = new NodeView({
            model: node
        });
        var nodeRendered = nodeView.render();

        this.$el.append(nodeRendered);

        var connect = nodeRendered.find('.connect');

        jsPlumb.makeTarget(nodeRendered, {
            allowLoopback: false,
            maxConnections: 1,
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
    type: 'bigincrements',
    length: 30,
    order: 1
}, {
    name: 'username',
    type: 'varchar',
    length: 30,
    order: 0
}, {
    name: 'email',
    type: 'varchar',
    length: 200,
    order: 2
}, {
    name: 'password',
    type: 'varchar',
    length: 100,
    order: 3
}];


var roleNode = [{
    name: 'id',
    type: 'bigincrements',
    length: 30,
    order: 0
}, {
    name: 'username',
    type: 'varchar',
    length: 30,
    order: 1
}, {
    name: 'email',
    type: 'varchar',
    length: 200,
    order: 2
}, {
    name: 'password',
    type: 'varchar',
    length: 100,
    order: 3
}];


nodeCollection.createNode({
    name: 'Users',
    column: userNode
});

nodeCollection.createNode({
    name: 'Roles',
    column: roleNode
});

nodeCollection.createNode({
    name: 'Map',
    column: roleNode
});


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
        EndpointStyle: {
            width: 20,
            height: 16,
            strokeStyle: '#666'
        },
        Anchors: ["TopCenter", "TopCenter"],
        endpointStyle: {
            fillStyle: "yellow"
        }

    });



});