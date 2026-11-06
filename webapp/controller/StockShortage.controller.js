sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.StockShortage", {
        onInit()
        {
            this.getRouter().getRoute("StockShortage");

            // ① 공통 데이터(CafeSet.json)를 "CSET" 이름으로 화면에 연결
            //    (1번이 Component에 CSET를 등록하면 이 두 줄은 바꾼다)
            let oModel = new JSONModel("/data/CafeSet.json");
            this.getView().setModel(oModel, "CSET");

            // ② 파일 읽기가 "끝난 뒤에" 부족 목록을 만든다
            oModel.dataLoaded().then(() => {
                this.makeShortageList();
            });
        },

        // ③ StockSet에서 부족 재고만 골라 새 배열을 만든다
        makeShortageList : function ()
        {
            // let lt_stock    = this.getView().getModel("CSET").getProperty("/StockSet"), // [ {}, {}, ... ] 60건
            let lt_stock    = this.getView().getModel("CEST").oData.StockSet;
                lt_shortage = [];                                                       // 부족 품목을 담을 빈 배열

            for (const ls_stock of lt_stock) {

                // 판단 기준 : 현재 재고 <= 최소 재고 → 부족
                if (ls_stock.Quantity <= ls_stock.Minqty) {

                    let lv_shortqty = ls_stock.Minqty - ls_stock.Quantity, // 부족 수량
                        lv_text     = String(lv_shortqty),                 // 표에 보여줄 글자
                        lv_state    = "Warning";                           // 기본 색 : 주황

                    if (ls_stock.Quantity === 0) {          // 재고 0 → 품절
                        lv_state = "Error";                 // 빨강
                    } else if (lv_shortqty === 0) {         // 현재 = 최소 → 기준 도달
                        lv_text  = "기준 도달";
                        lv_state = "Information";           // 파랑
                    }

                    let ls_shortage = {
                        Storeid   : ls_stock.Storeid,       // 나중에 8번 발주 화면과 연결할 때 사용
                        Storename : ls_stock.Storename,
                        Matnr     : ls_stock.Matnr,
                        Matname   : ls_stock.Matname,
                        Quantity  : ls_stock.Quantity,
                        Minqty    : ls_stock.Minqty,
                        Unit      : ls_stock.Unit,
                        Shortqty  : lv_shortqty,
                        ShortText : lv_text,
                        State     : lv_state
                    };
                    lt_shortage.push(ls_shortage);          // [ {}, {}, ... ]
                }
            }

            // ④ 결과를 "Shortage" 모델로 화면에 연결
            let oShortageModel = new JSONModel({
                gt_shortage : lt_shortage,
                gv_count    : lt_shortage.length
            });
            this.getView().setModel(oShortageModel, "Shortage");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
});