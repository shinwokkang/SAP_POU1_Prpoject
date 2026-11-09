sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Dashboard", {
        onInit() {

            let oModel = this.getOwnerComponent().getModel();

            oModel.attachRequestCompleted(function () {
                this.Button();
            }, this);

            if (oModel.getProperty("/SalesSet")) {
                this.Button();
            }


            this.onSales();
            this.SaleSet();
            this.OrderSet();


        },
        //  대시보드 상단 글자 함수

        onSales: function () {
            let oModel = this.getOwnerComponent().getModel();
            let aSales = oModel.getProperty("/SalesSummarySet");
            let total = 0;

            for (let i = 0; i < aSales.length; i++) {
                total = total + parseInt(aSales[i].Salesamt);
            }

            this.byId("totalSales").setText("₩ " + parseInt(total).toLocaleString());

        },


        SaleSet: function () {

            let oModel = this.getOwnerComponent().getModel();
            let aMenu = oModel.getProperty("/MenuSet");
            let topMenu = aMenu[0];

            for (let i = 1; i < aMenu.length; i++) {
                if (aMenu[i].Soldqty > topMenu.Soldqty) { topMenu = aMenu[i]; }

            }
            this.byId("SaleSet").setText(topMenu.Menuname);
        },

        OrderSet: function () {
            let oModel = this.getOwnerComponent().getModel();
            let aOrder = oModel.getProperty("/StockSet");
            if (aOrder) {
                let count = 0;

                for (let i = 0; i < aOrder.length; i++) {
                    count++;
                }

                this.byId("orderCount").setText(count + "건");

            }

        },


        onStore: function () {
            let oRootView = this.getOwnerComponent().getRootControl(),
                oSideNav = oRootView.byId("sideNavigation");

            oSideNav.setSelectedKey("Store")

            this.getOwnerComponent().getRouter().navTo("StoreFilter");

        },

        onStoreCount: function () {
            let oModel = this.getOwnerComponent().getModel();
            let Store = oModel.getProperty("/StoreSet");
            let count = 0;

            for (let i = 0; i < Store.length; i++) {
                if (Store[i].Status === "운영중") {
                    count++;
                }

            }

            this.byId("storeCount").setText(count + "개점");
        },
        // 달력 날짜 함수
        Button: function () {

            let start = this.byId("calender2").getValue();
            let end = this.byId("calender1").getValue();

            let oModel = this.getOwnerComponent().getModel();
            let sales = oModel.getProperty("/SalesSet") || [];

            let bar = [];
            let donut = [];

            for (let s of sales) {

                if (s.Salesdate < start || s.Salesdate > end) {
                    continue;
                }

                let b = bar.find(x => x.Storename === s.Storename);
                let d = donut.find(x => x.Menuname === s.Menuname);

                if (b) {
                    b.Salesamt += Number(s.Amount);
                } else {
                    bar.push({
                        Storename: s.Storename,
                        Salesamt: Number(s.Amount)
                    });
                }

                if (d) {
                    d.Soldqty += Number(s.Quantity);
                } else {
                    donut.push({
                        Menuname: s.Menuname,
                        Soldqty: Number(s.Quantity)
                    });
                }
            }

            oModel.setProperty("/FilteredSalesSet", bar);
            oModel.setProperty("/FilteredMenuSet", donut);
        },












    });
});