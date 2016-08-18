needlework.validations = {
    //email validation
    emailIsValid: function (email) {
        //var regExp = /.+@.+\..+/;
        var regExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,12}$/;
        return regExp.test(email);
    },

    //password validation
    passwordIsValid: function (password) {
        var regEx = /[a-z]{1,}/;
        if (password.length < 6)
            return false;
        if (!regEx.test(password))
            return false;
        regEx = /[A-Z]{1,}/;
        if (!regEx.test(password))
            return false;
        regEx = /[\W]{1,}/;
        if (!regEx.test(password))
            return false;
        return true;
    },

    //first/last name validation
    nameIsValid: function (name) {
        var regExp = /^[a-zA-Z]{2,20}$/;
        return regExp.test(name);
    },

    //confirm password validation
    passwordIsConfirm: function (password1, password2) {
        return password1 === password2;
    },

    // Сheck Color and Palette Name
    checkName: function (inputId) {
        var testColorName = /^[0-9a-zA-Zа-яА-Я]{3,30}$/;

        if (testColorName.test($(inputId).val())) {
            $(inputId).next().text("Success").css({ color: "green" });
            return $(inputId).val();
        }
        else {
            $(inputId).next().text("Incorrect name").css({ color: "red" });           
        }
    },
    // Сheck RGB
    checkRGB: function () {
        var testRGB = /^([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})$/;
        var match = testRGB.exec($('#inputColorRGB').val());

        if (match !== null && match[1] <= 255 && match[2] <= 255 && match[3] <= 255) {
            $('#inputColorRGB').next().text('Success').css({ color: "green" });
            if ($('#inputColorHex').val() == "") {
                var hex = rgbToHex(match[1], match[2], match[3]);
                //$('#inputColorHex').val("#" + hex);
                return $('#inputColorHex').val("#" + hex);
            }
            return $('#inputColorRGB').val();

        }
        else if ($('#inputColorRGB').val() == "" && needlework.validation.checkHEX()) {
            return true;
        }
        else {
            $('#inputColorRGB').next().text("Incorrect number").css({ color: "red" });
        };
    },
    // Сheck HEX
    checkHEX: function () {
        var testHEX = /^#[0-9a-fA-F]{0,6}$/;

        if (testHEX.test($('#inputColorHex').val()) && $('#inputColorHex').val().length == 7) {
            $('#inputColorHex').next().text("Success").css({ color: "green" });
            return $('#inputColorHex').val();
        }
        else if ($('#inputColorHex').val().length != 7) {
            $('#inputColorHex').next().text("Incorrect length").css({ color: "red" });
        }
        else {
            $('#inputColorHex').next().text("Incorrect char").css({ color: "red" });
        }
    },
}