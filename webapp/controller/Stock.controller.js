sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,JSONModel,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Stock", {
        onInit() {
            this.getRouter().getRoute("Stock");

            let oModel1 = new JSONModel("../data/CafeSet.json");

            this.getView().setModel(oModel1, "CAFE");
        },


        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onSearch:function()
        {
            let oBinding = this.getView().byId("CafeSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStore = this.getView().byId("IStore").getSelectedKey();
                vMatnr = this.getView().byId("IMatnr").getSelectedKey();
        }
    });
});