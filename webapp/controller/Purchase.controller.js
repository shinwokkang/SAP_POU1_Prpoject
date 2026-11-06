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

            let StoreNameSet = [
                                {Store : "강남점"},
                                {Store : "대구전"},
                                {Store : "대전점"},
                                {Store : "부산점"},
                                {Store : "성남점"},
                                {Store : "성수점"},
                                {Store : "수원점"},
                                {Store : "전주점"},
                                {Store : "제주점"},
                                {Store : "춘천점"}
                               ],
                oStoreModel = new JSONModel(StoreNameSet);
            this.getView().setModel(oStoreModel, "Store");

            this.getView().setModel(new JSONModel("/model/Data.json"),"Cafe");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        searchPurchase: function()
        {
            
            let oBinding     = this.getView().byId("purchasePage").getBinding("rows"),
                oFilter      = null,
                aFilter      = [],
                vStorename   = this.getView().byId("cbStoreName").getValue(),
                vMaterialName= this.getView().byId("cbMaterialName").getValue(),
                vStatus      = this.getView().byId("cbStatus").getValue();
                
            if (vStorename != "") 
            {
                oFilter = new Filter({                                                
                    path     : "Storename",
                    operator : FilterOperator.Contains,                             
                    value1   : vStorename                                          
                });

                aFilter.push(oFilter);
            };

            if(vMaterialName != "")
            {
                oFilter = new Filter({                                              
                    path     : "Matname",
                    operator : FilterOperator.Contains,                              
                    value1   : vMaterialName                                                
                });

                aFilter.push(oFilter);

            };

            if(vStatus != "")
            {
                oFilter = new Filter({                                              
                    path     : "Status",
                    operator : FilterOperator.Contains,                              
                    value1   : vStatus                                                
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);
        }

        
    });
});