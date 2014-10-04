var node_data = [{"name":"Bears","color":"Blue","position":{"x":177,"y":85},"modelclass":"Bear","increment":false,"timestamp":false,"softdelete":false,"column":[{"colid":"c217","name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"colid":"c218","name":"name","type":"string","length":"200","order":1,"defaultvalue":"","enumvalue":""},{"colid":"c219","name":"danger_level","type":"string","length":"200","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"fish","relatedmodel":"Fish","relationtype":"hasOne","usenamespace":""},{"extramethods":"","foreignkeys":"","name":"trees","relatedmodel":"Trees","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"bear_id, picnic_id","name":"picnics","relatedmodel":"Picnics","relationtype":"belongsToMany","usenamespace":""}],"seeding":[]},{"name":"Fish","color":"Yellow","position":{"x":1063,"y":14},"modelclass":"Fish","increment":false,"timestamp":false,"softdelete":false,"column":[{"colid":"c237","name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"colid":"c238","name":"weight","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"colid":"c239","name":"bear_id","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Bears","relationtype":"belongsTo","usenamespace":""}],"seeding":[]},{"name":"Trees","color":"Green","position":{"x":1073,"y":367},"modelclass":"Tree","increment":false,"timestamp":false,"softdelete":false,"column":[{"colid":"c255","name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"colid":"c256","name":"bear_id","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"colid":"c257","name":"type","type":"string","length":"100","order":2,"defaultvalue":"","enumvalue":""}],"relation":[],"seeding":[]},{"name":"Picnics","color":"Red","position":{"x":201,"y":520},"modelclass":"Picnic","increment":"","timestamp":"","softdelete":"","column":[{"colid":"c272","name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"colid":"c273","name":"name","type":"string","length":"100","order":1,"defaultvalue":"","enumvalue":""},{"colid":"c274","name":"taste_level","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"picnic_id, bear_id","name":"bears","relatedmodel":"Bears","relationtype":"belongsToMany","usenamespace":""}],"seeding":[]},{"name":"bears_picnics","color":"Grey","position":{"x":467,"y":521},"modelclass":"bear_to_picnic","increment":false,"timestamp":false,"softdelete":false,"column":[{"colid":"c290","name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"colid":"c291","name":"bear_id","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"colid":"c292","name":"picnic_id","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[],"seeding":[]}];
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
            //console.log(relation);

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