sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.App", {
        onInit: function () {
            // 1. 시계 전용 JSONModel 생성 및 뷰에 등록
            // var oClockModel = new JSONModel({
            //     currentTime: this._getCurrentTimeString()
            // });
            // this.getView().setModel(oClockModel, "clock");

            // // 2. 1초마다 시간 갱신
            // this._timerId = setInterval(function () {
            //     oClockModel.setProperty("/currentTime", this._getCurrentTimeString());
            // }.bind(this), 1000);
        },

        // 사이드바 메뉴 클릭 시 화면 라우팅
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey(); // 예: "Dashboard", "Store", "Menu" 등

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo(sKey);
        },

        // 사이드바 접기/펼치기 토글
        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        },
        // 현재 시간을 'YYYY-MM-DD HH:mm:ss' 형태로 포맷팅하는 헬퍼 함수
        _getCurrentTimeString: function () {
            var now = new Date();
            var year = now.getFullYear();
            var month = String(now.getMonth() + 1).padStart(2, "0");
            var date = String(now.getDate()).padStart(2, "0");
            var hours = String(now.getHours()).padStart(2, "0");
            var minutes = String(now.getMinutes()).padStart(2, "0");
            var seconds = String(now.getSeconds()).padStart(2, "0");

            return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        },

        // 3. 컨트롤러 소멸 시 인터벌 해제 (메모리 누수 방지 필수)
        onExit: function () {
            if (this._timerId) 
                clearInterval(this._timerId);
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        },

        onUserPress: function () {
            // 1) Data.json 데이터 꺼내기
            let oData = this.getOwnerComponent().getModel().oData;

            // 2) Status별로 개수 세기
            let lv_shortage = 0,
                lv_request = 0,
                lv_closed = 0;

            for (const ls_stock of oData.StockSet) {
                if (ls_stock.Status === "부족") {
                    lv_shortage++;
                }
            }

            for (const ls_po of oData.PurchaseSet) {
                if (ls_po.Status === "발주요청") {
                    lv_request++;
                }
            }

            for (const ls_store of oData.StoreSet) {
                if (ls_store.Status === "휴점중") {
                    lv_closed++;
                }
            }

            // 3) 알림창에 보여줄 글자
            let lv_text = "본사 운영팀 · 관리자\n\n" +
                "[금일 요약본]\n" +
                "· 재고 부족 : " + lv_shortage + "건\n" +
                "· 발주 요청 : " + lv_request + "건\n" +
                "· 휴점 지점 : " + lv_closed + "곳";

            // 4) 알림창 띄우기
            sap.m.MessageBox.information(lv_text, {
                title: "본사관리자"
            });
        },

        // MenuButton
        onUserMenuSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item"),     // 누른 메뉴 항목
                sKey = oItem.getKey();                  // 예: "StockShortage"

            this.getOwnerComponent().getRouter().navTo(sKey);   // 화면 이동
            this.byId("sideNavigation").setSelectedKey(sKey);   // 왼쪽 메뉴 선택 표시도 맞춤
        }


    });
});