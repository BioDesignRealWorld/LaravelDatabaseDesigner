var node_data = [{
    "name": "Bears",
    "color": "Blue",
    "position": {
        "x": 130,
        "y": 162
    },
    "modelclass": "Bear",
    "column": [{
        "name": "id",
        "type": "increments",
        "length": "0",
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "name",
        "type": "string",
        "length": "200",
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "danger_level",
        "type": "string",
        "length": "200",
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "",
        "name": "fish",
        "relatedmodel": "Fish",
        "relationtype": "hasOne",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "",
        "name": "trees",
        "relatedmodel": "Trees",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "bear_id, picnic_id",
        "name": "picnics",
        "relatedmodel": "Picnics",
        "relationtype": "belongsToMany",
        "usenamespace": ""
    }]
}, {
    "name": "Fish",
    "color": "Grey",
    "position": {
        "x": 1053,
        "y": 28
    },
    "modelclass": "Fish",
    "column": [{
        "name": "id",
        "type": "increments",
        "length": "0",
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "bear_id",
        "type": "integer",
        "length": "0",
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "weight",
        "type": "integer",
        "length": "0",
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "",
        "name": "bear",
        "relatedmodel": "Bears",
        "relationtype": "belongsTo",
        "usenamespace": ""
    }]
}, {
    "name": "Trees",
    "color": "Red",
    "position": {
        "x": 1048,
        "y": 329
    },
    "modelclass": "Tree",
    "column": [{
        "name": "id",
        "type": "increments",
        "length": "0",
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "bear_id",
        "type": "integer",
        "length": "0",
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "type",
        "type": "string",
        "length": "100",
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "",
        "name": "bear",
        "relatedmodel": "Bears",
        "relationtype": "belongsTo",
        "usenamespace": ""
    }]
}, {
    "name": "Picnics",
    "color": "Red",
    "position": {
        "x": 130,
        "y": 614
    },
    "modelclass": "Picnic",
    "column": [{
        "name": "id",
        "type": "increments",
        "length": "0",
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "name",
        "type": "string",
        "length": "100",
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "taste_level",
        "type": "integer",
        "length": "0",
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "picnic_id, bear_id",
        "name": "bears",
        "relatedmodel": "Bears",
        "relationtype": "belongsToMany",
        "usenamespace": ""
    }]
}, {
    "name": "bears_picnics",
    "color": "Red",
    "position": {
        "x": 402,
        "y": 618
    },
    "modelclass": "bear_to_picnic",
    "column": [{
        "name": "id",
        "type": "increments",
        "length": "0",
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "bear_id",
        "type": "integer",
        "length": "0",
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "picnic_id",
        "type": "integer",
        "length": "0",
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": []
}];

//var nodeCanvas = new NodeCanvas();

var testview = new DesignerApp.NodeModule.Views.NodeCanvas({
    collection: DesignerApp.NodeEntities.getNodeCanvas()
});


DesignerApp.commands.setHandler("draw:relation:model", function() {
    DesignerApp.NodeEntities.AddNodeCanvas(node_data);
});



DesignerApp.mainContent.show(testview);


jsPlumb.ready(function() {

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

    var instance = jsPlumb.importDefaults({
        ConnectionsDetachable: true,
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
    instance.doWhileSuspended(function() {
        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind("connection", function(info, originalEvent) {

            // console.log(info);
        });

        instance.bind("connectionDetached", function(info, originalEvent) {
            // console.log(info);

        });

        instance.bind("beforeDrop", function(connection) {
            console.log(connection);
            //console.log(getNodeContainerFromNodeCid(connection.sourceId));
            //console.log(getNodeContainerFromNodeCid(connection.targetId));

            return false;
            if (connection.sourceId == connection.targetid)
                return false;
            else
                return true;
        });
    });
    DesignerApp.execute("draw:relation:model");
});