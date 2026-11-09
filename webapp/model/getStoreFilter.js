sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Filter, FilterOperator) => {
    "use strict";

    return {

        /**
         * 지점 검색 필터를 생성하고 모델을 설정하는 유틸리티 함수 (검색 필터 로직을 따로 분리해서 재사용하기 위해 만든 것)
         * @param {sap.ui.core.mvc.View} oView - 현재 뷰 인스턴스
         * @param {Array} aFilter - 기존 필터 배열
         * @returns {Array} 생성된 필터가 추가된 배열 반환
         */

        addStoreFilter: 
        function (oView, aFilter) {
            // 1. 전달받은 필터 배열이 없을 경우 새로 초기화
            if (!aFilter) 
            {
                aFilter = [];
            }

            let oFilter      = null,
                vStorename   = oView.byId("IcomboStore").getSelectedKey(); // 전달받은 oView를 이용해 화면에 있는 지점 선택 컴포넌트를 찾아서 선택된 키 값 가져오기
            
            // 2. 지점이 선택된 경우(값이 비어있지 않다면) 필터 객체 생성 후 추가
            if (vStorename != "") 
            {
                oFilter = new Filter({                                                
                    path     : "Storeid",                // 필터링할 바인딩 데이터의 속성명
                    operator : FilterOperator.Contains,  // 포함 조건                           
                    value1   : vStorename                                          
                });

                aFilter.push(oFilter);
            };

            // 3. 완성된 필터 배열을 호출한 곳으로 반환
            return aFilter;
        }
    };
});