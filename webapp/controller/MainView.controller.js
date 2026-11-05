sap.ui.define([
     "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.StoreView", {
        onInit() 
        {
            let oStoreModel = new JSONModel("/data/Cafeset.json");
            this.getView().setModel(oStoreModel, "Store")
        }
    });
});