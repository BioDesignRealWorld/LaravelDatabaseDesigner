  if (typeof process != 'undefined') {

      var path = './';
      var fs = require('fs');

      fs.watch(path, function() {
          if (location) {
              location.reload();
          }
      });

      var openFile = function(name) {
          var chooser = $(name);
          chooser.change(function(evt) {
              var fileName = $(this).val();

              fs.readFile(fileName, 'utf-8', function(error, contents) {
                  var jsonfile = (JSON.parse(contents));
                  DesignerApp.NodeEntities.ClearNodeCanvas(DesignerApp.NodeEntities.getNodeCanvas());
                  DesignerApp.NodeEntities.AddNodeCanvas(jsonfile);
              });

              $(this).val('');
          });
      };

      var saveFile = function(name) {
          var chooser = $(name);
          chooser.change(function(evt) {


              filename = $(this).val();
              fs.writeFile(filename, JSON.stringify(DesignerApp.NodeEntities.ExportToJSON()) , function(err) {
                  if (err) {
                      alert("error");
                  }
              });


              // Reset the selected value to empty ('')
              $(this).val('');
          });
      };

      openFile('#fileOpenDialog');
      saveFile('#fileSaveDialog');

  }