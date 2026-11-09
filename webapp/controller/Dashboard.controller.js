sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Dashboard", {
        onInit() 
        {
            this.getRouter().getRoute("Dashboard");
          
        },
          getRouter: function()
        {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }


        

            




    });
});