sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Main", {
        onInit() {
        },

        go_Dashboard:function(){
            this.getRouter().navTo("Dashboard");
        },
        go_Menu:function(){
            this.getRouter().navTo("Menu");
        },
        go_Purchase:function(){
            this.getRouter().navTo("Purchase");
        },
        go_Sales:function(){
            this.getRouter().navTo("Sales");
        },
        go_SalesAnalytics:function(){
            this.getRouter().navTo("SalesAnalytics");
        },
        go_Stock:function(){
            this.getRouter().navTo("Stock");
        },
        go_StockShortage:function(){
            this.getRouter().navTo("StockShortage");
        },
        go_Store:function(){
            this.getRouter().navTo("Store");
        },
        
        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
});