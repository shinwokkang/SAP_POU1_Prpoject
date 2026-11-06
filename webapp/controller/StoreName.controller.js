sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"


], (Controller,JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.StoreName", {
        onInit() {
            this.getRouter().getRoute("Purchase");

            let oData = {
                            StoreNameSet :
                            [
                                {Strcd: "S001", Store : "성수점"},
                                {Strcd: "S002", Store : "강남점"},
                                {Strcd: "S003", Store : "수원점"},
                                {Strcd: "S004", Store : "성남점"},
                                {Strcd: "S005", Store : "춘천점"},
                                {Strcd: "S006", Store : "대전점"},
                                {Strcd: "S007", Store : "전주점"},
                                {Strcd: "S008", Store : "대구점"},
                                {Strcd: "S009", Store : "부산점"},
                                {Strcd: "S010", Store : "제주점"}
                            ]
                        
                        };

            this.getView().setModel(new JSONModel(oData), "StoSet");
            this.getRouter().getRoute("RouteLeftView").attachPatternMatched(this.onSum.bind(this), this);

        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onSum: function (oEvent)
        {
            let vNum1 = oEvent.getParameter("arguments").Number1,
                vNum2 = oEvent.getParameter("arguments").Number2,
                vSum  = 0;
            
            // if (vNum1 !="")
            if (vNum1)
            {
                vSum = vSum + parseInt(vNum1);
            }

            if (vNum2)
            {
                vSum = vSum + parseInt(vNum2);
            }

            this.getView().byId("TSum").setText(vSum);
        },

        searchPurchase: function()
        {
            
            let oBinding     = this.getView().byId("purchaseTable").getBinding("rows"),
                vStorename   = this.getView().byId("IstoreName").getSelectedKey();
                
            this.getRouter().navTo("StoreName", { oBinding: vNum1, Number2: vNum2 });
        },

        onInit()
        {
            let oData = {
                            StoreNameSet :
                            [
                                {Strcd: "S001", Store : "성수점"},
                                {Strcd: "S002", Store : "강남점"},
                                {Strcd: "S003", Store : "수원점"},
                                {Strcd: "S004", Store : "성남점"},
                                {Strcd: "S005", Store : "춘천점"},
                                {Strcd: "S006", Store : "대전점"},
                                {Strcd: "S007", Store : "전주점"},
                                {Strcd: "S008", Store : "대구점"},
                                {Strcd: "S009", Store : "부산점"},
                                {Strcd: "S010", Store : "제주점"}
                            ]
                        };
            
            this.getRouter().getRoute("StoreName").attachPatternMatched(this.onSum.bind(this), this);
        },

        onSum: function (oEvent)
        {
            let oBinding     = this.getView().byId("purchaseTable").getBinding("rows"),
                oFilter      = null,
                aFilter      = [],
                vStorename   = this.getView().byId("IstoreName").getSelectedKey();
            
            if (vStorename != "") 
            {
                oFilter = new Filter({                                                
                    path     : "Storeid",
                    operator : FilterOperator.Contains,                             
                    value1   : vStorename                                          
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);

            this.getView().byId("TSum").setText(vSum);
        }

    });
});