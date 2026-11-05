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

            this.getView().setModel(new JSONModel("/data/CafeSet.json"),"Sales");
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
onSearch: function ()
        {
            let oBinding = this.getView().byId("Sales").getBinding("rows"),
            // 가져올데이터가 테이블의 로우즈에 넣었기때문에 rows를 넣지만 디폴드값도 rows라서 안써도 괜춘
                oFilter  = null,
                aFilter = [], //어레이라서 a릏 넣음 new Filter가 덮어써지지 않도록 배열을 만듬
                vDate = this.getView().byId("IDate").getValue(), //검색창에 입력값을 가져옴
                vStorename = this.getView().byId("IStorename").getValue(),
                vMenuname = this.getView().byId("IMenuname").getValue();

                if(vDate !="")
                {   
                    oFilter = new Filter({
                        path    : "Salesdate", // 검색할 데이터의 키값
                        operator: FilterOperator.Contains,
                        value1  : vDate // 키에서 어떤 값을 필터를 할지..?
                    });

                    aFilter.push(oFilter); // 위에서 만든 배열에 추가할려면 .push를 해야함, 필터 안에 들어가야함
                };

                

                if(vStorename !="")
                {   
                    oFilter = new Filter({
                        path    : "Storename", // 검색할 데이터의 키값
                        operator: FilterOperator.Contains,
                        value1  : vStorename // 키에서 어떤 값을 필터를 할지..?
                    });

                    aFilter.push(oFilter); // 만든 필터를 배열에 넣어줌
                };


                if(vMenuname!="")
                {   
                    oFilter = new Filter({
                        path    : "Menuname", // 검색할 데이터의 키값
                        operator: FilterOperator.Contains,
                        value1  : vMenuname // 키에서 어떤 값을 필터를 할지..?
                    });

                    aFilter.push(oFilter); // 만든 필터를 배열에 넣어줌
                };

                oBinding.filter(aFilter); // 필터가 들어간 배열을 넣어줌

        }
    });
});