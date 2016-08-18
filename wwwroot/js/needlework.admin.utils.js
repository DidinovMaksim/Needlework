needlework.admin = needlework.admin || {};

needlework.admin.utils = {

    getGridSize: function (gridName) {
        return tableSize = {
            height: 500,
            width: $("#tabs").width() - 20
        };
    },

    reloadJQGrid: function (gridName, reloadUrl) {
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
            }
        });
    },

    deleteItem: function (rowId, deleteUrl, gridName, loadUrl) {
        var self = this;

        $.ajax({
            url: deleteUrl,
            data: {
                id: rowId
            },
            type: 'delete',
            success: function () {
                self.reloadJQGrid(gridName, loadUrl);
            }
        });
    },

    chooseLanguage: function () {
        var data = {
            lang: $("#selectLanguage").prop("value")
        }
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
    },

    updateLocalizationData: function () {
        var getFormJson = $("#localizationForm").serializeArray(),
            firstTextList = [],
            secondTextList = [],
            thirdTextList = [],
            currentLanguage,
            sendedLocalization = Localization;

        currentLanguage = function get_cookie() {
            var results = document.cookie.match('(^|;) ?' + "lang" + '=([^;]*)(;|$)');

            if (results)
                return (unescape(results[2]));
            else
                return null;
        };

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
            "IPTitle": $('input[name=IPtitle]').val(),
            "IPFirstBlockName": $('input[name=IPFirstBlockName]').val(),
            "IPFirstBlockText": firstTextList,
            "IPSecondBlockName": $('input[name=IPSecondBlockName]').val(),
            "IPSecondBlockText": secondTextList,
            "IPThirdBlockName": $('input[name=IPThirdBlockName]').val(),
            "IPThirdBlockText": thirdTextList
        };

        $.ajax({
            url: 'Localization/Update',
            type: 'POST',
            data: {
                language: currentLanguage(),
                json: JSON.stringify(sendedLocalization)
            },
            success: function (result) { },
            error: function (jqXHR, textStatus, errorThrown) { }
        })

    },

    addField: function (currentClick) {
        var FirstBlock = "second-level IPFirstBlock",
            SecondBlock = "second-level IPSecondBlock",
            ThirdBlock = "second-level IPThirdBlock",
            appendElement = '',
            setName = "";

        getCurrentBlock = $(currentClick).parents().eq(2).attr("class");

        if (getCurrentBlock == FirstBlock) {
            setName = "IPFirstBlockText";
        } else
            if (getCurrentBlock == SecondBlock) {
                setName = "IPSecondBlockText";
            } else
                if (getCurrentBlock == ThirdBlock) {
                    setName = "IPThirdBlockText";
                }

        appendElement = "<span id='item' class='minus'><input type='type' name='" + setName + "'/><i class='fa fa-minus-circle'></i></span>";
        $(currentClick).parent().parent().append(appendElement);

    },

    deleteField: function (currentClick) {
        $(currentClick).parent().remove();
    },
}