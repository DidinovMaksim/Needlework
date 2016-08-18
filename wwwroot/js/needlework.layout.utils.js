needlework.layout.utils = {
    //getting object with url params ('get')
    getUrlVars: function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    },

    //generate title and mesaage from recieved data from BE
    generateMessage: function (data) {
        var message = {};
        message.Code = data.Code;
        message.Status = data.Status;
        if (data.Status == 'Exception') {
            message.Name = data.Name;
            message.Definition = data.Definition;
        } else {
            message.Name = Localization.Messages[data.Code].Name;
            message.Definition = Localization.Messages[data.Code].Definition;
        }
        return message;
    },

    //disable user activity
    lock: function () {
        $('.popUpBack').off();
    }
}