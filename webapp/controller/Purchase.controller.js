sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Purchase", {
        onInit() {
            this.getRouter().getRoute("Purchase");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
});