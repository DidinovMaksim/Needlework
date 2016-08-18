$(document).ready(function () {
    needlework.localization.init();
});

needlework.localization = {

    init: function(){
        needlework.localization.bindActions();
    },

    bindActions: function(){
        //send data to change culture
        $(".langChange").on("click", function () {

            needlework.layout.toggleLoading();
           
            var data = { lang: $(this).prop("id") }

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: "/Home/ChangeCulture",
                data: data,
                success: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    location.reload();
                },

                error: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                }
            });
        });
    },

    //Localization
    localizatePage: function (currentPage) {
        function Localizate(Object) {
            for (var key in Object) {
                if (Object[key] instanceof Array) {
                    $('#' + key).html('');
                    Object[key].forEach(function (item, i, arr) {
                        $('#' + key).html($('#' + key).html() + '</br>' + item);
                    })
                } else {
                    if ($('#' + key).is('input[type^=text], input[type^=password]')) {
                        $('#' + key).prop('placeholder', Object[key]);
                    } else if ($('#' + key).is('input[type^=button], input[type^=submit]')) {
                        $('#' + key).prop('value', Object[key]);
                    } else if ($('#' + key).is('input[type^=checkbox]')) {
                        $('#' + key).after(Object[key]);
                    } else {
                        $('#' + key).html(Object[key]);
                    }
                }
            }
        }

        Localizate(Localization[currentPage]);
        Localizate(Localization.Layout);
        for (var key in Localization.PopUps) {
            Localizate(Localization.PopUps[key]);
        }
    }
}