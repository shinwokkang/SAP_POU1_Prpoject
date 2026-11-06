sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";


    return Controller.extend("code2.fiori.pou.pou1project.controller.Menu", {
        onInit() {
            this.getRouter().getRoute("Menu");
            
            let oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "CSET");

            let CategorySet = [
                                {Category : "Coffee"},
                                {Category : "NonCoffee"},
                                {Category : "Ade"},
                                {Category : "Bakery"},
                                {Category : "Desert"}
                              ],
                oCategoryModel = new JSONModel(CategorySet);
            this.getView().setModel(oCategoryModel, "Category");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onSearch: function ()
        {
            let oBinding = this.getView().byId("IMenu").getBinding("rows"),
                oFilter  = null,
                aFilter = [],
                vMenuid = this.getView().byId("IInputMenuname").getValue(),
                vCategory = this.getView().byId("ICategory").getValue();

                if(vMenuid !="")
                {   
                    oFilter = new Filter({
                        path    : "Menuname",
                        operator: FilterOperator.Contains,
                        value1  : vMenuid
                    });

                    aFilter.push(oFilter);
                };

                

                if(vCategory !="")
                {   
                    oFilter = new Filter({
                        path    : "Category",
                        operator: FilterOperator.EQ,
                        value1  : vCategory
                    });

                    aFilter.push(oFilter);
                };


                oBinding.filter(aFilter);

        }
    });
});