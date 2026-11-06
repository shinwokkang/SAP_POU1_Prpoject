sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator,MessageBox) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.StockShortage", {
       onInit()
        {
            // Data.json(manifest 기본 모델)을 "CSET" 이름으로 화면에 연결
            this.getView().setModel(this.getOwnerComponent().getModel(), "CSET");

            // 표에서 Status가 "부족"인 것만 남긴다 (Menu / Store 화면과 같은 방식)
            let oBinding = this.byId("shortageTable").getBinding("rows"),
                oFilter  = new Filter({
                    path     : "Status",
                    operator : FilterOperator.EQ,
                    value1   : "부족"
                });

            oBinding.filter([oFilter]);
        },

        // 표가 다시 그려질 때마다 "총 n건" 문구를 바꾼다 (뷰의 rowsUpdated 이벤트)
        onRowsUpdated : function ()
        {
            let lv_count = this.byId("shortageTable").getBinding("rows").getLength();

            this.byId("shortageStrip").setText("최소 재고 기준 이하인 품목입니다. (총 " + lv_count + "건)");
        },

        // 부족 수량 칸의 글자
        formatShortText : function (iQuantity, iMinqty)
        {
            if (iQuantity === iMinqty) {
                return "기준 도달";
            }
            return iMinqty - iQuantity;
        },

        // ⑤ 부족 수량 칸의 색
        formatShortState : function (iQuantity, iMinqty)
        {
            if (iQuantity === 0)       { return "Error"; }         // 품절 → 빨강
            if (iQuantity === iMinqty) { return "Information"; }   // 기준 도달 → 파랑
            return "Warning";                                      // 부족 → 주황
        },
        // 알람 추가
                
        onSendAlert: function(oEvent)
        {
            console.log("1. 부족 수량 클릭");

            let oContext = oEvent.getSource().getBindingContext("CSET"),
                ls_stock = oContext.getObject(),
                oModel = this.getView().getModel("CSET"),
                vPath = oContext.getPath();

            console.log("2. 선택한 재고:", ls_stock.Storeid, ls_stock.Matnr);

            MessageBox.confirm(
                ls_stock.Storename + "의 " + ls_stock.Matname +
                " 발주 요청 알림을 보내시겠습니까?",
                {
                    title: "발주 요청 안내",
                    actions: ["예", "아니요"],
                    emphasizedAction: "예",

                    onClose: function(vAction)
                    {

                        if(vAction == "예")
                        {
                            oModel.setProperty(
                                vPath + "/AlertStatus",
                                "발송 완료"
                            );


                            MessageBox.information("발주 요청 알림이 등록되었습니다.");
                        }
                    }
                }
            );
        }

    });
});