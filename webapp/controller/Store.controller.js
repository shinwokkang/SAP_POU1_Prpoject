sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], (Controller, JSONModel, Filter, FilterOperator,MessageBox) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Store", {
        onInit() {
            this.getRouter().getRoute("Store");

            // let oStoreModel = new JSONModel("/data/Cafeset.json");
            // this.getView().setModel(oStoreModel, "Store")

            let RegionSet = [
                                {Region : "서울"},
                                {Region : "경기도"},
                                {Region : "강원도"},
                                {Region : "충청도"},
                                {Region : "경상도"},
                                {Region : "전라도"},
                                {Region : "제주도"}
                            ],
                oRegionModel = new JSONModel(RegionSet);
            this.getView().setModel(oRegionModel, "Region");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onStoreSearch : function()
        {
            let oBinding = this.getView().byId("StoreSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStorename = this.getView().byId("iStorename").getValue(),
                vRegion = this.getView().byId("iRegion").getValue();

            if(vStorename != "")
            {
                oFilter = new Filter({
                    path     : "Storename",
                    operator : FilterOperator.Contains,
                    value1 : vStorename
                });

                aFilter.push(oFilter);
            }; 

            

            if(vRegion != "")
            {
                oFilter = new Filter({
                    path     : "Region",
                    operator : FilterOperator.EQ,
                    value1 : vRegion
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);
        },
        onState : function(StateEvent)
        {
            let vButton = StateEvent.getSource(),
                vState  = vButton.getText();


            if (vState === "운영중")
                {
                    MessageBox.confirm("휴점 상태로 변경하시겠습니까? ",{
                            title : "운영 상태 변경",
                            actions : ["예", "아니오"],
                            emphasizedAction : "예",

                            onClose : function(Aclose)
                            {
                                if(Aclose === "예")
                                {
                                    vButton.setType("Reject") 
                                    vButton.setText("휴점중")
                                }
                            }
                        })
                }
            else
                {
                    MessageBox.confirm("운영 상태로 변경하시겠습니까? ",{
                            title : "운영 상태 변경",
                            actions : ["예", "아니오"],
                            emphasizedAction : "예",

                            onClose : function(Aclose)
                            {
                                if(Aclose === "예")
                                {
                                    vButton.setType("Accept") 
                                    vButton.setText("운영중")
                                }
                            }
                        
                        })
                };
        }
    });
});