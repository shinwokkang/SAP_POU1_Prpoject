sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("code2.fiori.pou.pou1project.controller.Sales", {
        onInit() {

            //지점콤보박스
            this.getView().setModel(new JSONModel("/model/Store.json"), "StoreNameSet");


            //메뉴콤보박스
            let aMenuList = [

                                {Menu: "아메리카노"},
                                {Menu: "카페라떼"},
                                {Menu: "말차라떼"},
                                {Menu: "초코라떼"},
                                {Menu: "바닐라라떼"},
                                {Menu: "카푸치노"},
                                {Menu: "레몬에이드"},
                                {Menu: "자몽에이드"},
                                {Menu: "소금빵"},
                                {Menu: "휘낭시에"},
                                {Menu: "크루아상"},
                                {Menu: "치즈케이크"}                                
                            
                             ],
                oMenuModel = new JSONModel(aMenuList);
            this.getView().setModel(oMenuModel, "MenuList");

            this.getRouter().getRoute("SalesParam").attachPatternMatched(this.onShowParam, this);
            
            // 초기화면 
            this.getView().attachModelContextChange(function () {

                let oModel = this.getView().getModel();

                if (oModel && oModel.oData.SalesSet) {
                    this.onTotal();
                }

            }.bind(this));

        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        // 매출 분석(9번)에서 넘어왔을 때 : 전달받은 조건을 넣고 자동 조회
        onShowParam: function (oEvent)
        {
            // URL 매개변수 받기
            let vStoreid   = oEvent.getParameters().arguments.Storeid,   // "S001" 또는 "ALL"
                vFrom      = oEvent.getParameters().arguments.From,      // "2026-10-30" 또는 "ALL"
                vTo        = oEvent.getParameters().arguments.To,        // "2026-11-03" 또는 "ALL"
                aSummary   = this.getView().getModel().oData.SalesSummarySet,
                vStorename = "";

            // 지점 ID(S001) → 지점명(성수점) 찾기 (이 화면은 지점명으로 조회함)
            if(vStoreid != "ALL" && aSummary != undefined)
            {
                for(let ls_store of aSummary)
                {
                    if(ls_store.Storeid == vStoreid)
                    {
                        vStorename = ls_store.Storename;
                    }
                }
            }

            // "ALL"은 조건 없음 → 빈 값으로
            if(vFrom == "ALL")
            {
                vFrom = "";
            }

            if(vTo == "ALL")
            {
                vTo = "";
            }

            // 전달받은 값을 검색 칸에 넣기
            this.getView().byId("IStartDate").setValue(vFrom);
            this.getView().byId("IEndDate").setValue(vTo);
            this.getView().byId("IStorename").setSelectedKey(vStorename);
            this.getView().byId("IStorename").setValue(vStorename);
            this.getView().byId("IMenuname").setSelectedKey("");

            // 기존 조회 버튼 기능 그대로 실행 (테이블 필터 + 총 판매량, 총 매출금액)
            this.onSearch();
        },


        onSearch: function ()
        {   

            //조건검색필터
            let oBinding = this.getView().byId("Sales").getBinding("rows"),
            
                oFilter  = null,
                aFilter = [], 
                vStartDate = this.getView().byId("IStartDate").getValue(),
                vEndDate = this.getView().byId("IEndDate").getValue(),
                vStorename = this.getView().byId("IStorename").getValue(),
                vMenuname = this.getView().byId("IMenuname").getValue();

                //날짜 검색
                if (vStartDate != "" && vEndDate != "")
                {
                    oFilter = new Filter({
                        path: "Salesdate",
                        operator: FilterOperator.BT,
                        value1: vStartDate,
                        value2: vEndDate
                    });
                        aFilter.push(oFilter);
                }
                else if (vStartDate != "")
                {
                    oFilter = new Filter({
                        path: "Salesdate",
                        operator: FilterOperator.GE,
                        value1: vStartDate
                    });

                    aFilter.push(oFilter);
                }
                else if (vEndDate != "")
                {
                    oFilter = new Filter({
                        path: "Salesdate",
                        operator: FilterOperator.LE,
                        value1: vEndDate
                    });

                    aFilter.push(oFilter);
                }
       
                //지점검색
                if(vStorename !="") 
                {   
                    oFilter = new Filter({
                        path    : "Storename", 
                        operator: FilterOperator.EQ,
                        value1  : vStorename 
                    });

                    aFilter.push(oFilter); 
                };

                //메뉴검색
                if(vMenuname!="") 
                {   
                    oFilter = new Filter({
                        path    : "Menuname", 
                        operator: FilterOperator.EQ,
                        value1  : vMenuname 
                    });

                    aFilter.push(oFilter); 
                };

                oBinding.filter(aFilter); 

                // 날짜, 지점, 메뉴 별 총 판매량, 총 매출금액
                let oTotalModel = this.getView().getModel();
                let aData = oTotalModel.oData.SalesSet;
                let iTotalQuantity = 0,
                    iTotalAmount = 0;

                for(let vRow of aData)
                {
                    if (vStorename != "") 
                    {
                        if (vRow.Storename != vStorename)
                            continue;
                    }

                    if (vMenuname != "")
                    {
                        if (vRow.Menuname != vMenuname)
                            continue;
                    }

                    if (vStartDate != "")
                    {
                        if (vRow.Salesdate < vStartDate)
                            continue;
                    }

                    if (vEndDate != "")
                    {
                        if (vRow.Salesdate > vEndDate)
                            continue;
                    }

                    iTotalQuantity += parseInt(vRow.Quantity);
                    iTotalAmount += parseInt(vRow.Amount);
                }    

            this.getView().byId("TotalQuantity").setText(iTotalQuantity);
            this.getView().byId("TotalAmount").setValue(iTotalAmount);
                
        },
        onTotal: function() //필터 초기화->전체 매출조회
        {
            //검색 조건 초기화
            this.getView().byId("IStartDate").setValue("");
            this.getView().byId("IEndDate").setValue("");
            this.getView().byId("IStorename").setSelectedKey("");
            this.getView().byId("IMenuname").setSelectedKey("");

            let oBinding = this.getView().byId("Sales").getBinding("rows");

            oBinding.filter([]);

            let aData = this.getView().getModel().oData.SalesSet,

                iTotalQuantity = 0,
                iTotalAmount = 0;

            for (let vRow of aData)
            {
                iTotalQuantity += parseInt(vRow.Quantity) || 0;
                iTotalAmount += parseInt(vRow.Amount) || 0;
            }

            this.getView().byId("TotalQuantity").setText(iTotalQuantity);
            this.getView().byId("TotalAmount").setValue(iTotalAmount);

        }
    });
});