//function LoadTablePalettes() {
//    var gridName = "#paletteList",
//        gridSize = getGridSize(gridName);

//    $("#paletteList").jqGrid({
//        url: "/AdminPalette/GetData",
//        datatype: 'json',
//        mtype: 'Get',
//        colNames: ['Id', 'Name', 'UserName'],
//        colModel: [
//            { key: true, hidden: true, name: 'Id', index: 'Id', editable: true },
//            { key: false, name: 'Name', index: 'Name', editable: true },
//            { key: false, name: 'UserName', index: 'UserName', editable: true }],
//        pager: '#palettePager',
//        rowNum: 10,
//        rowList: [10, 20, 30, 40],
//        viewrecords: true,
//        width: 500,
//        caption: 'Palette List',
//        emptyrecords: 'No records to display',
//        jsonReader: {
//            root: "rows",
//            page: "page",
//            total: "total",
//            records: "records",
//            repeatitems: false,
//            Id: "0"
//        },
//        width: gridSize.width,
//        height: gridSize.height,
//        multiselect: false
//    }).navGrid('#palettePager', { edit: true, add: true, del: true, search: false, refresh: true },
//    {
//        // edit options
//        zIndex: 100,
//        url: '/AdminPalette/Edit',
//        closeOnEscape: true,
//        closeAfterEdit: true,
//        recreateForm: true,
//        afterComplete: function (response) {
//            if (response.responseText) {
//                alert(response.responseText);
//            }
//        }
//    },
//    {
//        // add options
//        zIndex: 100,
//        url: "/AdminPalette/Create",
//        closeOnEscape: true,
//        closeAfterAdd: true,
//        afterComplete: function (response) {
//            if (response.responseText) {
//                alert(response.responseText);
//            }
//        }
//    },
//    {
//        // delete options
//        zIndex: 100,
//        url: "/AdminPalette/Delete",
//        closeOnEscape: true,
//        closeAfterDelete: true,
//        recreateForm: true,
//        msg: "Are you sure you want to delete this task?",
//        afterComplete: function (response) {
//            if (response.responseText) {
//                alert(response.responseText);
//            }
//        }
//    });
//}