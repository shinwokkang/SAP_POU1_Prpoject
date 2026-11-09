sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Dashboard", {
        onInit() {


            this.onSales();
            this.SaleSet();
            this.OrderSet();
            this.onStore();

        },

        onStore() {
            this.getOwnerComponent().getRouter().navTo("StoreFilter");
        },
        onSales: function () {
            let oModel = this.getOwnerComponent().getModel();
            let aSales = oModel.getProperty("/SalesSummarySet");
            let total = 0;

            for (let i = 0; i < aSales.length; i++) {
                total = total + parseInt(aSales[i].Salesamt);
            }

            this.getView().byId("totalSales").setText("₩ " + total);

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
        Button: function () {

            let start = this.byId("calendar2").getValue();
            let end = this.byId("calendar1").getValue();

            let oModel = this.getOwnerComponent().getModel();
            let aSales = oModel.getProperty("/SalesHistorySet") || [];
            let aResult = [];

            for (let i = 0; i < aSales.length; i++) {

                if (aSales[i].Date >= start && aSales[i].Date <= end) {
                    aResult.push(aSales[i]);
                }

            }

            oModel.setProperty("/FilteredSalesSet", aResult);

        },








    });
});