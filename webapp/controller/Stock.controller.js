sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Stock", {
        onInit() 
        {
            var oData= {
                MaterialSet: 
                [
                    {Matnr: "R001", Matname: "원두"},
                    {Matnr: "R002", Matname: "우유"},
                    {Matnr: "R003", Matname: "말차가루"},
                    {Matnr: "R004", Matname: "초코파우더"},
                    {Matnr: "R005", Matname: "밀가루"},
                    {Matnr: "R006", Matname: "버터"}
                ]
            };
            
            var oModel = new JSONModel(oData);

            this.getView().setModel(oModel,"MSET");

            this.getRouter().getRoute("Stock");

        },


        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onStatusColor: function(vStatus)
        {
            if(vStatus == "부족")
             {
                return "Warning";
             }
             else
              {
                return "Success";
              }
        },


        onSearch:function()
        {
            let oBinding = this.getView().byId("StockSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStore = this.getView().byId("IStore").getSelectedKey(),
                vMatnr = this.getView().byId("IMatnr").getSelectedKey();

            if(vStore != "")
            {
                 oFilter = new Filter({
                     path : "Storeid",
                     operator: FilterOperator.EQ,
                     value1: vStore
                 });

                 aFilter.push(oFilter);

            };

            if(vMatnr != "")
            {
                 oFilter = new Filter({
                     path : "Matnr",
                     operator: FilterOperator.EQ,
                     value1: vMatnr
                 });

                 aFilter.push(oFilter);

            };
            
            oBinding.filter(aFilter);
        },

        onReset: function()
        {
            this.getView().byId("IStore").setSelectedKey("");

            this.getView().byId("IMatnr").setSelectedKey("");

            var oBinding = this.getView().byId("StockSet").getBinding("rows");

            oBinding.filter([]);
        }

    });
});