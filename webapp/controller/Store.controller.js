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

            // DashBoard에서 Store로 넘어오는 라우트, Dashboard에 Link된 함수로 연결되는 라우트 구분
            let oRoute = this.getRouter()
            oRoute.getRoute("Store").attachPatternMatched(this.onRouteMatch, this); // Dashboard에서 그냥 Store로 넘어옴
            oRoute.getRoute("StoreFilter").attachPatternMatched(this.onRouteMatch, this); // Dashboard에 Link되어있는 함수를 통해 넘어옴

            // RegionSet 데이터의 개수가 적고, 변하지 않는 값이라 json데이터 그냥 입력
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

            // Status의 종류가 2가지 밖에 없어서 json데이터 그냥 입력
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
            let vRoute = oRoute.getParameter("name"), // 들어온 Route 이름 가져옴
                oStatusCombo = this.getView().byId("iStatus") // 운영 상태 ComboBox에 있는 값 가져옴
            
            if (vRoute === "StoreFilter") // 만약 StoreFilter(Dashboard 링크 거쳐서 넘어온 경우)
            {
                oStatusCombo.setSelectedKey("운영중"); // Combobox 값 운영중으로 미리 선택
            }
            else
            {   
                // 그게 아니면 다 값 아무것도 안 받을 수 있도록 (다른 라우트를 연결해서 들어오면 다 빈값을 받을 수 있도록)
                this.getView().byId("iStorename").setValue("");
                this.getView().byId("iRegion").setSelectedKey("");
                oStatusCombo.setSelectedKey("");
            }
            
            this.onStoreSearch(); // 바로 필터링 함수 연결되서 필터값만 볼 수 있게
        },

        onStoreSearch : function() 
        {
            // 입력된 조건(지점명/지역/운영상태)으로 테이블 필터링
            let oBinding = this.getView().byId("StoreSet").getBinding("rows"),
                oFilter = null,
                aFilter = [],
                vStorename = this.getView().byId("iStorename").getValue(),
                vRegion = this.getView().byId("iRegion").getSelectedKey(),
                vDStatus = this.getView().byId("iStatus").getSelectedKey();
                
            if (!oBinding) { return; } // 필터 작동할 때까지 표가 바인딩 안되면 함수종류 (오류 줄일려고 안전장치)

            // Storename지점명 Contain 필터링
            if(vStorename != "")
            {
                oFilter = new Filter({
                    path     : "Storename",
                    operator : FilterOperator.Contains,
                    value1 : vStorename
                });

                aFilter.push(oFilter);
            }; 

            // Region 지역 EQ 필터링
            if(vRegion != "")
            {
                oFilter = new Filter({
                    path     : "Region",
                    operator : FilterOperator.EQ,
                    value1 : vRegion
                });

                aFilter.push(oFilter);
            };

            // Status 운영상태 EQ 필터링
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


            if (vStatus === "운영중") // 버튼에 있는 Text가 운영중인 버튼을 클릭하면
                {
                    //messageBox부터 띄워서 바꿀껀지 한번 확인
                    MessageBox.confirm("휴점 상태로 변경하시겠습니까? ",{
                        title : "운영 상태 변경",
                        actions : ["예", "아니오"],
                        emphasizedAction : "예", // 버튼 색 (예 : 파랑 강조)

                        onClose : function(Aclose)
                        {
                            if(Aclose === "예") // 예 버튼을 누르면 
                            {
                                // 값들이 바뀜
                                vButton.setType("Reject") 
                                vButton.setText("휴점중")
                            } // 예를 누르지 않으면 아무것도 이뤄지지 않음 
                        }
                    })
                }
            else // 휴점중 버튼 누르면
                {
                    //messageBox부터 띄워서 바꿀껀지 한번 확인
                    MessageBox.confirm("운영 상태로 변경하시겠습니까? ",{
                        title : "운영 상태 변경",
                        actions : ["예", "아니오"],
                        emphasizedAction : "예",

                        onClose : function(Aclose)
                        {
                            if(Aclose === "예") // 예 버튼을 누르면 
                            {
                                // 값들이 바뀜
                                vButton.setType("Accept") 
                                vButton.setText("운영중")
                            } // 예를 누르지 않으면 아무것도 이뤄지지 않음 
                        }
                    })
                }
        },
        onReset : function()
        {
            // Reset 함수 : 모든 값 비워서 받기
            this.getView().byId("iStorename").setValue("");
            this.getView().byId("iRegion").setSelectedKey("");
            this.getView().byId("iStatus").setSelectedKey("");

            // 빈 값으로 기존 필터 해제
            let oBinding = this.getView().byId("StoreSet").getBinding("rows");
            oBinding.filter([]);
        }
    });
});