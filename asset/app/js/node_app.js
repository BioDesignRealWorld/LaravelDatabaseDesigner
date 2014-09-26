DesignerApp = new Backbone.Marionette.Application();


DesignerApp.addRegions({
  mainContent: "#apps",
  modals: {
      selector:   '.modals-container',
      regionType: Backbone.Marionette.Modals
    }
});