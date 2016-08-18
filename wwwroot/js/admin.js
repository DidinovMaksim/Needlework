var mydata = [
    { id: "0", FirstName: "Test name", LastName: "Test surname", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "1", FirstName: "Test name", LastName: "Test surname", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "2", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "3", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "4", FirstName: "German", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "5", FirstName: "Test name", LastName: "Test surname", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "6", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "7", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "8", FirstName: "German", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "9", FirstName: "Test name", LastName: "Test surname", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "10", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "11", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "12", FirstName: "German", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "13", FirstName: "Test name", LastName: "Test surname", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "14", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "15", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "16", FirstName: "German", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "17", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "18", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "19", FirstName: "German", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "20", FirstName: "Ivan", LastName: "Pupkin", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "21", FirstName: "Petr", LastName: "Ivanov", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" },
    { id: "22", FirstName: "Vetal", LastName: "Nikolaev", Email: "mail@example.com", Remove: "<input type='button' value='Remove'>" }
];

function reloadJQGrid(reloadUrl, gridName) {
    $.ajax({
        url: reloadUrl,
        method: 'POST',
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        async: true,
        success: function (result) {
            $(gridName).jqGrid('clearGridData');
            $(gridName).jqGrid('setGridParam', {
                datatype: 'local',
                data: JSON.parse(result)
            }).trigger("reloadGrid");
        },
        error: function () {
            console.log('reload error');
        }
    });
}

function deleteItem(rowId, deleteUrl, gridName, loadUrl) {
    delUserMessage = "User deleted successfully!";
    delFeedbackMessage = "Feedback deleted successfully!";

    $.ajax({
        url: deleteUrl,
        data: {
            id: rowId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function () {
            if (gridName == "#feedbacksList") {
                $(".popup").html(delFeedbackMessage);
                $('.popup').dialog("open");
            } else {
                if (gridName == "#usersList") {
                    $(".popup").html(delUserMessage);
                    $('.popup').dialog("open");
                }
            }
            $(".ui-dialog.ui-widget").fadeOut(2500);
            $(".popup").dialog("close");
            reloadJQGrid(loadUrl, gridName);
        }
    });
}

(function ($) {
    $(document).ready(function () {
        LoadTableCustomers();
        LoadTableFeedbacks();
        LoadTablePalettes();
        addRow();
        fillInformPage();
        minusRow();
        updateLocalizationData();
        chooseLang();

        $('.popup').dialog({
            autoOpen: false
        });

        $(".ui-dialog-titlebar").hide();

        $("#tabs").tabs();

        $('.admin-page').css({
            height: ($(window).height() - $('footer').height()) + "px"
        });
    });

    function chooseLang() {
        $("#selectLanguage").on("change", function () {
            var data = { lang: $(this).prop("value") }

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: "/Home/ChangeCulture",
                data: data,
                success: function (data) {
                    location.reload();
                },
                error: function (data) {
                    console.log("Change language error.");
                }
            });
        });
    }

    function updateLocalizationData() {
        var getFormJson = $("#localizationForm").serializeArray(),
            firstTextList = [],
            secondTextList = [],
            thirdTextList = [],
            sendedLocalization = Localization;

        $("#updateBtn").click(function (event) {
            event.preventDefault();

            $(".multiple input[name=IPFirstBlockText]").each(function () {
                firstTextList.push($(this).val());
            });

            $(".multiple input[name=IPSecondBlockText]").each(function () {
                secondTextList.push($(this).val());
            });

            $(".multiple input[name=IPThirdBlockText]").each(function () {
                thirdTextList.push($(this).val());
            });

            sendedLocalization.InformationPage = {
                "IPTitle": $('#title').val(),
                "IPFirstBlockName": $('#FirstBlockName').val(),
                "IPFirstBlockText": firstTextList,
                "IPSecondBlockName": $('#SecondBlockName').val(),
                "IPSecondBlockText": secondTextList,
                "IPThirdBlockName": $('#ThirdBlockName').val(),
                "IPThirdBlockText": thirdTextList
            };

            $.ajax({
                url: 'Localization/Update',
                type: 'POST',
                data: {
                    name: 'IP',
                    json: JSON.stringify(sendedLocalization)
                },
                success: function (result) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            })
        });
    }

    function fillInformPage() {
        var inputCount = [Localization.InformationPage.IPFirstBlockText.length,
                          Localization.InformationPage.IPSecondBlockText.length,
                          Localization.InformationPage.IPThirdBlockText.length
        ],
            blockLevels = ["IPFirstBlockText", "IPSecondBlockText", "IPThirdBlockText"];
        appendElement = "",
        i = 0;

        for (var j = 0; j < blockLevels.length; j++) {
            appendElement = "<span id='item' class='minus'><input type='type' name='" + blockLevels[j] + "'/><i class='fa fa-minus-circle'></i></span>";

            for (var i = 0; i < inputCount[j] - 2; i++) {
                $(".second-level." + blockLevels[j] + " > .multiple").append(appendElement);
            }

            i = 0;
            $(".multiple input[name=" + blockLevels[j] + "]").each(function () {
                $(this).val(Localization.InformationPage[blockLevels[j]][i]);
                i++;
            });
        }
        $(".first-level input[name=IPFirstBlockName]").val(Localization.InformationPage.IPSecondBlockName);
        $(".first-level input[name=IPSecondBlockName]").val(Localization.InformationPage.IPSecondBlockName);
        $(".first-level input[name=IPThirdBlockName]").val(Localization.InformationPage.IPThirdBlockName);
        $(".first-level input[name=IPtitle]").val(Localization.InformationPage.IPTitle);
    }

    function addRow() {
        var FirstBlock = "second-level IPFirstBlock",
            SecondBlock = "second-level IPSecondBlock",
            ThirdBlock = "second-level IPThirdBlock",
            appendElement = '',
            setName = "";

        $('i.fa.fa-plus-circle').click(function () {
            getCurrentBlock = $(this).parents().eq(2).attr("class");

            if (getCurrentBlock == FirstBlock) {
                setName = "IPFirstBlockText";
            }
            else
                if (getCurrentBlock == SecondBlock) {
                    setName = "IPSecondBlockText";
                } else
                    if (getCurrentBlock == ThirdBlock) {
                        setName = "IPThirdBlockText";
                    }

            appendElement = "<span id='item' class='minus'><input type='type' name='" + setName + "'/><i class='fa fa-minus-circle'></i></span>";
            $(this).parent().parent().append(appendElement);
        });
    }

    function minusRow() {
        $(document).on("click", 'i.fa.fa-minus-circle', function () {
            $(this).parent().remove();
        });
    }

    function getGridSize(gridName) {
        var tableSize = {
            height: 500,//$(".admin-page > .wrap").height()-$('footer').height(),
            width: $("#tabs").width() + 12,
        };

        $(window).bind("resize", function () {
            tableSize.width = $('.admin-page > .wrap').width() - 4;
            $(gridName).setGridWidth(tableSize.width, true);
        });

        return tableSize;
    }

    function validateEmail(value, column) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!filter.test(value))
            return [false, "Please enter correct email value!"];
        else
            return [true, ""];
    }

    function LoadTableFeedbacks() {
        var deleteUrl = "/Feedbacks/DeleteFeedbackData/",
            gridName = "#feedbacksList",
            loadUrl = '/Feedbacks/GetFeedbackData/',
            gridSize = getGridSize(gridName);

        $.ajax({
            url: loadUrl,
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "POST",
            success: function (result) {
                $("#feedbacksList").jqGrid({
                    datatype: "local",
                    colNames: ['Id', 'First name', 'Last name', 'Text', 'Email', 'Delete feedback'],
                    colModel: [
                        {
                            name: 'Id',
                            index: 'Id',
                            key: true,
                            hidden: true,
                            sortable: false,
                        },
                        {
                            name: 'FirstName',
                            index: 'FirstName',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'LastName',
                            index: 'LastName',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Text',
                            index: 'Text',
                            width: 100,
                            sortable: true,
                            sorttype: "text",
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Email',
                            index: 'Email',
                            width: 100,
                            sortable: true,
                            sorttype: "text",
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: "Remove",
                            index: "Remove",
                            formatter: function (cellvalue, options, rowobject) {
                                return "<button class='deleteBtn' onclick='deleteItem(\"" + rowobject.Id + "\",\"" + deleteUrl + "\",\"" + gridName + "\",\"" + loadUrl + "\")' ><i class='fa fa-trash'></i></button>";
                            },
                            search: false,
                            align: 'center'
                        },
                    ],
                    data: JSON.parse(result),
                    rowNum: 15,
                    pager: '#gridPagerFeedback',
                    width: gridSize.width,
                    height: gridSize.height,
                    rowList: [15, 30, 45, 60],
                    caption: "Feedback list",
                }).navGrid("#gridPagerFeedback", { edit: false, add: false, del: false, search: false, refresh: false });

                $("#feedbacksList").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }

    function LoadTableCustomers() {
        var loadUrl = "/AdminUser/GetUserData/",
            deleteUrl = "/AdminUser/DeleteUserData/",
            gridName = "#usersList",
            gridSize = getGridSize(gridName),
            lastSel = -1,
            isRowEditable = function (id) {
                return true;
            };

        $.ajax({
            url: loadUrl,
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "POST",
            success: function (result) {
                $("#usersList").jqGrid({
                    datatype: "local",
                    colNames: ['Id', 'First name', 'Last name', 'Email', 'Status', 'Delete user'],
                    colModel: [
                        {
                            name: 'Id',
                            index: 'Id',
                            key: true,
                            hidden: true,
                            sortable: false,
                        },
                        {
                            name: 'FirstName',
                            index: 'FirstName',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'LastName',
                            index: 'LastName',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Email',
                            index: 'Email',
                            width: 80,
                            sortable: true,
                            sorttype: "text",
                            search: true,
                            sortable: false,
                            editable: true,
                            //editrules:{
                            //    custom_func: validateEmail,
                            //    custom: true,
                            //    required: true
                            //},
                        },
                        {
                            name: 'EmailConfirmed',
                            index: 'EmailConfirmed',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: false
                        },
                        {
                            name: "Remove",
                            index: "Remove",
                            formatter: function (cellvalue, options, rowobject) {
                                return "<button class='deleteBtn' onclick='deleteItem(\"" + rowobject.Id + "\",\"" + deleteUrl + "\",\"" + gridName + "\",\"" + loadUrl + "\")' ><i class='fa fa-trash'></i></button>";
                            },
                            search: false,
                            align: 'center'
                        },
                    ],
                    data: JSON.parse(result),
                    rowNum: 15,
                    pager: '#gridPager',
                    width: gridSize.width,
                    height: gridSize.height,
                    rowList: [15, 30, 45, 60],
                    viewrecords: true,
                    search: true,
                    caption: "User list",
                    editurl: "/AdminUser/GridSave/",
                    ondblClickRow: function (id) {
                        if (isRowEditable(id)) {
                            $("#usersList").jqGrid('editRow', id,
                            {
                                keys: true,
                                oneditfunc: function () {

                                },
                                successfunc: function (response) {
                                    var msg,
                                        responseObj = JSON.parse(response.responseText);

                                    msg = Localization.Messages[responseObj.Code];

                                    $(".popup").html(msg.Definition);
                                    $(".popup").dialog("open");
                                    $(".ui-dialog.ui-widget").fadeOut(2500);
                                    $(".popup").dialog("close");
                                    reloadJQGrid("/AdminUser/GetUserData/", "#usersList");
                                }
                            });
                        }
                    },
                    onSelectRow: function (id) {
                        if (id && id !== lastSel) {
                            $("#usersList").jqGrid('restoreRow', lastSel);
                            lastSel = id;
                        }
                    },
                }).navGrid("#gridPager", { edit: false, add: false, del: false, search: false, refresh: false },
                 {
                     beforeShowForm: function (form) {
                         var parent = {
                             width: $("#gbox_usersList").width(),
                             height: $("#gbox_usersList").height()
                         };
                         $("#editmodusersList").css({ "top": parent.height / 2 + "px", "left": parent.width / 2 - 175 + "px" });
                     },
                 });
                $("#usersList").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }

    function LoadTablePalettes() {
        var gridName = "#paletteList",
            gridSize = getGridSize(gridName),
            loadUrl = "/AdminPalette/GetData",
            deleteUrl = "/AdminPalette/Delete/",
            lastSel = -1,
            isRowEditable = function (id) {
                return true;
            };

        $("#paletteList").jqGrid({
            url: "/AdminPalette/GetData",
            datatype: 'json',
            mtype: 'POST',
            colNames: ['Id', 'Name', "Remove feedback"],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: true },
                { key: false, name: 'Name', index: 'Name', editable: true },
                {
                    key: false, name: 'Remove feedback', index: 'Remove feedback', align: 'center', editable: false, formatter: function (cellvalue, options, rowobject) {
                        return "<button class='deleteBtn' onclick='deleteItem(\"" + rowobject.Id + "\",\"" + deleteUrl + "\",\"" + gridName + "\",\"" + loadUrl + "\")' ><i class='fa fa-trash'></i></button>";
                    },
                }
            ],
            pager: '#palettePager',
            rowNum: 10,
            rowList: [10, 20, 30, 40],
            viewrecords: true,
            width: 500,
            caption: 'Palette List',
            emptyrecords: 'No records to display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            width: gridSize.width,
            height: gridSize.height,
            multiselect: false,
            editurl: "/AdminPalette/Edit/",
            ondblClickRow: function (id) {
                if (isRowEditable(id)) {
                    $("#paletteList").jqGrid('editRow', id,
                    {
                        keys: true,
                        oneditfunc: function () {
                        },
                        successfunc: function (response) {
                            console.log(response.responseText);
                            $(".popup").html(response.responseText);
                            $(".popup").dialog("open");
                            $(".ui-dialog.ui-widget").fadeOut(2500);
                            $(".popup").dialog("close");
                            reloadJQGrid("/AdminPalette/GetData", "#paletteList");
                        }
                    });
                }
            },
            onSelectRow: function (id) {
                if (id && id !== lastSel) {
                    $("#paletteList").jqGrid('restoreRow', lastSel);
                    lastSel = id;
                }
            },
        }).navGrid('#palettePager', { edit: false, add: true, del: false, search: false, refresh: false },
        {
            zIndex: 100,
            url: "/AdminPalette/Create",
            closeOnEscape: true,
            closeAfterAdd: true,
            afterComplete: function (result) { }
        },
        {
            beforeShowForm: function (form) {
                var parent = {
                    width: $("#gbox_paletteList").width(),
                    height: $("#gbox_paletteList").height()
                };
                $("#editmodpaletteList").css({ "top": parent.height / 2 + "px", "left": parent.width / 2 - 175 + "px" });
            },
        });
    }

}(jQuery));