needlework.homepage = needlework.homepage || {};

needlework.homepage.utils = {


    updateTab: function () {

        // Updates image if new one was loaded not on pattern creation tab
        var globals = needlework.homepage.globals,
			drawing = needlework.homepage.drawing;

        switch (globals.prevTab) {
            case 1:
                {
                    drawing.fillAdjImgFromBuffer();
                    drawing.loadEditCanvas();
                    needlework.homepage.utils.resetAjdustmentSettings();
                    break;
                }
            case 2:
                {
                    drawing.fillDrawFromCanvas('drawImgCanvasBuffer');
                    break;
                }
            case 3:
                {
                    drawing.fillCropFromCanvas('drawImgCanvasBuffer');
                    break;
                }

        }
    },
    loadCanvas: function (params) {
        var canvasId = params.canvasId,
			canvasDiv = params.canvasDiv,
			canvas = $('#' + canvasId).get(0),
			context = canvas.getContext('2d'),
			border = parseInt(getComputedStyle($('#' + canvasDiv).get(0), null).getPropertyValue('border-Width'));
        canvas.width = $('#' + canvasDiv).get(0).offsetWidth - border * 2 - 30;
        canvas.height = $('#' + canvasDiv).get(0).offsetHeight - border * 2 - 30;

        //canvasAddMouseZoom(canvas, canvasDiv);


    },
    showBlocks: function (canvasId) {

        // Shows canvases after loading image or creating pattern
        var self = this;

        self.showDiv("tabs");

        switch (canvasId) {
            case "srcImgCanvas": {
                $('.uploadedSection').css({ display: "block" });
                self.showDiv("patternSettings");
                self.showDiv("srcImgCanvasDiv");
                break;
            }
            case "patternImgCanvas": {
                $('#rightPatternCreation').css({ display: "block" });
                self.showDiv("patternImgCanvasDiv");
                self.showDiv("patternCreated");
                break;
            }
        }
    },
    showDiv: function (divId) {

        // Shows specified div

        $('#' + divId).css('visibility', 'visible');
    },
    getColDiff: function (params) {

        // Returns color differense (from a human point of view)

        var colRGB = params.colRGB,
			pallete = params.pallete,
			diff = 0,
			i = 0;

        for (i = 0; i < pallete.length; i++) {
            diff += Math.abs(pallete[i][0] - colRGB[0]) * 0.3 + Math.abs(pallete[i][0] - colRGB[0]) * 0.59 + Math.abs(pallete[i][1] - colRGB[2]) * 0.11;
        }
        return diff;
    },
    getStitchSize: function () {

        // Gets stitch size in pixels for current source picture

        var canvas = document.getElementById("srcImgCanvas"),
			stitchesCount = Math.trunc(document.getElementById("stitchesCount").value),
			part = canvas.width / stitchesCount % 1,
			size = part < 0.5 ? Math.trunc(canvas.width / stitchesCount) : Math.trunc(canvas.width / stitchesCount + 1);

        return size == 0 ? 1 : size;
    },
    getAdjustmentSettings: function () {

        // Returns adjustment settings

        var settings = {};

        settings.brightnessVal = $('#brightnessVal').val();
        settings.contrastVal = $('#contrastVal').val();
        settings.hueVal = $('#hueVal').val();
        settings.saturationVal = $('#saturationVal').val();
        settings.vibranceVal = $('#vibranceVal').val();
        settings.denoiseVal = $('#denoiseVal').val();
        settings.UMRadiusVal = $('#UMRadiusVal').val();
        settings.UMStrengthVal = $('#UMStrengthVal').val();
        settings.noiseVal = $('#noiseVal').val();
        settings.sepiaVal = $('#sepiaVal').val();
        settings.vigSizeVal = $('#vigSizeVal').val();
        settings.vigAmountVal = $('#vigAmountVal').val();

        return settings;

    },
    resetAjdustmentSettings: function () {

        // Resets all adjustment settings

        $('#brightnessVal').val(0);
        $('#contrastVal').val(0);
        $('#hueVal').val(0);
        $('#saturationVal').val(0);
        $('#vibranceVal').val(0);
        $('#denoiseVal').val(0);
        $('#UMRadiusVal').val(0);
        $('#UMStrengthVal').val(0);
        $('#noiseVal').val(0);
        $('#sepiaVal').val(0);
        $('#vigSizeVal').val(0);
        $('#vigAmountVal').val(0);

        $('#brightnessShowVal').text(0);
        $('#contrastShowVal').text(0);
        $('#hueShowVal').text(0);
        $('#saturationShowVal').text(0);
        $('#vibranceShowVal').text(0);
        $('#denoiseShowVal').text(0);
        $('#UMRadiusShowVal').text(0);
        $('#UMRadiusShowVal').text(0);
        $('#noiseShowVal').text(0);
        $('#sepiaShowVal').text(0);
        $('#vigSizeShowVal').text(0);
        $('#vigAmountShowVal').text(0);

    },
    cropImg: function () {

        // Crops image

        var globals = needlework.homepage.globals,
			selection = globals.crop.cropper('getData', 'true'),
			canvas,
			ctx,
			img,
			imageData;

        selection.x = selection.x < 0 ? 0 : selection.x;
        selection.y = selection.y < 0 ? 0 : selection.y;
        globals.crop.cropper('destroy');

        //canvas = document.createElement('canvas');

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        img = $('#imgCrop').get(0);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(selection.x, selection.y, selection.x + selection.width, selection.x + selection.height);
        canvas.width = selection.width;
        canvas.height = selection.height;
        ctx.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
        needlework.homepage.events.imgCropInit();
    },
    resetCropImg: function () {
        var crop = needlework.homepage.globals.crop;
        crop.cropper('destroy');
        needlework.homepage.drawing.fillCropFromCanvas('drawImgCanvasBuffer');
        crop.cropper();
    },
    resetAjd: function () {

        // Resets adjustment settings

        needlework.homepage.utils.resetAjdustmentSettings();
        needlework.homepage.drawing.loadEditCanvas();
    },
    fullImgReset: function () {

        // Fully resets all changes applied to source image
        var drawing = needlework.homepage.drawing;

        drawing.fillDrawImgBuffer();
        drawing.updSrcImgFromBuffer();
    },
    isNumberKey: function (evt) {

        // Check input fields

        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },
    loadPalettes: function () {
        var self = this;
        $.ajax({
            url: '/Palettes/GetPalettes',
            type: 'GET',
            data: {},
            dataType: 'json',
            success: function (result) {
                self.fillPalettesList(result);

            }
        });
    },
    fillPalettesList: function (list) {
        $('#palletteSel').empty();
        for (var i = 0; i < list.Palettes.length; i++) {
            $('#palletteSel').append("<option value='" + list.Palettes[i].Id + "'>" + list.Palettes[i].Name + "</option>");
        }
    },
    getPalletefromDB: function () {
        var paletteId = $('#palletteSel').val();
        $.ajax({
            url: 'Palettes/GetRGBColors',
            type: 'GET',
            async: false,
            data: { paletteId: paletteId },
            dataType: 'json',
            success: function (result, status) {
                needlework.homepage.globals.workingPallete = result.RGBColors;
                //callback(result);
            },
        });
    }
}