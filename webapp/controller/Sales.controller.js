sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Sales", {
        onInit() {
            this.getRouter().getRoute("Sales");

            this.getView().setModel(new JSONModel("/data/CafeSet.json"),"CSET");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onSearch: function ()
        {
            let oBinding = this.getView().byId("Sales").getBinding("rows"),
            
                oFilter  = null,
                aFilter = [], 
                vDate = this.getView().byId("IDate").getValue(), 
                vStorename = this.getView().byId("IStorename").getValue(),
                vMenuname = this.getView().byId("IMenuname").getValue();

                if(vDate !="")
                {   
                    oFilter = new Filter({
                        path    : "Salesdate", 
                        operator: FilterOperator.Contains,
                        value1  : vDate 
                    });

                    aFilter.push(oFilter); 
                };

                

                if(vStorename !="")
                {   
                    oFilter = new Filter({
                        path    : "Storename", 
                        operator: FilterOperator.Contains,
                        value1  : vStorename 
                    });

                    aFilter.push(oFilter); 
                };


                if(vMenuname!="")
                {   
                    oFilter = new Filter({
                        path    : "Menuname", 
                        operator: FilterOperator.Contains,
                        value1  : vMenuname 
                    });

                    aFilter.push(oFilter); 
                };

                oBinding.filter(aFilter); 
                //주석

        }
    });
});