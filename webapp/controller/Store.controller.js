sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Store", {
        onInit() {
            this.getRouter().getRoute("Store");

            let oStoreModel = new JSONModel("/data/Cafeset.json");
            this.getView().setModel(oStoreModel, "Store")

            let RegionSet = [
                            {Region : "서울"},
                            {Region : "경기도"},
                            {Region : "강원도"},
                            {Region : "충청도"},
                            {Region : "경상도"},
                            {Region : "전라도"},
                            {Region : "제주도"}
                            ],
                oRegionModel = new JSONModel(RegionSet);
            this.getView().setModel(oRegionModel, "Region");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onStoreSearch : function()
        {
            let oBinding = this.getView().byId("StoreSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStorename = this.getView().byId("iStorename").getValue(),
                vRegion = this.getView().byId("iRegion").getValue();

            if(vStorename != "")
            {
                oFilter = new Filter({
                    path     : "Storename",
                    operator : FilterOperator.Contains,
                    value1 : vStorename
                });

                aFilter.push(oFilter);
            }; 

            

            if(vRegion != "")
            {
                oFilter = new Filter({
                    path     : "Region",
                    operator : FilterOperator.EQ,
                    value1 : vRegion
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);
        }
    });
});