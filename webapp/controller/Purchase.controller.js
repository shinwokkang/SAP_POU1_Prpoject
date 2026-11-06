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
                        },

                oData2= {
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

            let StatusSet= [
                            {Status: "발주완료"},
                            {Status: "발주요청"},
                            {Status: "입고완료"}
                           ]
                        

            this.getView().setModel(new JSONModel(oData), "StoSet");
            this.getView().setModel(new JSONModel(oData2),"MSET");
            this.getView().setModel(new JSONModel(StatusSet),"StaSet");

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
                vStorename   = this.getView().byId("IstoreName").getValue(),
                vMaterialName= this.getView().byId("ImaterialName").getValue(),
                vStatus      = this.getView().byId("Istatus").getValue();
                
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