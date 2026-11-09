sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "code2/fiori/pou/pou1project/model/getStoreFilter"
], (Controller, JSONModel, Filter, FilterOperator, getStoreFilter) => {
    "use strict";


    return Controller.extend("code2.fiori.pou.pou1project.controller.Menu", {
        onInit() {
            // 라우터의 "Menu" 라우트 정보를 가져옴 (현재는 선언 및 초기화 용도)
            this.getRouter().getRoute("Menu");
            
            // 컴포넌트에 등록된 기본 모델(주로 OData 모델)을 가져와서 "CSET"이라는 이름으로 뷰에 설정
            let oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "CSET");
            
            // 카테고리 목록 데이터를 담고 있는 로컬 JSON 모델 생성 및 설정
            let CategorySet   = [
                                  {Category : "Coffee"},
                                  {Category : "NonCoffee"},
                                  {Category : "Ade"},
                                  {Category : "Bakery"},
                                  {Category : "Dessert"}
                                ],

                MenuStatusSet = [
                                  {Status: "판매대기"},
                                  {Status: "판매중"},
                                  {Status: "판매종료"}
                                ];

            this.getView().setModel(new JSONModel(CategorySet), "Category");
            this.getView().setModel(new JSONModel(MenuStatusSet),"MenuStaSet");
            this.getView().setModel(new JSONModel("/model/Store.json"),"StoreNameSet");
 
        },

        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        // function 03. 메뉴 검색 함수 (입력된 메뉴명과 선택된 카테고리 조건으로 메뉴 테이블 필터링)
        onSearch: function ()
        {
            let oBinding = this.getView().byId("IMenu").getBinding("rows"), // 메뉴 테이블 바인딩 정보 가져오기
                oFilter  = null,
                aFilter = [],
                vMenuid = this.getView().byId("IInputMenuname").getValue(), // 화면의 메뉴명 입력값 가져오기
                vCategory = this.getView().byId("ICategory").getValue(); // 화면의 카테고리 선택값 가져오기

            // 메뉴명이 입력된 경우: 부분 일치(Contains) 조건 필터 생성 후 배열에 추가
            if(vMenuid !="")
            {   
                oFilter = new Filter({
                    path    : "Menuname",
                    operator: FilterOperator.Contains,
                    value1  : vMenuid
                });

                aFilter.push(oFilter);
            };

            
            // 카테고리가 선택된 경우: 정확히 일치(EQ) 조건 필터 생성 후 배열에 추가
            if(vCategory !="")
            {   
                oFilter = new Filter({
                    path    : "Category",
                    operator: FilterOperator.EQ,
                    value1  : vCategory
                });

                aFilter.push(oFilter);
            };

            // 생성된 필터들을 메뉴 테이블 바인딩에 일괄 적용
            oBinding.filter(aFilter);

            // 총 메뉴 수 표시
            let iMenuCount = oBinding.getLength();
            this.getView().byId("TotalMenuQuantity").setText(iMenuCount);
            
        },

        onReset: function()
        {
            this.getView().byId("IInputMenuname").setSelectedKey("");

            this.getView().byId("ICategory").setSelectedKey("");

            var oBinding = this.getView().byId("IMenu").getBinding("rows");

            oBinding.filter([]);

            let iMenuCount = oBinding.getLength();
            this.getView().byId("TotalMenuQuantity").setText(iMenuCount);
        },

        onStatusColor: function(vStatus)
        {
            if(vStatus == "판매종료")
             {
                return "Warning";
             }
             else
              {
                return "Success";
              }
        }
    });
});