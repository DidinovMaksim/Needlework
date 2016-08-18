$(document).ready(function () {
    needlework.popups.init();
});


needlework.popups = {

    init: function(){
        needlework.popups.bindActions();
    },

    bindActions: function(){
        //-----------------------------------------------------------
        // General event handlers
        //-----------------------------------------------------------

        //hide current opened pop-up
        $('.popUpBack').on('click', function (e) {
            if (e.target == this) {
                console.log(this);
                needlework.popups.popUpHide($(this).children(".popUp"));
            }
        });

        //hide current opened pop-up by click on 'esc' key
        $(window).keydown(function (e) {
            if (e.which == 27) {
                $('.popUpBack').click();
            }
        });

        //show/hide menu in mobile mode by click on '#showMenu' button
        $('#showMenu').on('click', function () {
            MenuToggle();
        });
    },

    //hide pop-up form
    popUpHide: function (popUpObject, callback) {
        $(popUpObject).removeClass('openedPopUp');
        $(popUpObject).slideUp(function () {
            $(popUpObject).parent().css('display', 'none');
            if (typeof callback === 'function')
                callback();
        });
    },

    //show pop-up form
    popUpShow: function (popUpObject) {         
        //ClearForm(popUpObject.prop('id'));
        popUpObject.addClass('openedPopUp');
        popUpObject.parent().css('display', 'block');
        //$('.popUpBack').css('display', 'block');
        popUpObject.slideDown();
    },


    //hide current pop-up form and show new 
    popUpChange: function (oldPopUpObject, newPopUpObject) {
        needlework.popups.popUpHide(oldPopUpObject, function () {
            needlework.popups.popUpShow(newPopUpObject);
        });
    },

    //show specefic pop-up with information form (alert)
    popUpShowInformation: function (title, message) {
        $("#informationTitle").html(title);
        $("#informationMessage").html(message);
        if (!$(".openedPopUp").length) {
            needlework.popups.popUpShow($("#popInformation"));
        } else {
            needlework.popups.popUpHide($(".openedPopUp"), function () {
                needlework.popups.popUpShow($("#popInformation"));
            });
        }
    }
}