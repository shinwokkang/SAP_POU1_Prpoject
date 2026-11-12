sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator,MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.StockShortage", {
       onInit()
        {   
             //지점
             let aStoreList = [

                                {Store: "성수점"},
                                {Store: "강남점"},
                                {Store: "수원점"},
                                {Store: "성남점"},
                                {Store: "춘천점"},
                                {Store: "대전점"},
                                {Store: "전주점"},
                                {Store: "대구점"},
                                {Store: "부산점"},
                                {Store: "제주점"},
                                {Store: "광주점"}
                            
                             ],
                oStoreModel = new JSONModel(aStoreList);
            this.getView().setModel(oStoreModel, "StoreList");

            //원재료

            let aMatList = 
                [
                    {Matname: "원두"},
                    {Matname: "우유"},
                    {Matname: "말차가루"},
                    {Matname: "초코파우더"},
                    {Matname: "밀가루"},
                    {Matname: "버터"}
                ],
                oMatModel = new JSONModel(aMatList);
            this.getView().setModel(oMatModel, "MatList");


            // Data.json(manifest 기본 모델)을 "CSET" 이름으로 화면에 연결
            this.getView().setModel(this.getOwnerComponent().getModel(), "CSET");

            // 표에서 Status가 "부족"인 것만 남긴다 (Menu / Store 화면과 같은 방식)
            let oBinding = this.byId("shortageTable").getBinding("rows"),
                oFilter  = new Filter({
                    path     : "Status",
                    operator : FilterOperator.EQ,
                    value1   : "부족"
                });
            // 부족 상태인 품목만 테이블에 표시
            oBinding.filter([oFilter]);
        },

        // 표가 다시 그려질 때마다 "총 n건" 문구를 바꾼다 (뷰의 rowsUpdated 이벤트)
        onRowsUpdated : function ()
        {
            // 필터가 적용된 row 바인딩의 데이터 건수 가져오기
            let lv_count = this.byId("shortageTable").getBinding("rows").getLength();

            this.byId("shortageStrip").setText("최소 재고 기준 이하인 품목입니다. (총 " + lv_count + "건)");
        },

        // 현재 재고와 최소 재고 비교해 부족 수량 계산
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
        onSearch:function()
        {
            let oBinding = this.getView().byId("shortageTable").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStore = this.getView().byId("IStore").getValue(),
                vMatnr = this.getView().byId("IMat").getValue();

            if(vStore != "")
            {
                 oFilter = new Filter({
                     path : "Storename",
                     operator: FilterOperator.EQ,
                     value1: vStore
                 });

                 aFilter.push(oFilter);

            };

            if(vMatnr != "")
            {
                 oFilter = new Filter({
                     path : "Matname",
                     operator: FilterOperator.EQ,
                     value1: vMatnr
                 });

                 aFilter.push(oFilter);

            };
            
            oBinding.filter(aFilter);
        },
         
        // 알람 추가
                
            
        onSendAlert: function(oEvent)
        {
            // 클릭한 재고 정보 가져오기
            let oContext = oEvent.getSource().getBindingContext("CSET"),
                ls_stock = oContext.getObject(),
                oModel = this.getView().getModel("CSET"),
                vPath = oContext.getPath(), //데이터 모델의 위치(경로) 가져오기
                oRouter = this.getOwnerComponent().getRouter(), //발주페이지 이동 라우터 객체 가져오기
                oAppView = this.getOwnerComponent().getRootControl();

            MessageBox.confirm(
                ls_stock.Storename + "의 " + ls_stock.Matname + //지점 + 원재료 이름
                " 발주 요청 알림을 보내시겠습니까?",
                {
                    title: "발주 요청 안내",
                    actions: ["예", "아니요"],
                    emphasizedAction: "예",

                    onClose: function(vAction)
                    {
                        if(vAction == "예")
                        {
                            // 알림 상태 저장
                            oModel.setProperty( vPath + "/AlertStatus","발송 완료" );

                             // 발송 상태를 기록한 뒤 화면을 이동할지 확인
                            MessageBox.confirm
                            (
                                "발주 요청 알림을 보냈습니다.\n발주 관리 페이지로 이동하시겠습니까?",
                                {
                                    title: "발주 관리 이동",
                                    actions: ["예", "아니요"],
                                    emphasizedAction: "예",

                                    onClose: function(vMoveAction) //창 닫히면 발생하는 이벤트
                                    {
                                        // 두 번째 창에서 예를 눌렀을 때만 이동
                                        if(vMoveAction == "예")
                                        {
                                            oRouter.navTo //지정된 라우트로 이동하는 메서드
                                            ("PurchaseParam", 
                                                {
                                                    Storeid: ls_stock.Storeid,
                                                    Matnr: ls_stock.Matnr
                                                }
                                            );

                                             // 왼쪽 메뉴에서 발주 관리 선택
                                             oAppView.byId("sideNavigation").setSelectedKey("Purchase");
                                        }
                                    }
                                }
                            );
                            
                        }
                    }
                }
            );
        } 
        

    });
});