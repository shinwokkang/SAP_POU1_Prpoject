sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "code2/fiori/pou/pou1project/model/FSearchStore"
], (Controller, JSONModel, Filter, FilterOperator, FSearchStore) => {
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

            
            let oData = {
                            StoreNameSet :
                            [
                                {Strcd: "S001", Store : "성수점"},
                                {Strcd: "S002", Store : "강남점"},
                                {Strcd: "S003", Store : "수원점"},
                                {Strcd: "S004", Store : "성남점"},
                                {Strcd: "S005", Store : "춘천점"},
                                {Strcd: "S006", Store : "대전점"},
                                {Strcd: "S007", Store : "전주점"},
                                {Strcd: "S008", Store : "대구점"},
                                {Strcd: "S009", Store : "부산점"},
                                {Strcd: "S010", Store : "제주점"}
                            ]
                        },

                oData2= {
                            MaterialSet: 
                            [
                                {Matnr: "R001", Matname: "원두"},
                                {Matnr: "R002", Matname: "우유"},
                                {Matnr: "R003", Matname: "말차가루"},
                                {Matnr: "R004", Matname: "초코파우더"},
                                {Matnr: "R005", Matname: "밀가루"},
                                {Matnr: "R006", Matname: "버터"}
                            ]
                        };

            let StatusSet= [
                            {Status: "발주완료"},
                            {Status: "발주요청"},
                            {Status: "입고완료"}
                           ]
                        

            this.getView().setModel(new JSONModel(oData), "StoSet");
            this.getView().setModel(new JSONModel(oData2),"MSET");
            this.getView().setModel(new JSONModel(StatusSet),"StaSet");
        },

// < 지점 조회용 함수: searchPurchase />
        searchPurchase: function()
        {
            let oBinding = this.getView().byId("fpurchaseTable").getBinding("rows"),
                aFilter = []; 

            aFilter = FSearchStore.executePurchaseLogic(this.getView(), aFilter);

            oBinding.filter(aFilter);
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