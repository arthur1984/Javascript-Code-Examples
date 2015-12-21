app.factory('serviceOrderService', function ($http) {
    return {

        GetServiceOrder: function (workTaskId) {

            return $http.post("/ServiceOrder/LoadServiceOrder", {
                workTaskId: workTaskId
            });
        },
        AddSreviceOrder: function (workTaskId, data) {

            return $http.post("/ServiceOrder/Create", {
                serviceOrderViewModel: data
            });
        }
    } //return exposed APIs
});