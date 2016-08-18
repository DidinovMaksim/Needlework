$(document).ready(function () {
    needlework.localization.localizatePage('AdminPage');
    needlework.admin.init();
});

needlework.admin = {

    init: function () {
        var self = this,
            actions = needlework.admin.bindActins;
        self.load();
        actions.click();
        actions.change();
        actions.resize();
    },

    load: function () {
        var self = this;

        self.loadTableFeedbacks();
        self.loadTableCustomers();
        self.loadTablePalettes();
        self.loadInformtaionForm();
        self.initComponents();
    },

    loadTableFeedbacks: function () {
        var deleteUrl = "/Feedbacks/DeleteFeedbackData/",
            gridName = "#feedbacksList",
            loadUrl = '/Feedbacks/GetFeedbackData/',
            gridSize = needlework.admin.utils.getGridSize(gridName),
            self = this;

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
                            //return "<button class='deleteBtn' onclick=\"needlework.admin.deleteItem('" + rowobject.Id + "','/Feedbacks/DeleteFeedbackData/','feedbacksList', '/Feedbacks/GetFeedbackData/')\"><i class='fa fa-trash'></i></button>";
                            return "<button class='deleteBtn' onclick=\"needlework.admin.utils.deleteItem('" + rowobject.Id + "','" + deleteUrl + "','" + gridName + "', '" + loadUrl + "')\"><i class='fa fa-trash'></i></button>";
                        },
                        search: false,
                        align: 'center'
                    }],
                    data: JSON.parse(result),
                    rowNum: 15,
                    pager: '#gridPagerFeedback',
                    width: gridSize.width,
                    height: gridSize.height,
                    rowList: [15, 30, 45, 60],
                    caption: "Feedback list",
                }).navGrid("#gridPagerFeedback",
                {
                    edit: false,
                    add: false,
                    del: false,
                    search: false,
                    refresh: false
                });

                $("#feedbacksList").jqGrid('filterToolbar', {
                    searchOnEnter: false
                });
            }
        })
    },

    loadTableCustomers: function () {
        var loadUrl = "/AdminUser/GetUserData/",
            deleteUrl = "/AdminUser/DeleteUserData/",
            gridName = "#usersList",
            gridSize = {},
            lastSel = -1,
            self = this,
            utils = needlework.admin.utils;

        gridSize = utils.getGridSize(gridName),

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
                        //editrules: {
                        //    custom_func: needlework.admin.validateEmail,
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
                        editable: false,
                        formatter: function (cellvalue) {
                            return (cellvalue === false) ? 'Åmail not confirmed' : 'Email confirmed';
                        }
                    },
                    {
                        name: "Remove",
                        index: "Remove",
                        formatter: function (cellvalue, options, rowobject) {
                            return "<button class='deleteBtn' onclick=\"needlework.admin.utils.deleteItem('" + rowobject.Id + "','" + deleteUrl + "','" + gridName + "', '" + loadUrl + "')\"><i class='fa fa-trash'></i></button>";
                        },
                        search: false,
                        align: 'center'
                    }],
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
                        $("#usersList").jqGrid('editRow', id, {
                            keys: true,
                            oneditfunc: function () { },
                            successfunc: function (response) {
                                utils.reloadJQGrid(gridName, loadUrl);
                            }
                        });
                    },
                    onSelectRow: function (id) {
                        if (id && id !== lastSel) {
                            $("#usersList").jqGrid('restoreRow', lastSel);
                            lastSel = id;
                        }
                    },
                }).navGrid("#gridPager",
                {
                    edit: false,
                    add: false,
                    del: false,
                    search: false,
                    refresh: false
                },
                {
                    beforeShowForm: function (form) {
                        var parent = {
                            width: $("#gbox_usersList").width(),
                            height: $("#gbox_usersList").height()
                        };
                        $("#editmodusersList").css({
                            "top": parent.height / 2 + "px",
                            "left": parent.width / 2 - 175 + "px"
                        });
                    },
                });
                $("#usersList").jqGrid('filterToolbar', {
                    searchOnEnter: false
                });
            }
        })
    },

    loadTablePalettes: function () {
        var gridName = "#paletteList",
            utils = needlework.admin.utils,
            gridSize = utils.getGridSize(gridName),
            loadUrl = "/AdminPalette/GetData",
            deleteUrl = "/Palettes/RemovePalette",
            lastSel = -1;

        $("#paletteList").jqGrid({
            url: loadUrl,
            datatype: 'json',
            mtype: 'post',
            colNames: ['Id', 'Name', "Remove palette"],
            colModel: [{
                key: true,
                hidden: true,
                name: 'Id',
                index: 'Id',
                editable: true
            }, {
                key: false,
                name: 'Name',
                index: 'Name',
                editable: true
            }, {
                name: "Remove",
                index: "Remove",
                formatter: function (cellvalue, options, rowobject) {
                    return "<button class='deleteBtn' onclick=\"needlework.admin.utils.deleteItem('" + rowobject.Id + "','" + deleteUrl + "','" + gridName + "', '" + loadUrl + "')\"><i class='fa fa-trash'></i></button>";
                },
                search: false,
                align: 'center'
            }, ],
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
            editurl: "/Palettes/EditPalette",
            ondblClickRow: function (id) {
                $("#paletteList").jqGrid('editRow', id, {
                    keys: true,
                    oneditfunc: function () { },
                    successfunc: function (response) {
                        utils.reloadJQGrid(gridName, loadUrl);
                    }
                });
            },
            onSelectRow: function (id) {
                if (id && id !== lastSel) {
                    $("#paletteList").jqGrid('restoreRow', lastSel);
                    lastSel = id;
                }
            },
            subGrid: true,
            subGridRowExpanded: function (subgrid_id, rowId) {
                var subgrid_table_id;
                $.ajax({
                    url: "/Palettes/GetColors/",
                    datatype: "json",
                    data: { paletteId: rowId },
                    contentType: "application/json; charset=utf-8",
                    method: "GET",
                    success: function (result) {
                        subgrid_table_id = subgrid_id + "_t";
                        $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table>");
                        $("#" + subgrid_table_id).jqGrid({
                            datatype: "local",
                            data: result.Colors,
                            colNames: ["id", "Name", "Hex","Thubnail"],
                            colModel: [
                              { name: "Id", index: "Id", width: 80, key: true ,hidden:true},
                              { name: "Name", index: "Name", width: 130 },
                              { name: "Hex", index: "Hex", width: 130 },
                              {
                                  name: "Hex",
                                  index: "Hex",
                                  width: 130,
                                  formatter: function (cellvalue, options, rowobject) {
                                      return "<span style=\"width:10px;margin: 0 auto; height:10px;display:block;background:" + cellvalue + "\"></span>";
                                  },
                                  align: 'center'
                              }
                            ],
                            width:gridSize.width-50,
                            rowNum: 10,
                            sortname: 'num',
                            sortorder: "asc"
                        });
                    }
                });
                
            }
        }).navGrid('#palettePager',
        {
            edit: false,
            add: true,
            del: false,
            search: false,
            refresh: false
        },
        {
            zIndex: 100,
            url: "/Palettes/CreatePalette",
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
                $("#editmodpaletteList").css({
                    "top": parent.height / 2 + "px",
                    "left": parent.width / 2 - 175 + "px"
                });
            },
        });
    },

    loadInformtaionForm: function () {
        var inputCount = [
                Localization.InformationPage.IPFirstBlockText.length,
                Localization.InformationPage.IPSecondBlockText.length,
                Localization.InformationPage.IPThirdBlockText.length
        ],
            blockLevels = ["IPFirstBlockText", "IPSecondBlockText", "IPThirdBlockText"],
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
        $(".first-level input[name=IPFirstBlockName]").val(Localization["InformationPage"]["IPSecondBlockName"]);
        $(".first-level input[name=IPSecondBlockName]").val(Localization["InformationPage"]["IPSecondBlockName"]);
        $(".first-level input[name=IPThirdBlockName]").val(Localization["InformationPage"]["IPThirdBlockName"]);
        $(".first-level input[name=IPtitle]").val(Localization.InformationPage.IPTitle);
    },

    initComponents: function () {
        $('.popup').dialog({
            autoOpen: false
        });

        $("#tabs").tabs();

        $('.admin-page').css({
            height: ($(window).height() - $('footer').height()) + "px"
        });
    },
}