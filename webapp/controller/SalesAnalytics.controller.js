sap.ui.define([
    "sap/ui/core/mvc/Controller",          // 컨트롤러 기본 클래스
    "sap/ui/model/json/JSONModel",         // JSON 데이터 모델
    "sap/ui/model/Filter",                 // 필터 객체
    "sap/ui/model/FilterOperator"          // 필터 비교 방법 (EQ 등)
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.SalesAnalytics", {

        
        onInit()
        {
            let oView      = this.getView(),
                oCafeModel = new JSONModel("/data/CafeSet.json");   // webapp/data/CafeSet.json

            oView.setModel(oCafeModel, "CSET");

            this.setChartProperties();
        },

        getRouter : function()
        {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        
        setChartProperties : function()
        {
            this.byId("storeSalesChart").setVizProperties({
                title        : { visible : true, text : "지점별 총매출" },
                legend       : { visible : true },
                plotArea     : { dataLabel : { visible : true } },
                valueAxis    : { title : { visible : true, text : "매출액 (원)" } },
                categoryAxis : { title : { visible : true, text : "지점" } }
            });
        },

        /**
         * [지점 ID 필터] MultiComboBox에서 선택을 마치면 실행
         * - 선택한 지점만 차트에 표시 (여러 개 = OR → 춘천점 또는 부산점)
         * - 선택을 다 지우면 필터 해제 → 전체 지점
         */
        onStoreFilter : function()
        {
            let aKeys    = this.byId("storeFilter").getSelectedKeys(),            // 선택한 지점 ID 목록 (ex: ["S005", "S009"])


                // 2. 차트 dataset의 "data" 바인딩(연결선) 가져오기
                //    (Grid Table의 getBinding("rows")와 같은 원리)
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

            // 4. 필터 적용 (빈 배열이면 해제 → 전체 표시)
            oBinding.filter(aFilter);
        }
    });
});