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
            let aStoreList = [

                                {Store: "성수점"},
                                {Store: "강남점"},
                                {Store: "수원점"},
                                {Store: "성남점"},
                                {Store: "춘천점"},
                                {Store: "대전점"},
                                {Store: "전주점"},
                                {Store: "대구점"},
                                {Store: "부산점"},
                                {Store: "제주점"}
                            
                             ],
                oStoreModel = new JSONModel(aStoreList);
            this.getView().setModel(oStoreModel, "StoreList");

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



        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onSearch: function ()
        {   
            //조건검색필터
            let oBinding = this.getView().byId("Sales").getBinding("rows"),
            
                oFilter  = null,
                aFilter = [], 
                vDate = this.getView().byId("IDate").getValue(), 
                vStartDate = "",
                vEndDate = "",
                vStorename = this.getView().byId("IStorename").getValue(),
                vMenuname = this.getView().byId("IMenuname").getValue();

                //날짜 검색
                if(vDate != "")
                {
                    if(vDate.length > 10 )
                    {
                        vStartDate = vDate.slice(0,10);
                        vEndDate   = vDate.slice(13,23);

                        oFilter = new Filter({
                        path    : "Salesdate", 
                        operator: FilterOperator.BT,
                        value1: vStartDate,
                        value2: vEndDate
                        });

                        aFilter.push(oFilter); 
                    }
                    else
                    {
                        vStartDate = vDate.slice(0,10);

                        oFilter = new Filter({
                        path    : "Salesdate", 
                        operator: FilterOperator.EQ,
                        value1: vStartDate,
                        });

                        aFilter.push(oFilter); 
                    }
                }

                
                if(vStorename !="") //지점검색
                {   
                    oFilter = new Filter({
                        path    : "Storename", 
                        operator: FilterOperator.EQ,
                        value1  : vStorename 
                    });

                    aFilter.push(oFilter); 
                };


                if(vMenuname!="") //메뉴검색
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

                    if (vDate != "")
                    {
                        if (vDate.length > 10)
                        {
                            if ( vRow.Salesdate <= vStartDate || vRow.Salesdate >= vEndDate)
                                continue;
                        }
                        else
                        {
                            if (vRow.Salesdate != vStartDate)
                                continue;
                        }
                    }

                    iTotalQuantity += parseInt(vRow.Quantity);
                    iTotalAmount += parseInt(vRow.Amount);
                }    

            this.getView().byId("TotalQuantity").setText(iTotalQuantity);
            this.getView().byId("TotalAmount").setValue(iTotalAmount);
                
        }
    });
});