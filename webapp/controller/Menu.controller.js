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

            // 원자재 목록 데이터 정의 (원두, 우유 등)
            let oData2= {
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
            // 상태 목록 데이터 정의 (발주완료, 발주요청, 입고완료)
            let StatusSet= [
                            {Status: "발주완료"},
                            {Status: "발주요청"},
                            {Status: "입고완료"}
                           ]
                        
            // 각각의 데이터를 JSON 모델로 생성하여 뷰에 바인딩 (MSET, StaSet)
            this.getView().setModel(new JSONModel(oData2),"MSET");
            this.getView().setModel(new JSONModel(StatusSet),"StaSet");
            this.getView().setModel(new JSONModel("/model/Store.json"),"StoreNameSet");
 
        },

        // function 01. 지점 조회용 함수 (외부 유틸리티 모듈 FSearchStore 활용)
        searchFilter: function()
        {
            // 지점 테이블("IFSearchStoreTable")의 바인딩(행 데이터)과 필터 배열 초기화
            let oBinding = this.getView().byId("IFSearchStoreTable").getBinding("rows"),
                aFilter = [];

            // 외부 모듈(FSearchStore)의 함수를 호출하여 필터 조건들을 aFilter에 추가
            // this.getView() : 현재 화면(View)의 정보. 화면에 있는 입력창 컴포넌트들을 찾아내기 위함
            // aFilter : 현재 만들어져 있는 필터들의 목록(배열).
            aFilter = getStoreFilter.addStoreFilter(this.getView(), aFilter);

            // 완성된 필터를 테이블 바인딩에 적용하여 화면 갱신
            oBinding.filter(aFilter);
        },

        // function 02. 라우터 객체를 쉽게 가져오기 위한 공통 헬퍼 함수
        getRouter:function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        // function 03. 메뉴 검색 함수 (입력된 메뉴명과 선택된 카테고리 조건으로 메뉴 테이블 필터링)
        onSearch: function ()
        {
            let oBinding = this.getView().byId("IMenu").getBinding("rows"), // 메뉴 테이블 바인딩 정보 가져오기
                vMenuCount = this.getView().getModel("oMenuCount"),
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
            vMenuCount = aFilter.length;
        },

        onReset: function()
        {
            this.getView().byId("IInputMenuname").setSelectedKey("");

            this.getView().byId("ICategory").setSelectedKey("");

            var oBinding = this.getView().byId("IMenu").getBinding("rows");

            oBinding.filter([]);
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