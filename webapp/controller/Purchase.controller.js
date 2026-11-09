sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"


], (Controller,JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Purchase", {
        onInit() {
                    
            // 일반 메뉴에서 8번으로 들어올 때
            this.getRouter().getRoute("Purchase").attachPatternMatched(
                this.onShowPurchase, this);

            // 7번에서 지점, 원재료를 전달받을 때
            this.getRouter().getRoute("PurchaseParam").attachPatternMatched(
                this.onShowParam, this);

            let StatusSet= [
                            {Status: "발주완료"},
                            {Status: "발주요청"},
                            {Status: "입고완료"}
                           ]
                        

            this.getView().setModel(new JSONModel("/model/store.json"), "StoSet");
            this.getView().setModel(new JSONModel("/model/Material.json"),"MSET");
            this.getView().setModel(new JSONModel(StatusSet),"StaSet");

            

        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onAlertColor: function(vStatus)
        {
            if(vStatus == "발송 완료")
            {
                return "Success";
            }
            else
            {
                return "None";
            }
        },
        onUpdateAlert: function()
        {
           
            let oModel = this.getOwnerComponent().getModel(),
                oData = oModel.getData(),
                lt_stock = oData.StockSet,
                lt_purchase = oData.PurchaseSet;



            // 발주 데이터를 하나씩 확인
            for(let i = 0; i < lt_purchase.length; i++)
            {
                let ls_purchase = lt_purchase[i],
                    vStatus = "";

                // 재고 데이터와 비교
                for(let ls_stock of lt_stock)
                {
                    if(ls_purchase.Storeid == ls_stock.Storeid &&
                       ls_purchase.Matnr == ls_stock.Matnr &&
                       ls_stock.AlertStatus == "발송 완료")
                    {
                        vStatus = "발송 완료";

                    }
                }

                // 발주 데이터에 알림 상태 반영
                oModel.setProperty(
                    "/PurchaseSet/" + i + "/AlertStatus",
                    vStatus
                );
            }
        },

        searchPurchase: function()
        {
            
            let oBinding     = this.getView().byId("purchaseTable").getBinding("rows"),
                oFilter      = null,
                aFilter      = [],
                vStorename   = this.getView().byId("IstoreName").getSelectedKey(),
                vMaterialName= this.getView().byId("ImaterialName").getSelectedKey(),
                vStatus      = this.getView().byId("Istatus").getSelectedKey();
                
            if (vStorename != "") 
            {
                oFilter = new Filter({                                                
                    path     : "Storeid",
                    operator : FilterOperator.Contains,                             
                    value1   : vStorename                                          
                });

                aFilter.push(oFilter);
            };

            if(vMaterialName != "")
            {
                oFilter = new Filter({                                              
                    path     : "Matnr",
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
        },

        onShowPurchase: function()
            {
                // 알림상태 최신화
                this.onUpdateAlert();

                // 일반 메뉴 진입 시 조회 조건 초기화
                this.getView().byId("IstoreName").setSelectedKey("");
                this.getView().byId("ImaterialName").setSelectedKey("");
                this.getView().byId("Istatus").setSelectedKey("");

                var oBinding = this.getView().byId("purchaseTable").getBinding("rows");

                oBinding.filter([]);
            },

            onShowParam: function(oEvent)
            {
                // URL 매개변수 받기
                let vStore = oEvent.getParameters().arguments.Storeid,
                    vMatnr = oEvent.getParameters().arguments.Matnr;

                // ComboBox에 전달받은 값 선택
                this.getView().byId("IstoreName").setSelectedKey(vStore);
                this.getView().byId("ImaterialName").setSelectedKey(vMatnr);
                this.getView().byId("Istatus").setSelectedKey("");

                // 기존 알림 상태 최신화
                this.onUpdateAlert();

                // 전달받은 지점과 원재료로 자동 조회
                let oBinding = this.getView().byId("purchaseTable").getBinding("rows"),
                    aFilter = [],
                    oFilter = null;

                oFilter = new Filter({
                    path: "Storeid",
                    operator: FilterOperator.EQ,
                    value1: vStore
                });

                aFilter.push(oFilter);

                oFilter = new Filter({
                    path: "Matnr",
                    operator: FilterOperator.EQ,
                    value1: vMatnr
                });

                aFilter.push(oFilter);

                oBinding.filter(aFilter);
            },



        
    });
});