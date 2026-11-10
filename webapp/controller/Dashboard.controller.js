sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller,) => {
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
            let oModel = this.getOwnerComponent().getModel(),
                aSales = oModel.getProperty("/SalesSummarySet"),
                total = 0;

            for (let i = 0; i < aSales.length; i++) {
                total = total + parseInt(aSales[i].Salesamt);
            }

            this.byId("totalSales").setText("₩ " + total.toLocaleString());

        },


        SaleSet: function () {

            let oModel = this.getOwnerComponent().getModel(),
                aMenu = oModel.getProperty("/MenuSet"),
                topMenu = aMenu[0];

            for (let i = 1; i < aMenu.length; i++) {
                if (aMenu[i].Soldqty > topMenu.Soldqty) { topMenu = aMenu[i]; }

            }
            this.byId("SaleSet").setText(topMenu.Menuname);
        },

        OrderSet: function () {
            let oModel = this.getOwnerComponent().getModel(),
                aOrder = oModel.getProperty("/StockSet");
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
            let oModel = this.getOwnerComponent().getModel(),
                Store = oModel.getProperty("/StoreSet"),
                count = 0;

            for (let i = 0; i < Store.length; i++) {
                if (Store[i].Status === "운영중") {
                    count++;
                }

            }

            this.byId("storeCount").setText(count + "개점");
        },
        // 달력 날짜 함수
        Button: function () {

            let start = this.byId("calender2").getValue(),
                end = this.byId("calender1").getValue(),

                oModel = this.getOwnerComponent().getModel(),
                sales = oModel.getProperty("/SalesSet") || [],

                bar = [],
                donut = [];

            for (let s of sales) {

                if (s.Salesdate < start || s.Salesdate > end) {
                    continue;
                }

                let b = bar.find(x => x.Storename === s.Storename),
                    d = donut.find(x => x.Menuname === s.Menuname);

                if (b) {
                    b.Salesamt += parseInt(s.Amount);
                } else {
                    bar.push({
                        Storename: s.Storename,
                        Salesamt: parseInt(s.Amount)
                    });
                }

                if (d) {
                    d.Soldqty += parseInt(s.Quantity);
                } else {
                    donut.push({
                        Menuname: s.Menuname,
                        Soldqty: parseInt(s.Quantity)
                    });
                }
            }

            oModel.setProperty("/FilteredSalesSet", bar);
            oModel.setProperty("/FilteredMenuSet", donut);
        },












    });
});