needlework.admin = needlework.admin || {};

needlework.admin.bindActins = {

    click: function () {
        var utils = needlework.admin.utils;

        $("#updateBtn").click(function (event) {
            utils.updateLocalizationData();
        });

        $("i.fa.fa-plus-circle").click(function () {
            utils.addField(this);
        });

        $(document).on("click", "i.fa.fa-minus-circle", function () {
            utils.deleteField(this);
        });
    },

    change: function () {
        var utils = needlework.admin.utils;

        $("#selectLanguage").on("change", function () {
            utils.chooseLanguage();
        });
    },

    resize: function () {
        $(window).on("resize", function () {
            var tableSize = {
                height: 500,
                width: $("#tabs").width() - 1
            };
            $("#usersList").setGridWidth(tableSize.width, true);
            $("#paletteList").setGridWidth(tableSize.width, true);
            $("#feedbacksList").setGridWidth(tableSize.width, true);
        });
    },
};