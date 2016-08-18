$(document).ready(function () {
    needlework.layout.init();
});

needlework.layout = {
    init: function () {
        var code = needlework.layout.utils.getUrlVars()['code'];

        needlework.layout.bindActions();

        //running as soon as page has loaded to get 'get' params and show pop-up
        var getParams = needlework.layout.utils.getUrlVars();
        if (getParams['successCode'] == '2007') {
            needlework.popups.popUpShow($('#popResetPassword'));
        }

        if (getParams['successCode'] == '2003') {
            needlework.layout.utils.lock();
            needlework.popups.popUpShowInformation(Localization.Messages[2003].Name, Localization.Messages[2003].Definition);
            setTimeout(function () {
                needlework.popups.popUpHide($(".openedPopUp"), function () {
                    window.location.href = '/';
                });
            }, 3000);
        }
    },

    bindActions: function () {
        //-----------------------------------------------------------
        // Event handlers for pop-up forms
        //-----------------------------------------------------------

        //show pop-up for login form
        $('.signIn').on('click', function () {
            needlework.popups.popUpShow($('#popUpLogin'));
        });

        //show pop-up for feedback form
        $('#feedback').on('click', function () {
            needlework.popups.popUpShow($('#popFeedback'));
        });

        //show pop-up for change password form
        $('#changePassword').on('click', function () {
            needlework.popups.popUpShow($('#popChangePassword'));
        });

        //show pop-up for forgot password form
        $('#forgotPassword').on('click', function () {
            needlework.popups.popUpChange($("#popUpLogin"), $("#popForgotPassword"));
        })

        //switch pop-up login form to pop-up registrtion form
        $('#registration').on('click', function () {
            $('#loginForm').slideUp(function () {
                $('#registrationForm').slideDown();
            })
        });

        //switch pop-up registrtion form to pop-up login form
        $('#login').on('click', function () {
            $('#registrationForm').slideUp(function () {
                $('#loginForm').slideDown();
            })
        });



        //-----------------------------------------------------------
        // Event handlers for send Ajax queries
        //-----------------------------------------------------------

        //send data to login user
        $('#loginSubmit').on('click', function () {

            needlework.layout.toggleLoading();

            var data = {
                email: $('#loginEmail').prop('value'),
                password: $('#loginPassword').prop('value'),
                remember: $('#loginRemember').prop('checked')
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/Login/',
                data: data,

                success: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    if (data.Status == 'Success')
                        location.reload();
                    else
                        needlework.popups.popUpShowInformation(data.Name, data.Definition);
                },

                error: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    if (data.Status == 'Success')
                        location.reload();
                    else
                        needlework.popups.popUpShowInformation(data.Name, data.Definition);
                }
            });
        });

        //send data to registration new user
        $('#registrationSubmit').on('click', function () {

            needlework.layout.toggleLoading();
            $('.validationError').remove();

            if (!ValidateRegistrationForm()) {
                needlework.layout.toggleLoading();
                grecaptcha.reset();
                return false;
            }

            var data = {
                firstName: $('#registrationFirstName').prop('value'),
                lastName: $('#registrationLastName').prop('value'),
                email: $('#registrationEmail').prop('value'),
                password: $('#registrationPassword').prop('value'),
                captchaResponse: grecaptcha.getResponse()
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/Register/',
                data: data,

                success: function (data) {
                    needlework.layout.toggleLoading();
                    grecaptcha.reset();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    if (data.Code == '1001') {
                        $('#registrationReCaptcha').after('<div class="validationError">' + Localization.Validations['captcha'] + '</div>');
                        return false;
                    }
                    needlework.layout.clearForm('#registrationForm');
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                    //location.reload();
                },

                error: function (data) {
                    needlework.layout.toggleLoading();
                    grecaptcha.reset();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    if (data.Code == '1001') {
                        $('#registrationReCaptcha').after('<div class="validationError">' + Localization.Validations['captcha'] + '</div>');
                        return false;
                    }
                    needlework.layout.clearForm('#registrationForm');
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                    //location.reload();
                }
            });
        });

        //send data to log out current user
        $('.signOut').on('click', function () {

            var data = {
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/LogOff/',
                data: data,

                success: function () {
                    location.reload();
                },

                error: function (data) {
                    location.reload();
                }
            });
        });


        //send feedback data
        $('#feedBackSubmit').on('click', function () {
            console.log($("#feedBackArea").val());

            needlework.layout.toggleLoading();

            var data = {
                text: $("#feedBackArea").val()
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Feedbacks/CreateFeedBack/',
                data: data,
                success: function (data) {
                    console.log(data);
                    needlework.layout.toggleLoading();
                    text: $("#feedBackArea").val('');
                    //PopUpHide($('#popFeedback'));
                    //$('.popUpBack').click();
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                },
                error: function (data) {
                    console.log(data);
                    needlework.layout.toggleLoading();
                    text: $("#feedBackArea").val('');
                    //PopUpHide($('#popFeedback'));
                    //$('.popUpBack').click();
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                }
            });
        });


        //send email, then user will get the link on email to reset his password
        $('#forgotPasswordSubmit').on('click', function () {

            needlework.layout.toggleLoading();
            $('.validationError').remove();

            if (!ValidateForgotPasswordForm()) {
                needlework.layout.toggleLoading();
                return false;
            }

            var data = {
                email: $('#forgotPasswordEmail').prop('value')
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/ForgotPassword/',
                data: data,
                success: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm("#popForgotPassword");
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                },
                error: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm("#popForgotPassword");
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                }
            });
        });

        //send data to reset user password
        $('#resetPasswordSubmit').on('click', function () {

            needlework.layout.toggleLoading();
            $('.validationError').remove();

            if (!ValidateResetPasswordForm()) {
                needlework.layout.toggleLoading();
                return false;
            }

            var data = {
                email: $('#resetPasswordEmail').prop('value'),
                password: $('#resetPasswordNewPassword').prop('value'),
                code: code
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/ResetPassword/',
                data: data,

                success: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm('#popResetPassword');
                    needlework.layout.utils.lock();
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                    setTimeout(function () {
                        needlework.popups.popUpHide($(".openedPopUp"), function () {
                            window.location.href = '/';
                        });
                    }, 3000);
                },

                error: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm('#popResetPassword');
                    needlework.layout.utils.lock();
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                    setTimeout(function () {
                        needlework.popups.popUpHide($(".openedPopUp"), function () {
                            window.location.href = '/';
                        });
                    }, 3000);
                }
            });
        });


        //send data to change password
        $('#changePasswordSubmit').on('click', function () {

            needlework.layout.toggleLoading();
            $('.validationError').remove();

            if (!ValidateChangePasswordForm()) {
                needlework.layout.toggleLoading();
                return false;
            }

            var data = {
                oldPassword: $("#changePasswordOldPassword").prop("value"),
                newPassword: $("#changePasswordNewPassword").prop("value")
            };

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Account/ChangePassword/',
                data: data,
                success: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm('#popChangePassword');
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                },
                error: function (data) {
                    needlework.layout.toggleLoading();
                    console.log(data);
                    data = needlework.layout.utils.generateMessage(data);
                    needlework.layout.clearForm('#popChangePassword');
                    needlework.popups.popUpShowInformation(data.Name, data.Definition);
                }
            });
        });
    },

    //toggle loading block
    toggleLoading: function () {
        if ($('#loading').css('display') == 'table')
            $('#loading').css('display', 'none');
        else
            $('#loading').css('display', 'table');
    },

    //clear all data from form
    clearForm: function (formId) {
        $(formId + ' input[type^=text], ' + formId + ' input[type^=password]').prop('value', '');
    }
}











//--------------------------------------------------
// Functions for validations
//--------------------------------------------------



//validation for registration form
function ValidateRegistrationForm() {
    var valid = true;
    //first name
    if (!needlework.validations.nameIsValid($('#registrationFirstName').prop('value'))) {
        $('#registrationFirstName').after('<div class="validationError">' + Localization.Validations['name'] + '</div>');
        valid = false;
    }
    //last name
    if (!needlework.validations.nameIsValid($('#registrationLastName').prop('value'))) {
        $('#registrationLastName').after('<div class="validationError">' + Localization.Validations['name'] + '</div>');
        valid = false;
    }
    //email
    if (!needlework.validations.emailIsValid($('#registrationEmail').prop('value'))) {
        $('#registrationEmail').after('<div class="validationError">' + Localization.Validations['email'] + '</div>');
        valid = false;
    }
    //password
    if (!needlework.validations.passwordIsValid($('#registrationPassword').prop('value'))) {
        $('#registrationPassword').after('<div class="validationError">' + Localization.Validations['password'] + '</div>');
        valid = false;
    }
    //confirm password
    if (!needlework.validations.passwordIsConfirm($('#registrationPassword').prop('value'), $('#registrationConfirmPassword').prop('value'))) {
        $('#registrationConfirmPassword').after('<div class="validationError">' + Localization.Validations['passwordConfirm'] + '</div>');
        valid = false;
    }

    return valid;
}


//validation for reset password form
function ValidateResetPasswordForm() {
    var valid = true;

    //email
    if (!needlework.validations.emailIsValid($('#resetPasswordEmail').prop('value'))) {
        $('#resetPasswordEmail').after('<div class="validationError">' + Localization.Validations['email'] + '</div>');
        valid = false;
    }
    //password
    if (!needlework.validations.passwordIsValid($('#resetPasswordNewPassword').prop('value'))) {
        $('#resetPasswordNewPassword').after('<div class="validationError">' + Localization.Validations['password'] + '</div>');
        valid = false;
    }
    //confirm password
    if (!needlework.validations.passwordIsConfirm($('#resetPasswordNewPassword').prop('value'), $('#resetPasswordNewPasswordConfirm').prop('value'))) {
        $('#resetPasswordNewPasswordConfirm').after('<div class="validationError">' + Localization.Validations['passwordConfirm'] + '</div>');
        valid = false;
    }

    return valid;
}

//validation for cahnge password form
function ValidateChangePasswordForm() {
    var valid = true;

    //old password
    if (!needlework.validations.passwordIsValid($('#changePasswordOldPassword').prop('value'))) {
        $('#changePasswordOldPassword').after('<div class="validationError">' + Localization.Validations['password'] + '</div>');
        valid = false;
    }
    //new password
    if (!needlework.validations.passwordIsValid($('#changePasswordNewPassword').prop('value'))) {
        $('#changePasswordNewPassword').after('<div class="validationError">' + Localization.Validations['password'] + '</div>');
        valid = false;
    }
    //confirm password
    if (!needlework.validations.passwordIsConfirm($('#changePasswordNewPassword').prop('value'), $('#changePasswordNewPasswordConfirm').prop('value'))) {
        $('#changePasswordNewPasswordConfirm').after('<div class="validationError">' + Localization.Validations['passwordConfirm'] + '</div>');
        valid = false;
    }

    return valid;
}

//validation for forgot password form
function ValidateForgotPasswordForm() {
    if (!needlework.validations.emailIsValid($('#forgotPasswordEmail').prop('value'))) {
        $('#forgotPasswordEmail').after('<div class="validationError">' + Localization.Validations['email'] + '</div>');
        return false;
    }
    return true;
}


