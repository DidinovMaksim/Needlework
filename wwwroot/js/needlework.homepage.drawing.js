needlework.homepage = needlework.homepage || {};

needlework.homepage.drawing = {

	fillCanvasWImg: function(canvasId, dataURL) {

		// Fills defined canvas with image

		var canvas = $('#' + canvasId).get(0),
			context = canvas.getContext('2d'),
			self = this,
			imageObj = new Image(),
			globals = needlework.homepage.globals,
			utils = needlework.homepage.utils;

		context.clearRect(0, 0, canvas.width, canvas.height);


		imageObj.onload = function() {
			canvas.width = imageObj.width;
			canvas.height = imageObj.height;
			context.drawImage(this, 0, 0, imageObj.width, imageObj.height);
			self.fillBuffers();

			if (globals.prevTab != 0)
				utils.updateTab();
		};

		imageObj.src = dataURL;
		utils.showBlocks(canvasId);

		$('body').animate({ scrollTop: $('#tabs').offset().top - 70 }, 600);

	},
	fillBuffers: function() {

		// Fills buffer canvases
		var self = this;

		self.fillSourceImgBuffer();
		self.fillDrawImgBuffer();
	},
	fillSourceImgBuffer: function() {

		// Fills source image canvas buffer

		var canvas = $('#srcImgCanvasBuffer').get(0),
			srcCanv = $('#srcImgCanvas').get(0),
			img = new Image;
		img.src = srcCanv.toDataURL();

		canvas.width = srcCanv.width;
		canvas.height = srcCanv.height;
		canvas.getContext('2d').drawImage(img, 0, 0);
		canvas.style.display = 'none';

	},
	fillDrawImgBuffer: function() {

		// Fills draw (transfer) canvas buffer

		var canvas = $('#drawImgCanvasBuffer').get(0),
			srcCanv = $('#srcImgCanvasBuffer').get(0),
			img = new Image;
		img.src = srcCanv.toDataURL();

		canvas.width = srcCanv.width;
		canvas.height = srcCanv.height;
		canvas.getContext('2d').drawImage(img, 0, 0);
		canvas.style.display = 'none';

	},
	fillAdjImgFromBuffer: function() {

		// Fills adjustment image canvas buffer

		var canvas = $('#adjImgCanvasBuffer').get(0),
			srcCanv = $('#drawImgCanvasBuffer').get(0),
			img = new Image;
		img.src = srcCanv.toDataURL();

		canvas.width = srcCanv.width;
		canvas.height = srcCanv.height;
		canvas.getContext('2d').drawImage(img, 0, 0);
		canvas.style.display = 'none';
	},
	loadEditCanvas: function() {

		// Loads adjustment canvas with buffer image

		var srcCanv = $('#adjImgCanvasBuffer').get(0),
			img = new Image,
			editCanv = $('#editImgCanvas').get(0);
		img.src = srcCanv.toDataURL();
		editCanv.width = srcCanv.width;
		editCanv.height = srcCanv.height;
		editCanv.getContext('2d').drawImage(img, 0, 0);
	},

	fillCanvasWImgFromUrl: function(e) {
		var url = $("#imgUrl").val(),
			img = new Image(),
			canvas,
			dataURL;
		img.onload = function() {

			canvas = document.createElement('canvas');

			canvas.width = this.width;
			canvas.height = this.height;

			canvas.getContext('2d').drawImage(img, 0, 0);

			dataURL = canvas.toDataURL();
			needlework.homepage.drawing.fillCanvasWImg("srcImgCanvas", dataURL);
		}

		img.setAttribute('crossOrigin', 'anonymous');
		img.src = url;
	},
	fillCanvasWImgFromFile: function(e) {

		var ctx = $('#srcImgCanvas').get(0).getContext('2d')
		img = new Image,
			self = this;
		img.onload = function() {
			needlework.homepage.drawing.fillCanvasWImg("srcImgCanvas", img.src);

		}
		img.src = URL.createObjectURL(e.target.files[0]);
	},

	fillCanvasText: function(canvasId, text) {

		// Fills defined canvas with text

		var canvas = $('#' + canvasId).get(0),
			context = canvas.getContext('2d');
		context.font = "32px Arial";
		context.fillText(text, canvas.width / 2, canvas.height / 2);
	},
	createReportByCol: function(params) {


		// Main function, that creates report of colors used in end pattern.

		var canv = $('#colorsReport').get(0),
			ctx = canv.getContext('2d'),
			canvPDF = $('#colorsReportForPDF').get(0),
			ctxPDF = canvPDF.getContext('2d'),
			colCount = params.colCount,
			order = params.order,
			pallete = params.pallete,
			i = 0,
			text,
			cc;
		canv.width = 200;
		canv.height = 80 + 40 * order.length;
		canvPDF.width = 200;
		canvPDF.height = 80 + 40 * order.length;

		for (i = 0; order[i] != undefined && order[i][0] != 0; i++) {
			ctx.fillStyle = "rgba(" + pallete[order[i][1]][0] + ", " + pallete[order[i][1]][1] + ", " + pallete[order[i][1]][2] + ", 255)";
			ctx.fillRect(20, 40 + i * 40, 20, 20);

			ctxPDF.fillStyle = "rgba(" + pallete[order[i][1]][0] + ", " + pallete[order[i][1]][1] + ", " + pallete[order[i][1]][2] + ", 255)";
			ctxPDF.fillRect(20, 40 + i * 40, 20, 20);

			text = "x" + order[i][0] + "	 " + pallete[order[i][1]][3];

			ctx.fillStyle = "rgba(255, 255, 255, 255)";
			ctxPDF.fillStyle = "rgba(0, 0, 0, 255)";
			ctx.fillText(text, 45, 40 + i * 40 + 12);
			ctxPDF.fillText(text, 45, 40 + i * 40 + 12);
		}
		cc = $("#colorsCountRep").get(0);
		cc.value = i;
	},
	applyAdjustment: function() {

		// Applies all adjustment setting 

		var utils = needlework.homepage.utils,
			settings = utils.getAdjustmentSettings(),
			buffCanv = $('#adjImgCanvasBuffer').get(0),
			img = new Image,
			adjustCanv = fx.canvas(),
			texture,
			newImage = new Image(),
			editCanv;


		img.src = buffCanv.toDataURL();


		texture = adjustCanv.texture(img);

		if (settings.brightnessVal != 0 || settings.contrastVal != 0) {
			adjustCanv.draw(texture).brightnessContrast(settings.brightnessVal, settings.contrastVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);
		}
		if (settings.hueVal != 0 || settings.saturationVal != 0) {
			adjustCanv.draw(texture).hueSaturation(settings.hueVal, settings.saturationVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);
		}
		if (settings.vibranceVal != 0) {
			adjustCanv.draw(texture).vibrance(settings.vibranceVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);

		}
		if ($('#denoiseCheck').prop("checked")) {
			adjustCanv.draw(texture).denoise(settings.denoiseVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);
		}
		if (settings.noiseVal != 0) {
			adjustCanv.draw(texture).noise(settings.noiseVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);
		}
		if (settings.sepiaVal != 0) {
			adjustCanv.draw(texture).sepia(settings.sepiaVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);

		}
		if (settings.vigSizeVal != 0 || settings.vigAmountVal != 0) {
			adjustCanv.draw(texture).vignette(settings.vigSizeVal, settings.vigAmountVal).update();
			img.src = adjustCanv.toDataURL('image/png');
			texture = adjustCanv.texture(img);

		}

		newImage = new Image();
		newImage.src = adjustCanv.toDataURL('image/png');
		editCanv = $('#editImgCanvas').get(0);
		editCanv.getContext('2d').drawImage(newImage, 0, 0);
	},
	fillDrawFromCanvas: function(canvasId) {

		// Fills Simple Canvas with buffer image

		var canvas = $('#' + canvasId).get(0),
			newImage = new Image(),
			globals = needlework.homepage.globals;
		newImage.src = canvas.toDataURL();
		globals.lc.setImageSize(canvas.width, canvas.height);
		globals.lc.saveShape(LC.createShape('Image', {
			x: 0,
			y: 0,
			image: newImage
		}));
	},
	fillCropFromCanvas: function(canvasId) {

		// Fills crop plugin with buffer image

	    var canvas = $('#' + canvasId).get(0),
			img = $('#imgCrop').get(0),
            crop = needlework.homepage.globals.crop;
	    if (crop == undefined) {
	        img.src = canvas.toDataURL();
	    }
	    else {
	        crop.cropper('destroy');
	        img.src = canvas.toDataURL();
	        crop.cropper();
	    }
		
	},
	updSrcImgFromBuffer: function() {

		// Updates source image from buffer

		var srcCanv = $('#srcImgCanvas').get(0),
			buffCanvas = $('#drawImgCanvasBuffer').get(0),
			img = new Image;
		img.src = buffCanvas.toDataURL();
		srcCanv.width = buffCanvas.width;
		srcCanv.height = buffCanvas.height;
		srcCanv.getContext('2d').drawImage(img, 0, 0);
	},
	saveFromDrawToBuff: function() {

		// Saves all changes from Simple Canvas to buffer canvas

		var buffer = $('#drawImgCanvasBuffer').get(0),
			img = new Image(),
			globals = needlework.homepage.globals;
		img.src = globals.lc.getImage().toDataURL();
		buffer.getContext('2d').drawImage(img, 0, 0);
	},
	saveFromEditToBuff: function() {

		// Saves all changes from adjustment canvas to buffer canvas

		var buffer = $('#drawImgCanvasBuffer').get(0),
			editCanv = $('#editImgCanvas').get(0),
			img = new Image();

		img.src = editCanv.toDataURL();
		buffer.getContext('2d').drawImage(img, 0, 0);
	},
	saveFromCropToBuff: function() {

		// Saves all changes from crop to buffer

		var buffer = $('#drawImgCanvasBuffer').get(0),
			img = $('#imgCrop').get(0);
		buffer.width = img.width;
		buffer.height = img.height;
		buffer.getContext('2d').drawImage(img, 0, 0);
	},
	displayPattern: function(pattern) {

		// Displays specified pattern in patternCanvas

		var canvasPat = $("#patternImgCanvas").get(0),
			ctxPat = canvasPat.getContext('2d');

		canvasPat.width = pattern.width;
		canvasPat.height = pattern.height;
		ctxPat.putImageData(pattern, 0, 0);

	}




}