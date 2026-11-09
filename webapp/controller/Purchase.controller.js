sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"


], (Controller,JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Purchase", 
    {
        onInit() {
            this.getRouter().getRoute("Purchase");

            let StatusSet= [                                                            // 발주상태의 중복을 제거하기 위해 간단한 Internal 테이블 생성
                            {Status: "발주완료"},
                            {Status: "발주요청"},
                            {Status: "입고완료"}
                           ]

            this.getView().setModel(new JSONModel("/model/Store.json"), "StoSet");      // 매점id와 매점명을 "StoSet" 공간에 저장
            this.getView().setModel(new JSONModel("/model/Material.json"),"MSET");
            this.getView().setModel(new JSONModel(StatusSet),"StaSet");                 // 발주상태 테이블을 "StaSet" 공간에 저장
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        searchPurchase: function()
        {
            
            let oBinding     = this.getView().byId("purchaseTable").getBinding("rows"), // 테이블의 아이디 "purchaseTable" 와 "rows"로 바인딩 할 값을 가져온다.
                oFilter      = null,
                aFilter      = [],
                vStorename   = this.getView().byId("IstoreName").getSelectedKey(),      // combo box의 id를 통해 key값을 가져온다.
                vMaterialName= this.getView().byId("ImaterialName").getSelectedKey(),
                vStatus      = this.getView().byId("Istatus").getSelectedKey();
                
            if (vStorename != "") 
            {
                oFilter = new Filter({                                                
                    path     : "Storeid",
                    operator : FilterOperator.EQ,                             
                    value1   : vStorename                                          
                });

                aFilter.push(oFilter);
            };

            if(vMaterialName != "")
            {
                oFilter = new Filter({                                              
                    path     : "Matnr",
                    operator : FilterOperator.EQ,                              
                    value1   : vMaterialName                                                
                });

                aFilter.push(oFilter);

            };

            if(vStatus != "")
            {
                oFilter = new Filter({                                              
                    path     : "Status",
                    operator : FilterOperator.EQ,                              
                    value1   : vStatus                                                
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);
        }
    });
});