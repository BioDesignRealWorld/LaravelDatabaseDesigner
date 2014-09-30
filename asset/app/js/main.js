var node_data = [{
    "name": "Users",
    "color": "",
    "position": {
        "x": 87,
        "y": 60
    },
    "column": [{
        "name": "username",
        "type": "string",
        "length": 30,
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "id",
        "type": "increments",
        "length": 30,
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "email",
        "type": "string",
        "length": 200,
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "password",
        "type": "string",
        "length": 100,
        "order": 3,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Roles",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Map",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Roles",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "",
        "name": "",
        "relatedmodel": "Roles",
        "relationtype": "hasOne",
        "usenamespace": ""
    }]
}, {
    "name": "Roles",
    "color": "",
    "position": {
        "x": 1092,
        "y": 80
    },
    "column": [{
        "name": "id",
        "type": "increments",
        "length": 30,
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "username",
        "type": "string",
        "length": 30,
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "email",
        "type": "string",
        "length": 200,
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "password",
        "type": "string",
        "length": 100,
        "order": 3,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "",
        "name": "",
        "relatedmodel": "Map",
        "relationtype": "hasOne",
        "usenamespace": ""
    }]
}, {
    "name": "Map",
    "color": "",
    "position": {
        "x": 143,
        "y": 582
    },
    "column": [{
        "name": "id",
        "type": "increments",
        "length": 30,
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "username",
        "type": "string",
        "length": 30,
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "email",
        "type": "string",
        "length": 200,
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "password",
        "type": "string",
        "length": 100,
        "order": 3,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "",
        "name": "",
        "relatedmodel": "Users",
        "relationtype": "hasOne",
        "usenamespace": ""
    }]
}];




//      
//      
//      
//      jsPlumb
//      jsPlumb
//      jsPlumb
//      jsPlumb
//      
//      
//      
//      
//      



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
            //console.log(info.connection.getParameters());
        });

        instance.bind("connectionDetached", function(info, originalEvent) {
            //todo: refactor
            //console.log(info.connection.getParameter("relation"))
            var relation = info.connection.getParameter("relation");


            if (relation) {
              //  console.log(info);
                relation.set("conn", "");
                relation.destroy();
            }


            //return false;
            //console.log(info.connection.getParameter("view").model);
            //info.connection.getParameter("view").model.destroy();
        });

        instance.bind("beforeDrop", function(connection) {

            if (connection.sourceId !== connection.targetId) {
                var node = connection.connection.getParameter("node");
                DesignerApp.execute("nodecanvas:create:relation", node, connection.targetId);
            }

            //console.log(getNodeContainerFromNodeCid(connection.sourceId));
            //console.log(getNodeContainerFromNodeCid(connection.targetId));

            return false;
        });
    });
    DesignerApp.execute("draw:relation:model");
});