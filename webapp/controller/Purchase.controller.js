sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"


], (Controller,JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Purchase", {
        onInit() {
            this.getRouter().getRoute("Purchase");

            this.getView().setModel(new JSONModel("/data/CafeSet.json"),"Cafe");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        searchPurchase: function()
        {
            
        }

        
    });
});