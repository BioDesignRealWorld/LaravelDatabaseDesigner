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
	model : ColumnModel,
	template: _.template($('#columnview-template').html()),
	tagName: 'li',
	className: 'node-column',
	events: {
		'click .edit': 'editColumn'
	},
	initialize: function()
	{

	},
	editColumn: function()
	{	
		console.log(this.model);
	},
	render: function()
	{
		 this.$el.html(this.template(this.model.attributes));
		 return this.el;
	}
});



var ColumnCollection = Backbone.Collection.extend({
	initialize: function(param)
	{
		this.name = param.name;
	},
	model: ColumnModel
});

var ColumnCollectionView = Backbone.View.extend({
	collection: ColumnCollection,
	tagName: 'ul',
	events: {
		'click .add': 'createCol'
	},
	initialize: function()
	{
		this.collection.on('add', this.addOne, this);
	},
	createCol: function()
	{
		this.collection.add({name:'test', type: 'tipe'});
		console.log('create new column');
	},
	addOne: function(col)
	{
		var colView = new ColumnModelView({model : col});
		console.log(this.$el.append(colView.render()));
	},
	render: function()
	{
		 this.$el.html();
		 return this.el;
	}
});

var Node = Backbone.Model.extend({
	initialize: function(param){
		this.set('name', param.name)
		this.set('column', new ColumnCollection({name: param.name}));
	},
	addColumn: function(col)
	{
		var cols = this.get('column');
		cols.add(col);
	}
});

var NodeView = Backbone.View.extend({
		model: Node,
		tagName: 'div',
		template: _.template($('#nodeview-template').html()),
		className: 'node-view item',
		render: function()
		{
			this.$el.html(this.template({name : this.model.get('name')}));

			var colview = new ColumnCollectionView({collection : this.model.get('column')});
			this.$el.append(colview.render());


			return this.$el;
		}
});


var NodeCollection = Backbone.Collection.extend({
	model: Node
});

var NodeCollectionView = Backbone.View.extend({
	id:'container',
	collection: NodeCollection,
	initialize: function(){
		this.collection.on("add",this.addOne, this);
	},
	addOne: function(node)
	{
		var nodeView = new NodeView({model: node});
		var nodeRendered = nodeView.render();

		this.$el.append(nodeRendered);


        var connect = nodeRendered.find('.connect');
        jsPlumb.makeSource(connect, {
            parent: nodeRendered,
            anchor: 'Continuous',
            allowLoopback: false,

        });

        jsPlumb.makeTarget(nodeRendered, {
            allowLoopback: false,
            maxConnections: 1,
            anchor: 'Continuous'
        });

		jsPlumb.draggable(nodeRendered, {
            containment: 'parent'
        });

		console.log('addone');
	},
	render: function(){



		return this.el;
	}
});


var nodeCollection = new NodeCollection();
var nodeCollectionView = new NodeCollectionView({
	collection: nodeCollection
});

$('body').append(nodeCollectionView.render());


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
            lineWidth:2,
            		joinstyle:"round",
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