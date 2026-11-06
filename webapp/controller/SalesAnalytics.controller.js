sap.ui.define([
    "sap/ui/core/mvc/Controller",          
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",                
    "sap/ui/model/FilterOperator"          
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.SalesAnalytics", {
        onInit()
        {
            this.getView().setModel(new JSONModel("/model/Data.json"), "Chart");
            this.setChartProperties();
        },

        getRouter : function()
        {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },


        onSearch : function()
        {
            let oModel = this.getOwnerComponent().getModel(),            
                aSales = oModel.oData.SalesSet,                          // 판매 내역 전체 (날짜 있음)
                aKeys  = this.byId("storeFilter").getSelectedKeys(),     // 선택한 지점 ID (없으면 전체)
                vFrom  = this.byId("dateFrom").getValue(),               // 시작일 "2026-10-30"
                vTo    = this.byId("dateTo").getValue(),                 // 종료일 "2026-11-03"
                oStore = {},                                             // { 지점명 : 매출합계 }
                oMenu  = {},                                             // { 메뉴명 : 판매량합계 }
                aStore = [],                                             // 차트 1용 배열
                aMenu  = [];                                             // 차트 2용 배열

            // 판매 내역을 한 줄씩 보면서 조건에 맞는 것만 합산
            for (let oSale of aSales)
            {
                if (oSale.Salesdate < vFrom || oSale.Salesdate > vTo)
                    continue;

                // 지점을 골랐으면, 고른 지점인지 확인 (matchNum 방식)
                if (aKeys.length > 0)
                {
                    let vMatch = false;

                    for (let vKey of aKeys)
                    {
                        if (vKey == oSale.Storeid)
                            vMatch = true;
                    }

                    if (vMatch == false)
                        continue;
                }

                //  지점별 매출, 메뉴별 판매량 누적 (처음 나온 이름이면 0부터)
                if (oStore[oSale.Storename] == undefined) oStore[oSale.Storename] = 0;
                if (oMenu[oSale.Menuname]   == undefined) oMenu[oSale.Menuname]   = 0;

                oStore[oSale.Storename] += oSale.Amount;
                oMenu[oSale.Menuname]   += oSale.Quantity;
            }

            //  { 이름 : 합계 } 객체 → 차트용 배열
            for (let vName in oStore)
                aStore.push({ Storename : vName, Salesamt : oStore[vName] });

            for (let vName in oMenu)
                aMenu.push({ Menuname : vName, Soldqty : oMenu[vName] });

            // 계산 결과를 "Chart" 이름의 모델로 View에 연결 → 차트 자동 갱신
            this.getView().setModel(new JSONModel({
                SalesSummarySet : aStore,
                MenuSet  : aMenu
            }), "Chart");
        },
       


        setChartProperties : function()
        {
            // 차트 1: 지점별 총매출 
            this.byId("storeSalesChart").setVizProperties({
                title        : { visible : true, text : "지점별 총매출" },
                legend       : { visible : true },
                plotArea     : { dataLabel : { visible : true } },
                valueAxis    : { title : { visible : true, text : "매출액 (원)" } },
                categoryAxis : { title : { visible : true, text : "지점" } }
            });

            // 차트 2: 메뉴별 판매량
            this.byId("menuQtyChart").setVizProperties({
                title        : { visible : true, text : "메뉴별 판매량" },
                legend       : { visible : true },
                plotArea     : { dataLabel : { visible : true } },
            });
        },

        
        onStoreFilter : function()
        {
            // 1. 선택한 지점 ID 목록 (ex: ["S005", "S009"])
            let aKeys    = this.byId("storeFilter").getSelectedKeys(),

                // 2. 차트 1 dataset의 "data" 바인딩 가져오기
                oBinding = this.byId("storeSalesChart").getDataset().getBinding("data"),

                aFilter  = [];   // 적용할 필터 모음

            // 3. 선택한 ID마다 "Storeid = 선택값" 조건 추가
            for (let vKey of aKeys)
            {
                aFilter.push(new Filter({
                    path     : "Storeid",
                    operator : FilterOperator.EQ,
                    value1   : vKey
                }));
            }

            oBinding.filter(aFilter);
        },

        onMenuFilter : function()
        {
            // 선택한 메뉴 ID 목록 (ex: ["M001", "M007"])
            let aKeys    = this.byId("menuFilter").getSelectedKeys(),

                oBinding = this.byId("menuQtyChart").getDataset().getBinding("data"),

                aFilter  = [];   // 적용할 필터 모음

            for (let vKey of aKeys)
            {
                aFilter.push(new Filter({
                    path     : "Menuid",
                    operator : FilterOperator.EQ,
                    value1   : vKey
                }));
            }

            oBinding.filter(aFilter);
        }
    });
});