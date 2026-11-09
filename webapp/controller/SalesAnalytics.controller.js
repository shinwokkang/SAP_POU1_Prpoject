sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"

], (Controller, Filter, FilterOperator, MessageToast) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.SalesAnalytics", {
        onInit()
        {
            // 차트는 View에서 기본 모델의 /SalesSet에 바로 바인딩되어 있어서 따로 할 일 없음
        },

        onSearch : function()
        {
            // 차트 데이터셋에 묶여있는 걸 가져올라면 getBinding() → 테이블은 "rows" 엿지만 차트 데이터셋은 "data"
            let oStoreBinding = this.getView().byId("storeDataset").getBinding("data"),
                oMenuBinding  = this.getView().byId("menuDataset").getBinding("data"),

                // 바인딩 가지고 필터 걸거임
                oFilter = null,                                                  // 사용자가 입력할때 처리하기 위해 일단은 선언
                aFilter = [],
                aKeys   = this.getView().byId("storeFilter").getSelectedKeys(),  // 선택한 지점 ID들 (여러 개라 배열) ex) ["S001", "S005"]
                vFrom   = this.getView().byId("dateFrom").getValue(),            
                vTo     = this.getView().byId("dateTo").getValue();             

            // 기간 필터
            if(vFrom != "" && vTo != "")
            {
                oFilter = new Filter({
                                        path     : "Salesdate",
                                        operator : FilterOperator.BT, 
                                        value1   : vFrom,
                                        value2   : vTo
                                    });

                aFilter.push(oFilter);
            }

            // 지점 필터 : 선택한 지점 ID마다 하나씩 추가
            // 같은 path(Storeid)끼리는 OR, 다른 path(Salesdate)와는 AND로 묶임
            for(let vKey of aKeys)
            {
                oFilter = new Filter({
                                        path     : "Storeid",
                                        operator : FilterOperator.EQ,
                                        value1   : vKey
                                    });

                aFilter.push(oFilter);
            }

            
            // 두 차트에 같은 필터 적용
            //   → 걸러진 판매 내역을 VizFrame이 Dimension(지점명 / 메뉴명) 기준으로 합쳐서 그려줌
            oStoreBinding.filter(aFilter);
            oMenuBinding.filter(aFilter);
        },

        // 상세보기 : 고른 지점, 기간을 가지고 매출 조회(5번) 화면으로 이동
        onDetail : function()
        {
            let aKeys   = this.getView().byId("storeFilter").getSelectedKeys(),  // 고른 지점 ID들 ex) ["S001"]
                vFrom   = this.getView().byId("dateFrom").getValue(),            // 시작일 "2026-10-30"
                vTo     = this.getView().byId("dateTo").getValue(),              // 종료일 "2026-11-03"
                vStore  = "ALL",                                                 // 지점 안 고르면 "ALL" (전체)
                oRouter = this.getOwnerComponent().getRouter();
 
            // 매출 조회 화면은 지점을 하나만 고를 수 있어서, 2개 이상이면 막음
            if(aKeys.length > 1)
            {
                MessageToast.show("상세보기는 지점을 하나만 선택해 주세요.");
                return;
            }
 
            if(aKeys.length == 1)
                vStore = aKeys[0];
            
            // 두 차트에 같은 필터 적용
            //   → 걸러진 판매 내역을 VizFrame이 Dimension(지점명 / 메뉴명) 기준으로 합쳐서 그려줌
            oStoreBinding.filter(aFilter);
            oMenuBinding.filter(aFilter);

            // URL 자리는 비워둘 수 없어서, 날짜가 비어 있으면 "ALL"로 보냄
            if(vFrom == "")
                vFrom = "ALL";
 
            if(vTo == "")
                vTo = "ALL";
 
            // 매출 조회 화면으로 이동하면서 값 전달
            oRouter.navTo("SalesParam", {
                                            Storeid : vStore,
                                            From    : vFrom,
                                            To      : vTo
                                        });
        }
    });
});