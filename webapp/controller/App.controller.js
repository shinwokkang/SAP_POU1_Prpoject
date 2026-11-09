sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.App", {
        onInit: function () {
            // 초기화
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


    });
});