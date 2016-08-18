//var selectedPalette = "";
//var addNotEditColor = true;
//var changedColor = "";
//var needlework.editPage.changedPalette = " ";
//var removePaletteButton = "<input type='button' name='Remove' value='Remove' class='RemovePalette'>";
//var editPaletteButton = "<input type='button' name='EditPalette' value='Edit name' class='EditPalette'>";
//id = 'EditPalette" + Id + "'

//Ajax !!!

//function CreatePaletteElements(Id, Name, i) {
//    $('#containerMiddle').append("<div class='Palettes' id='Palettes_" + i + "'></div>");
//    $('#Palettes_' + i).append("<div class='PaletteName' id='" + Id + "'>" + Name + "</div>");
//    $('#Palettes_' + i).append(needlework.editPage.editPaletteButton);
//    $('#Palettes_' + i).append(needlework.editPage.removePaletteButton);
//};

//function CreateColorElements(Id, Name, Hex) {
//    $('#colorList').append("<div class='color' id='" + Id + "'><div class='Thumbnail'></div><div class='colorName'>" + Name + "</div><div class='colorCode'>" + Hex + "</div></div>");
//    $('#colorList div:last-child').children('.Thumbnail').css({ backgroundColor: Hex });
//};



$(document).ready(function () {
    needlework.editPage.init();
    needlework.localization.localizatePage('EditPage');
});

needlework.editPage = {

    selectedPalette: "",
    addNotEditColor: true,
    changedColor: "",
    changedPalette: " ",
    removePaletteButton: "<input type='button' name='Remove' value='" + Localization.EditPage.RemovePalettes + "' class='RemovePalette'>",
    editPaletteButton: "<input type='button' name='EditPalette' value='" + Localization.EditPage.EditPalettes + "' class='EditPalette'>",
    removedPalette: "",
    removedColor: "",
    editPaletteName: false,

    createPaletteElements: function (Id, Name, i) {
        $('#containerMiddle').append("<div class='Palettes' id='Palettes_" + i + "'></div>");
        $('#Palettes_' + i).append("<div class='PaletteName' id='" + Id + "'>" + Name + "</div>");
        $('#Palettes_' + i).append(needlework.editPage.editPaletteButton);
        $('#Palettes_' + i).append(needlework.editPage.removePaletteButton);
    },

    createColorElements: function (Id, Name, Hex) {
        $('#colorList').append("<div class='color' id='" + Id + "'><div class='Thumbnail'></div><div class='colorName'>" + Name + "</div><div class='colorCode'>" + Hex + "</div></div>");
        $('#colorList div:last-child').children('.Thumbnail').css({ backgroundColor: Hex });
    },

    init: function () {
        needlework.editPage.bindActions();
    },
    bindActions: function () {

        // Show inputs for creating new Palette
        $('#AddPalette').click(function () {
            $('#hidePalette').slideUp(500);
        });

        // Clear input for Palette Name
        $('#cancel').click(function () {
            $('#containerLeft label[for=PaletteName]').text('');
            $('#inputPaletteName').val('');
        });

        // Back to Palette List
        $('#backToPalette').click(function () {
            if ($(window).width() > 1100) {
                $('#colorList').animate({ left: "-5%" }, 500)
            }
            else {
                $('#colorList').animate({ left: "-105%" }, 500)
            }
        });

        // Show inputs for creating new Color (AddColor - clicked)
        $('#AddColor').click(function () {

            needlework.editPage.addNotEditColor = true;

            if ($(window).width() > 1100) {
                $('#hideColor').animate({ left: "100%" }, 500);
                $('#choiceColor').animate({ top: "15%" }, 500);
            }
            else {
                $('#containerRight').animate({ left: "0%" }, 500);
                $('#hideColor').animate({ left: "100%" }, 0);
                $('#choiceColor').animate({ top: "10%" }, 0);
            }
        });

        // Show inputs for creating new Color (EditColor - clicked)
        $('body').on('click', '.EditColor', function (event) {
            event.stopPropagation();
            needlework.editPage.addNotEditColor = false;
            needlework.editPage.changedColor = $(this).parent().parent().prop('id');

            if ($(window).width() > 1100) {
                $('#hideColor').animate({ left: "100%" }, 500);
                $('#choiceColor').animate({ top: "15%" }, 500);
            }
            else {
                $('#containerRight').animate({ left: "0%" }, 500);
                $('#hideColor').animate({ left: "100%" }, 0);
                $('#choiceColor').animate({ top: "10%" }, 0);
            }
        });

        // Replace Edit/Remove block to selected div.color
        $(".ChangeColor").slideUp();
        $('body').on('click', '.color', function () {

            if ($(this).children(".ChangeColor").length == 0) {
                $(this).append(
                    "<div class='ChangeColor'>" +
                     "<input type='button' name='EditColor' value='" + Localization.EditPage.EditColor + "' class='EditColor'>" +
                      "<input type='button' name='RemoveColor' value='" + Localization.EditPage.RemoveColor + "' class='RemoveColor'></div>"
                    );
                $(this).children(".ChangeColor").slideUp(0);
            }

            $('.color').not(this).children(".ChangeColor").slideUp(500);
            $(this).children(".ChangeColor").slideToggle(500);
        });

        // Hide all pop-ups and div.ChangeColor(Edit/Remove), when "Esc" was pressed 
        $(window).keydown(function (e) {
            if (e.which == 27) {
                $(".ChangeColor").slideUp();

                $('.popUpBack').click();
            }
        });       

        // Get all Palettes (first page loading)
        function GetPalettes(data) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/Palettes/GetUserPalettes',
                data: data,
                success: function (data) {                   
                    for (var i = 0; i < data.Palettes.length; i++) {
                        needlework.editPage.createPaletteElements(data.Palettes[i].Id, data.Palettes[i].Name, i);
                    }
                },
                error: function (data) {                   
                }
            });
        };
        GetPalettes();

        // Add new Palette
        $('#sentPaletteName').on('click', function () {

            if (needlework.validations.checkName('#inputPaletteName')) {
                var data = {
                    name: $('#inputPaletteName').val()
                };
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/Palettes/CreatePalette',
                    data: data,
                    success: function (data) {
                        if (data.Result.Status == "Exception") {
                            $('#inputPaletteName').next().text("Already exist").css({ color: "red" });
                            return
                        }                      
                        needlework.editPage.createPaletteElements(data.Id, data.Name);                       
                    },
                    error: function (data) {                      
                    }
                });
            }
            else {               
            }
            return false;
        });

        //Get Palette's colors && show effect for getting them
        $('body').on('click', '.PaletteName', function (e) {

            $(".color").remove();

            if ($(window).width() > 1100) {
                $('#colorList').animate({ left: "33.33%" }, 500)
                $('#colorList h2').text($(this).text());
            }
            else {
                $('#colorList').animate({ left: "0%" }, 500)
                $('#colorList h2').text($(this).text());
            };

            needlework.editPage.selectedPalette = this.id;
            var data = {
                paletteId: needlework.editPage.selectedPalette
            };
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/Palettes/GetColors',
                data: data,
                success: function (data) {
                    for (var i = 0; i < data.Colors.length; i++)
                        needlework.editPage.createColorElements(data.Colors[i].Id, data.Colors[i].Name, data.Colors[i].Hex);                   
                },
                error: function (data) {     
                }
            });
            return false;
        });

        //Remove Palette----------------------------------------
        $('body').on('click', '.RemovePalette', function (e) {
            needlework.editPage.removedPalette = $(e.target).prev().prev().prop('id');
            needlework.popups.popUpShow($('#confirmRemovePalette'));
            $('#confirmRemovePalette label').text(Localization.EditPage.paletteDo + $(".PaletteName#" + needlework.editPage.removedPalette).text() + Localization.EditPage.paletteQuestion);
        });

        $('body').on('click', '#cancelRemovepalette', function () {
            needlework.popups.popUpHide($('#confirmRemovePalette'));
        });

        $('body').on('click', '#acceptRemovePalette', function () {

            var data = {
                id: needlework.editPage.removedPalette
            };
            $.ajax({
                type: 'delete',
                dataType: 'json',
                url: '/Palettes/RemovePalette',
                data: data,
                success: function (data) {
                    //$(".PaletteName#" + needlework.editPage.removedPalette).nextAll("input:eq(0), input:eq(1)").remove();
                    $(".PaletteName#" + needlework.editPage.removedPalette).parent().remove();
                    //$(".PaletteName#" + needlework.editPage.removedPalette).remove();                   
                    needlework.popups.popUpHide($('#confirmRemovePalette'));
                    needlework.editPage.removedPalette = "";
                },
                error: function (data) {                   
                }
            });
            return false;
        });


        //Remove Color----------------------------------------
        $('body').on('click', '.RemoveColor', function (e) {
            event.stopPropagation();
            needlework.editPage.removedColor = $(event.target).parent().parent().prop('id');
            needlework.popups.popUpShow($('#confirmRemoveColor'));
            $('#confirmRemoveColor label').text(Localization.EditPage.colorDo + $('.color#' + needlework.editPage.removedColor).children('.colorName').text() + Localization.EditPage.colorQuestion);
        });

        $('body').on('click', '#cancelRemoveColor', function () {
            needlework.popups.popUpHide($('#confirmRemoveColor'));
        });


        $('body').on('click', '#acceptRemoveColor', function () {

            var data = {
                id: needlework.editPage.removedColor
            };
            $.ajax({
                type: 'delete',
                dataType: 'json',
                url: '/Palettes/RemoveColor',
                data: data,
                success: function (data) {
                    $('.color#' + needlework.editPage.removedColor).remove();                   
                    needlework.popups.popUpHide($('#confirmRemoveColor'));
                },
                error: function (data) {                   
                }
            });
        });


        // Edit Palette Name---------------------------------------
        $('body').on('click', '.EditPalette', function (event) {

            var newPaletteName = $(this).prev().children('.ChangePaletteName').val();            

            if (needlework.editPage.editPaletteName) {
                // Check 2 pressed edit palette name buttons
                if (newPaletteName == null) {
                    $('.EditPalette').val("Edit name").css({ backgroundColor: "#00baff" });
                    $('.EditPalette').prev().children('.ChangePaletteName').remove();
                    needlework.editPage.editPaletteName = false;
                    return
                }

                var data = {
                    palette: {
                        id: $(this).prev().prop('id'),
                        name: newPaletteName
                    }
                };

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/Palettes/EditPalette',
                    data: data,
                    success: function (data) {
                        if (needlework.validations.checkName('.ChangePaletteName')) {
                            $(event.target).val(Localization.EditPage.EditPalettes).css({ backgroundColor: "#00baff" });
                            $(event.target).prev().text(newPaletteName);
                            $(event.target).prev().children('.ChangePaletteName').remove();
                            needlework.editPage.editPaletteName = false;
                        }
                    },
                    error: function (data) {                      
                    }
                });
            }
            else {
                needlework.editPage.changedPalette = $(event.target);
                var oldPaletteName = $(this).prev().text();
                $(event.target).val(Localization.EditPage.saveNames).css({ backgroundColor: "rgb(52, 196, 90)" });
                $(event.target).prev().append("<input type='text' class='ChangePaletteName' value='" + oldPaletteName + "' name='" + oldPaletteName + "'>");
                needlework.editPage.editPaletteName = true;
            }
        });

        // Close all edit palette name inputs
        $(window).click(function (e) {
            var target = $(e.target);
            if (target.is(needlework.editPage.changedPalette)) return

            $('.EditPalette').val(Localization.EditPage.EditPalettes).css({ backgroundColor: "#00baff" });
            $('.EditPalette').prev().children('.ChangePaletteName').remove();
            needlework.editPage.editPaletteName = false;
        });

        // Fix parent's logic
        $('body').on('click', '.ChangePaletteName', function (event) {
            event.stopPropagation();
        });

        // Add || Edit Color
        $('#containerRight input[type=submit]').click(function AddColor(e) {

            if (needlework.validations.checkRGB() && needlework.validations.checkHEX() && needlework.validations.checkName('#inputColorName')) {
              
                if (needlework.editPage.addNotEditColor)
                    needlework.editPage.createNewColor();
                else
                    needlework.editPage.editColor();
            }
            return false;
        });

        $('#choiceColor').css({ left: $('#choiceColor').parent().width() / 2 - $('#choiceColor').width() / 2 + "px" });

        //Responsive colorPicker position
        $(window).on('resize', function () {
            if ($(window).width() > 1100)
                $('#containerRight').css({ top: "0px", left: "66.66%", right: "0px" });
            else
                $('#containerRight').css({ float: "left", top: "100%", left: "105%" });
        });



    },

    // Create new Color---------------------------------------------------
    createNewColor: function () {
        var data = {
            color: {
                idpalette: needlework.editPage.selectedPalette,
                hex: needlework.validations.checkHEX(),
                name: needlework.validations.checkName('#inputColorName')
            }
        };
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/Palettes/CreateColor',
            data: data,
            success: function (data) {
                if (data.Result.Status == "Exception") {
                    $('#inputColorName').next().text("Already exist").css({ color: "red" });
                    return
                }
                needlework.editPage.createColorElements(data.Id, data.Name, data.Hex);
              
                if ($(window).width() > 1100) {
                    $('#hideColor').animate({ left: "10%" }, 500);
                    $('#choiceColor').animate({ top: "-100%" }, 500);
                }
                else {
                    $('#containerRight').animate({ left: "105%" }, 500);
                }
            },
            error: function (data) {               
            }
        });

    },

    // Edit Color---------------------------------------------------
    editColor: function () {
        var data = {
            color: {
                id: needlework.editPage.changedColor,
                name: needlework.validations.checkName('#inputColorName'),
                hex: needlework.validations.checkHEX(),
                idpalette: needlework.editPage.selectedPalette
            }
        };
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/Palettes/EditColor',
            data: data,
            success: function (data) {               
                $('.color#' + needlework.editPage.changedColor).children('.Thumbnail').css({ backgroundColor: needlework.validations.checkHEX() });
                $('.color#' + needlework.editPage.changedColor).children('.colorName').text(needlework.validations.checkName('#inputColorName'));
                $('.color#' + needlework.editPage.changedColor).children('.colorCode').text(needlework.validations.checkHEX());

                if ($(window).width() > 1100) {
                    $('#hideColor').animate({ left: "10%" }, 500);
                    $('#choiceColor').animate({ top: "-100%" }, 500);
                }
                else {
                    $('#containerRight').animate({ left: "105%" }, 500);
                }
            },
            error: function (data) {              
            }
        });

        $(".ChangeColor").slideUp();
    },

};



