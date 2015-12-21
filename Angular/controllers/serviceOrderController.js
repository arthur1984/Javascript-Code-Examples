app.controller('serviceOrderController', ['$scope', '$filter', '$timeout','$http', 'serviceOrderService', function ($scope, $filter, $timeout,$http, serviceOrderService)
{
    //task id
    $scope.taskId = -1;

    $scope.Company = new Object();
    $scope.Company.Name = "";
    $scope.Company.Address = "";
    $scope.Company.CompanyLogoUrl = "";

    $scope.serviceOrderDate;
    $scope.serviceOrderNumber = "";
    $scope.serviceOrderState = "";
    $scope.serviceOrderStateId;
    $scope.serviceOrderNotes = "";

    $scope.billingAddress;;
    $scope.shippingAddress;

    
    $scope.selectedLogs = [];
    $scope.selectedLogIds = [];
    $scope.availableLogs = [];

    $scope.taskCheckLists = [];
    $scope.selectedTaskCheckLists = [1];

    $scope.taskNotes = [];
    $scope.selectedTaskNotes = [];

    /* Load data*/
    $scope.init = function (taskId) {
        $scope.loadServiceOrderData(taskId);
    };



    $scope.openPopup = function () {

        $.prompt("Any Unsaved Task Information will be saved if you continue"
            , {
                buttons: { "Ok": true, "Cancel": false },
                defaultButton: 2,
                classes: {
                    button: "green_admin_button jqitrialoffer"
                },
                submit: function (e, v, m, f) {
                    if (v) {
                        $('#openedModalServiceOrder').click();;

                    }
                }
            });
    };
    // Save order 
    $scope.saveOrder = function () {

        // Data validation
        var errorMsg = $scope.validateData();

        if (errorMsg !== "") {
            $.prompt(errorMsg);
            return;
        }

        /* Create and save service order */
        var data = new Object();

        data.ServiceOrderNumber = $scope.serviceOrderNumber;

        data.ServiceDate = moment($scope.serviceOrderDate, "DD.MM.YYYY").toDate();
        data.OrderStateId = $scope.serviceOrderStateId;
        data.Notes = $scope.serviceOrderNotes;

        data.BillTo = $scope.billingAddress;
        data.ShipTo = $scope.shippingAddress;

        data.WorkTaskListItemIds = $scope.selectedTaskCheckLists;
        data.WorkTaskNoteIds = $scope.selectedTaskNotes;
        data.WorkTaskLogIds = $scope.selectedLogIds;
        data.WorkTaskId = $scope.taskId;
        data.Footer = $scope.Footer;

        console.log(data);

        serviceOrderService.AddSreviceOrder($scope.taskId, data).success(function (data) {
            if (data.Response == 200) {
                $.prompt("Service order successfully saved.");
            } else {
                //error on server side
                $.prompt(data.Content);
            }
        }).error(function (data) {
            //unexpected error
            $.prompt("Unexpected error in saving service order procedure! Please contact administrator!");
        });;
    };

    // Data validation
    $scope.validateData = function () {
        var errorMessage = "";

        isValid = $('#serviceOrderNumber').parsley().isValid();
        if (!isValid) {
            errorMessage += "Service order number is required.<br/>"
        }
        isValid = $('#serviceOrderDate').parsley().isValid();
        if (!isValid) {
            errorMessage += "Service order date is required.<br/>"
        }
        isValid = $('#serviceState option:selected').val() != "? object:null ?";
        if (!isValid) {
            errorMessage += "Service order state is required.<br/>"
        }
        isValid = $('#billingAddress').parsley().isValid();
        if (!isValid) {
            errorMessage += "Billing address is required.<br/>"
        }

        return errorMessage;
    };

    $scope.loadServiceOrderData = function (taskId) {

        $scope.taskId = taskId;

        //Rest API call for loading SO data
        serviceOrderService.GetServiceOrder(taskId).success(function (data) {

            if (data.Response == 200) {
                //success
                console.log(data);
                $scope.Company.Name = data.Content.Company.Name;
                $scope.Company.Address = data.Content.Company.Address;
                $scope.Company.CompanyLogoUrl = data.Content.Company.CompanyLogoUrl;
         
                $scope.serviceOrderDate = moment(parseInt(data.Content.ServiceDate.substr(6))).format('DD.MM.YYYY');
                $scope.serviceOrderNumber = data.Content.ServiceOrderNumber;
                $scope.serviceOrderState = data.Content.OrderStates;
                $scope.serviceOrderStateId = data.Content.OrderStateId;
                $scope.serviceOrderNotes = data.Content.Notes;

                $scope.billingAddress = data.Content.BillTo;
                $scope.shippingAddress = data.Content.ShipTo;


                $scope.taskCheckLists = data.Content.WorkTaskListItems;
                $scope.selectedTaskCheckLists = data.Content.WorkTaskListItemIds;
                $scope.taskNotes = data.Content.WorkTaskNotes;
                $scope.selectedTaskNotes = data.Content.WorkTaskNoteIds;

                $scope.Footer = data.Content.Footer;
                

                for (i = 0; i < data.Content.WorkTaskLogs.length; i++) {
                    if (data.Content.WorkTaskLogs[i].IsSelected) {
                        $scope.selectedLogs.push(data.Content.WorkTaskLogs[i]);
                    } else {
                        $scope.availableLogs.push(data.Content.WorkTaskLogs[i]);
                    }
                }
            }
            else {
                //error on server side
                console.log(data);
                $.prompt(data.Content);
            }
        }).error(function (data) {
            //unexpected error
            $.prompt("Unexpected error in LoadServiceOrder procedure! Please contact administrator!");
            $scope.taskLogList = [];
        });
    };


    // Total of the logs amounts
    $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.selectedLogs.length; i++) {
            total += $scope.selectedLogs[i].Amount;
        }
        return total;
    };

    // Copy billing address to shipping address text area
    $scope.copyAddress = function () {
        $scope.shippingAddress = $scope.billingAddress;
    };

    // Move selcted logs from popup to selected logs list
    $scope.moveSelectedLogs = function () {
        for (var i = 0; i < $scope.selectedLogIds.length; i++) {

            for (j = 0; j < $scope.availableLogs.length; j++) {
                if ($scope.selectedLogIds[i] == $scope.availableLogs[j].Id) {
                    $scope.selectedLogs.push($scope.availableLogs[j]);
                    $scope.availableLogs.splice(j, 1);
                }          
            }
        }

        $scope.selectedLogIndexes = [];
        
    };

    // Remove log by Id
    $scope.removeLog = function (id) {
        for (j = 0; j < $scope.selectedLogs.length; j++) {
            if ($scope.selectedLogs[j].Id == id) {
                $scope.availableLogs.push($scope.selectedLogs[j]);
                $scope.selectedLogs.splice(j, 1);
            }
        }
    };
 
}]);