needlework.homepage = needlework.homepage || {};

needlework.homepage.events = {

	initAllOnLoad: function() {
		var self = this,
			drawing = needlework.homepage.drawing,
			utils = needlework.homepage.utils;

		self.addTabsEvents();
		self.DnDInitialize();
		utils.loadCanvas({
			canvasId: "srcImgCanvas",
			canvasDiv: "srcImgCanvasDiv"
		});
		utils.loadCanvas({
			canvasId: "patternImgCanvas",
			canvasDiv: "patternImgCanvasDiv"
		});
		drawing.fillCanvasText("srcImgCanvas", "src");
		drawing.fillCanvasText("patternImgCanvas", "Pattern");
		self.fillCanvasWImgFromFileListener();

		utils.loadPalettes();
	},
	addTabsEvents: function() {
		var self = this,
			globals = needlework.homepage.globals,
			drawing = needlework.homepage.drawing,
			utils = needlework.homepage.utils;

		$("#tabs").tabs({
			activate: function(event, ui) {
				switch ($("#tabs").tabs('option', 'active')) {
					case 0:
						{
							drawing.updSrcImgFromBuffer();
							break;
						}
					case 1:
						{
							if (globals.adjEventsLoaded == false)
								self.addEditOnloadEvents();
							drawing.fillAdjImgFromBuffer();
							drawing.loadEditCanvas();
							utils.resetAjdustmentSettings();
							break;
						}
					case 2:
						{
							if (globals.lc == undefined)
								self.initDraw();
							drawing.fillDrawFromCanvas('drawImgCanvasBuffer');
							break;
						}
					case 3:
					    {
					        drawing.fillCropFromCanvas('drawImgCanvasBuffer');
							if (globals.crop == undefined)
								self.imgCropInit();
							break;
						}
				}

				globals.prevTab = $("#tabs").tabs('option', 'active');
			},
			beforeActivate: function() {
				switch (globals.prevTab) {
					case 1:
						{
							drawing.saveFromEditToBuff();
							break;
						}
					case 2:
						{
							drawing.saveFromDrawToBuff();
							break;
						}
					case 3:
						{
							drawing.saveFromCropToBuff();
							break;
						}
				}
			}
		});
	},
	DnDInitialize: function() {

		// Initializes drag and drop for dndHolder div


		var holder = $('#dndHolder').get(0),
			state = $('#status').get(0);

		if (typeof window.FileReader === 'undefined') {
			state.className = 'fail';
		} else {
			state.className = 'success';
			state.innerHTML = 'File API & FileReader available';
		}

		holder.ondragover = function () {
			this.className = 'hover';
			return false;
		};
		holder.ondragend = function() {
			this.className = '';
			return false;
		};
		holder.ondrop = function(e) {
			this.className = '';
			e.preventDefault();

			var file = e.dataTransfer.files[0],
				reader = new FileReader();

			reader.onload = function(event) {
				needlework.homepage.drawing.fillCanvasWImg("srcImgCanvas", event.target.result);

			};
			reader.readAsDataURL(file);
			dragBoxText = $('#dragBoxText').get(0);
		};
	},
	fillCanvasWImgFromFileListener: function() {
		var input = $('#fileImg').get(0);
		input.addEventListener('change', needlework.homepage.drawing.fillCanvasWImgFromFile);
	},
	initDraw: function() {
		var globals = needlework.homepage.globals;

		// Initializes Simple Canvas plugin for drawing on buffer image
		var editCanv = $('#drawImgCanvasBuffer').get(0);


		if (globals.lc != undefined)
			globals.lc.teardown();


		$('#literally').width(editCanv.width + 65);
		$('#literally').height(editCanv.height < 550 ? 550 : editCanv.height + 30);

		globals.lc = LC.init(
			$('#literally').get(0), {
				imageURLPrefix: '../lib/LiterallyCanvas/img',
				imageSize: {
					width: editCanv.width,
					height: editCanv.height
				}
			}
			//{imageSize: {width: editCanv.width, height: editCanv.height}}
		);
	},

	addEditOnloadEvents: function() {
		var	globals = needlework.homepage.globals,
			drawing = needlework.homepage.drawing;

		// Adds events on each adjustment trackBar change

		$('#brightnessVal').change(function(event) {
			$('#brightnessShowVal').text($('#brightnessVal').val());
			drawing.applyAdjustment();
		});
		$('#contrastVal').change(function(event) {
			$('#contrastShowVal').text($('#contrastVal').val());
			drawing.applyAdjustment();
		});
		$('#hueVal').change(function(event) {
			$('#hueShowVal').text($('#hueVal').val());
			drawing.applyAdjustment();
		});
		$('#saturationVal').change(function(event) {
			$('#saturationShowVal').text($('#saturationVal').val());
			drawing.applyAdjustment();
		});
		$('#vibranceVal').change(function(event) {
			$('#vibranceShowVal').text($('#vibranceVal').val());
			drawing.applyAdjustment();
		});
		$('#denoiseVal').change(function(event) {
			$('#denoiseShowVal').text($('#denoiseVal').val());
			drawing.applyAdjustment();
		});
		$('#UMRadiusVal').change(function(event) {
			$('#UMRadiusShowVal').text($('#UMRadiusVal').val());
			drawing.applyAdjustment();
		});
		$('#UMStrengthVal').change(function(event) {
			$('#UMRadiusShowVal').text($('#UMStrengthVal').val());
			drawing.applyAdjustment();
		});
		$('#noiseVal').change(function(event) {
			$('#noiseShowVal').text($('#noiseVal').val());
			drawing.applyAdjustment();
		});
		$('#sepiaVal').change(function(event) {
			$('#sepiaShowVal').text($('#sepiaVal').val());
			drawing.applyAdjustment();
		});
		$('#vigSizeVal').change(function(event) {
			$('#vigSizeShowVal').text($('#vigSizeVal').val());
			drawing.applyAdjustment();
		});
		$('#vigAmountVal').change(function(event) {
			$('#vigAmountShowVal').text($('#vigAmountVal').val());
			drawing.applyAdjustment();
		});

		globals.adjEventsLoaded = true;
	},



	imgCropInit: function () {
		var	globals = needlework.homepage.globals;

		// Initializes crop image plugin

		/*globals.crop = $('#imgCrop').imgAreaSelect({
			handles: true,
			instance: true
		});*/
		//$('#imgCrop').cropper();
		globals.crop = $('#imgCrop');
		globals.crop.cropper('destroy');
		globals.crop.cropper();

	},

}