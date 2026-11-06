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
        }
    });
});