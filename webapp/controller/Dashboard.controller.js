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
        formatOperatingCount: function (aStores) {
          if (!Array.isArray(aStores)) 
            {
                 return 0;
             }

    return aStores.filter(function (oStore) 
    {
        return oStore.Status === "운영중";
    }).length; },

          getRouter: function ()
          {
               return sap.ui.core.UIComponent.getRouterFor(this);
            },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },



        

            




    });
});