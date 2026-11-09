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
            let oRoute = this.getRouter()
            oRoute.getRoute("Store").attachPatternMatched(this.onRouteMatch, this);
            oRoute.getRoute("StoreFilter").attachPatternMatched(this.onRouteMatch, this);

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

            let StatusSet = [
                                {Status : "운영중"},
                                {Status : "휴점중"}
                            ],
                oStatusModel = new JSONModel(StatusSet);
            this.getView().setModel(oStatusModel, "Status");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onRouteMatch : function(oRoute)
        {
            let vRoute = oRoute.getParameter("name"),
                oCombodata = this.getView().byId("iStatus")
            
            if (vRoute === "StoreFilter")
            {
                oCombodata.setSelectedKey("운영중");
            }
            else
            {
                this.getView().byId("iStorename").setValue("");
                this.getView().byId("iRegion").setSelectedKey("");
                oCombodata.setSelectedKey("");
            }
            
            this.onStoreSearch();
        },

        onStoreSearch : function()
        {
            let oBinding = this.getView().byId("StoreSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStorename = this.getView().byId("iStorename").getValue(),
                vRegion = this.getView().byId("iRegion").getSelectedKey(),
                vDStatus = this.getView().byId("iStatus").getSelectedKey();
                
            if (!oBinding) { return; }
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

            if(vDStatus != "")
            {
                oFilter = new Filter({
                    path     : "Status",
                    operator : FilterOperator.EQ,
                    value1 : vDStatus
                });

                aFilter.push(oFilter);
            };

            oBinding.filter(aFilter);
        },
        onStatus : function(StatusEvent)
        {
            let vButton = StatusEvent.getSource(),
                vStatus  = vButton.getText();


            if (vStatus === "운영중")
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