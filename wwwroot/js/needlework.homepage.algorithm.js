needlework.homepage = needlework.homepage || {};

needlework.homepage.algorithm = {

    globals: needlework.homepage.globals,
	getContrastPattern: function(params) {

		// Contrast colors pattern creation algorithm

		var self = this,
			colCount = params.colCount,
			pallete = params.pallete,
			scale = params.scale,
			avgColorsMatrix,
			pattern,
			palletByPattern,
			contrList,
			newPalByContr,
			finalPattern,
			finalColCount;



		avgColorsMatrix = self.getAvgColors();
		if ($('#palletteSel').val() == "AllCol") {
			pallete = self.getPalleteOfMatrix({
				srcMatrix: avgColorsMatrix
			});

		}
		pattern = self.transSrcToPallet({
			srcImage: avgColorsMatrix,
			pallete: pallete
		});
		colCount = colCount > pallete.length ? pallete.length : colCount;
		colCount = colCount > pattern.data.length / 4 ? pattern.data.length / 4 : colCount;

		palletByPattern = self.getPalleteOfMatrixAndPal({
			srcMatrix: pattern,
			pallete: pallete
		});
		contrList = self.getMostContrastCol({
			pallete: palletByPattern
		});
		newPalByContr = self.getFirstNumPallete({
			palletByPattern: palletByPattern,
			contrList: contrList,
			colCount: colCount
		});
		finalPattern = self.transSrcToPallet({
			srcImage: avgColorsMatrix,
			pallete: newPalByContr
		});
		finalColCount = self.getColCountInSrcByPal({
			pattern: finalPattern,
			pallete: newPalByContr
		});
		finalPattern = self.drawPattern({
			imgData: finalPattern,
			scale: scale
		});


		return {
			pattern: finalPattern,
			colReport: finalColCount,
			usedPallete: newPalByContr
		};

	},
	getAvgPattern: function(params) {

		// Average colors pattern creation algorithm

		var self = this,
			colCount = params.colCount,
			pallete = params.pallete,
			scale = params.scale,
			avgColorsMatrix,
			pattern,
			palletByPattern,
			colCountInSrcByPal,
			palleteByCount,
			finalPattern,
			finalColCount;

		avgColorsMatrix = self.getAvgColors();
		if ($('#palletteSel').val() == "AllCol") {
			pallete = self.getPalleteOfMatrix({
				srcMatrix: avgColorsMatrix
			});
		}
		pattern = self.transSrcToPallet({
			srcImage: avgColorsMatrix,
			pallete: params.pallete
		});

		palletByPattern = self.getPalleteOfMatrixAndPal({
			srcMatrix: pattern,
			pallete: pallete
		});


		colCount = colCount > pallete.length ? pallete.length : colCount;
		colCount = colCount > pattern.data.length / 4 ? pattern.data.length / 4 : colCount;
		colCountInSrcByPal = self.getColCountInSrcByPal({
			pattern: pattern,
			pallete: pallete
		});
		palleteByCount = self.getPalleteByColCount({
			colCount: colCount,
			pallete: pallete,
			order: colCountInSrcByPal
		});
		finalPattern = self.transSrcToPallet({
			srcImage: avgColorsMatrix,
			pallete: palleteByCount
		});
		finalColCount = self.getColCountInSrcByPal({
			pattern: finalPattern,
			pallete: palleteByCount
		});
		finalPattern = self.drawPattern({
			imgData: finalPattern,
			scale: scale
		});


		return {
			pattern: finalPattern,
			colReport: finalColCount,
			usedPallete: palleteByCount
		};
	},
	getAvgColors: function() {

		// Gets average colors from source image fore each stitch

		var canvas = document.getElementById("srcImgCanvas"),
			ctx = canvas.getContext('2d'),
			stitchSize = needlework.homepage.utils.getStitchSize(),
			imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
			newImgData = new ImageData(Math.trunc(canvas.width / stitchSize), Math.trunc(canvas.height / stitchSize)),
			R = G = B = 0,
			blockSize = stitchSize * stitchSize,
			i = j = k = 0,
			curPos;



		for (i = 0; i < imageData.height; i += stitchSize) {
			for (j = 0; j < imageData.width; j += stitchSize) {
				R = G = B = 0;
				for (k = 0; k < blockSize; k++) {
					curPos = (i + Math.trunc(k / stitchSize)) * imageData.width * 4 + (j + k % stitchSize) * 4;
					R += imageData.data[curPos];
					G += imageData.data[curPos + 1];
					B += imageData.data[curPos + 2];
				}
				R = Math.trunc(R / blockSize);
				G = Math.trunc(G / blockSize);
				B = Math.trunc(B / blockSize);

				newImgData.data[Math.trunc(i / stitchSize) * newImgData.width * 4 + Math.trunc(j / stitchSize) * 4] = R;
				newImgData.data[Math.trunc(i / stitchSize) * newImgData.width * 4 + Math.trunc(j / stitchSize) * 4 + 1] = G;
				newImgData.data[Math.trunc(i / stitchSize) * newImgData.width * 4 + Math.trunc(j / stitchSize) * 4 + 2] = B;
				newImgData.data[Math.trunc(i / stitchSize) * newImgData.width * 4 + Math.trunc(j / stitchSize) * 4 + 3] = 255;
			}
		}
		return newImgData;
	},
	transSrcToPallet: function(params) {

		// Transfer all colors of source image no nearest colors in specified pallet

		var self = this,
			srcImage = params.srcImage,
			pallete = params.pallete;
		i = 0,
			rgb = undefined;


		for (i = 0; i < srcImage.data.length; i += 4) {
			rgb = [srcImage.data[i], srcImage.data[i + 1], srcImage.data[i + 2]];
			rgb = self.getSimilarColor({
				srcColor: rgb,
				pallete: pallete
			});
			srcImage.data[i] = rgb[0];
			srcImage.data[i + 1] = rgb[1];
			srcImage.data[i + 2] = rgb[2];
		}
		return srcImage;
	},
	getSimilarColor: function(params) {
		var self = this,
			srcColor = params.srcColor,
			pallete = params.pallete,
			simColPallet,
			simColor;


		simColPallet = self.getSimilarColorsArr({
			srcColorRGB: srcColor,
			pallete: pallete
		});
		simColor = self.findSimilarColor({
			srcColor: srcColor,
			similarColors: simColPallet
		});
		return simColor;
	},
	getSimilarColorsArr: function(params) {

		var minR = minG = minB = 255,
			similarColors = [],
			pallete = params.pallete,
			srcColorRGB = params.srcColorRGB,
			i = 0,
			index = 0;

		for (i = 0; i < pallete.length; i++) {
			if (Math.abs(pallete[i][0] - srcColorRGB[0]) < minR) minR = Math.abs(pallete[i][0] - srcColorRGB[0]);
			if (Math.abs(pallete[i][1] - srcColorRGB[1]) < minG) minG = Math.abs(pallete[i][1] - srcColorRGB[1]);
			if (Math.abs(pallete[i][2] - srcColorRGB[2]) < minB) minB = Math.abs(pallete[i][2] - srcColorRGB[2]);
		}
		for (i = 0; i < pallete.length; i++) {
			if (Math.abs(pallete[i][0] - srcColorRGB[0]) == minR) {
				index = similarColors.length;
				similarColors[index] = [];
				similarColors[index][0] = pallete[i][0];
				similarColors[index][1] = pallete[i][1];
				similarColors[index][2] = pallete[i][2];
			}

			if (Math.abs(pallete[i][1] - srcColorRGB[1]) == minG) {
				index = similarColors.length;
				similarColors[index] = [];
				similarColors[index][0] = pallete[i][0];
				similarColors[index][1] = pallete[i][1];
				similarColors[index][2] = pallete[i][2];
			}

			if (Math.abs(pallete[i][2] - srcColorRGB[2]) == minB) {
				index = similarColors.length;
				similarColors[index] = [];
				similarColors[index][0] = pallete[i][0];
				similarColors[index][1] = pallete[i][1];
				similarColors[index][2] = pallete[i][2];
			}
		}
		return similarColors;
	},
	findSimilarColor: function(params) {
		var minDiff = 255 * 3 * 100,
			similarColors = params.similarColors,
			srcColor = params.srcColor,
			pos = -1,
			i = 0,
			diff = 0;

		for (i = 0; i < similarColors.length; i++) {
			diff = 0.3 * (Math.abs(similarColors[i][0] - srcColor[0])) + 0.59 * (Math.abs(similarColors[i][1] - srcColor[1])) + 0.11 * (Math.abs(similarColors[i][2] - srcColor[2]));
			if (diff < minDiff) {
				minDiff = diff;
				pos = i;
			}
		}
		return similarColors[pos];
	},
	getPalleteOfMatrixAndPal: function(params) {

		// Return a new pallet created of unique matrix colors

		var self = this,
			palInMatrix = [],
			newPallete = [],
			srcMatrix = params.srcMatrix,
			pallete = params.pallete,
			i = 0,
			pos = 0,
			curCol,
			isColInPal;



		for (i = 0; i < srcMatrix.data.length; i += 4) {
			palInMatrix[i] = [];
			palInMatrix[i][0] = i;

			curCol = [srcMatrix.data[i], srcMatrix.data[i + 1], srcMatrix.data[i + 2]];
			isColInPal = self.isColInPallete({
				colRGB: curCol,
				pallete: pallete
			});
			if (self.isColInPallete({
					colRGB: curCol,
					pallete: pallete
				}) && self.isColNotInPallete({
					colRGB: curCol,
					pallete: newPallete
				})) {
				pos = newPallete.length;
				newPallete[pos] = [];
				newPallete[pos][0] = isColInPal[1][0];
				newPallete[pos][1] = isColInPal[1][1];
				newPallete[pos][2] = isColInPal[1][2];
				newPallete[pos][3] = isColInPal[1][3];
			}
		}
		return newPallete;

	},

	getPalleteOfMatrix: function(params) {

		// Return a new pallet created of unique matrix colors

		var self = this,
			palInMatrix = [],
			newPallete = [],
			srcMatrix = params.srcMatrix,
			i = 0,
			curCol,
			pos = 0;

		for (i = 0; i < srcMatrix.data.length; i += 4) {

			curCol = [srcMatrix.data[i], srcMatrix.data[i + 1], srcMatrix.data[i + 2]];

			if (self.isColNotInPallete({
					colRGB: curCol,
					pallete: newPallete
				})) {
				pos = newPallete.length;
				newPallete[pos] = [];
				newPallete[pos][0] = curCol[0];
				newPallete[pos][1] = curCol[1];
				newPallete[pos][2] = curCol[2];
				newPallete[pos][3] = "R: " + curCol[0] + "  G: " + curCol[1] + "  B: " + curCol[2];
			}
		}
		return newPallete;

	},
	isColInPallete: function(params) {

		// Checks if colorRGB is in pallete.

		var pallete = params.pallete,
			colRGB = params.colRGB,
			pallete = params.pallete,
			i = 0;

		for (i = 0; i < pallete.length; i++)
			if (pallete[i][0] == colRGB[0] && pallete[i][1] == colRGB[1] && pallete[i][2] == colRGB[2]) {
				return [true, pallete[i]];
			}
		return [false, colRGB];
	},
	isColNotInPallete: function(params) {

		// Checks if colorRGB is NOT in pallete.
		var pallete = params.pallete,
			colRGB = params.colRGB,
			i = 0;

		for (i = 0; i < pallete.length; i++)
			if (pallete[i][0] == colRGB[0] && pallete[i][1] == colRGB[1] && pallete[i][2] == colRGB[2]) return false;
		return true;
	},
	getMostContrastCol: function(params) {
		// Return list of most contrast colors in specified pallete

		var contrPal = [],
			pallete = params.pallete,
			i = 0,
			curCol;

		for (i = 0; i < pallete.length; i++) {
			contrPal[i] = [];
			curCol = [pallete[i][0], pallete[i][1], pallete[i][2]];
			contrPal[i][0] = needlework.homepage.utils.getColDiff({
				colRGB: curCol,
				pallete: pallete
			});
			contrPal[i][1] = i;
		}

		function sortFunction(a, b) {
			if (a[0] === b[0]) {
				return 0;
			} else {
				return (a[0] < b[0]) ? 1 : -1;
			}
		}
		contrPal.sort(sortFunction);
		return contrPal;

	},
	getFirstNumPallete: function(params) {

		// Return new pallet with specified number of most contrast colors from specified pallet

		var pallete = [],
			colCount = params.colCount,
			palletByPattern = params.palletByPattern,
			contrList = params.contrList,
			i = 0;

		colCount = colCount > contrList.length ? contrList.length : colCount;


		for (i = 0; i < colCount; i++) {
			pallete[i] = [];
			pallete[i][0] = palletByPattern[contrList[i][1]][0];
			pallete[i][1] = palletByPattern[contrList[i][1]][1];
			pallete[i][2] = palletByPattern[contrList[i][1]][2];
			pallete[i][3] = palletByPattern[contrList[i][1]][3];
		}
		return pallete;
	},
	drawPattern: function(params) {

		// Draws pattern from specified imageData with specified scale

		var width = params.imgData.width * params.scale,
			height = params.imgData.height * params.scale,
			blockSize = Math.pow(params.scale, 2),
			newImgWGrid = new ImageData(width, height),
			imgData = params.imgData,
			scale = params.scale,
			i = j = k = 0,
			curPosImg = 0,
			curPos = 0;

		for (i = 0; i < imgData.height; i++) {
			for (j = 0; j < imgData.width; j++) {
				curPos = i * imgData.width * 4 + j * 4;
				for (k = 0; k < blockSize; k++) {
					curPosImg = i * scale * width * 4 + j * scale * 4 + Math.trunc(k / scale) * width * 4 + (k % scale) * 4;

					newImgWGrid.data[curPosImg] = imgData.data[curPos];
					newImgWGrid.data[curPosImg + 1] = imgData.data[curPos + 1];
					newImgWGrid.data[curPosImg + 2] = imgData.data[curPos + 2];
					newImgWGrid.data[curPosImg + 3] = 255;
				}
			}

		}

		for (i = 1; i < imgData.height; i++) {
			for (j = 0; j < newImgWGrid.width; j++) {
				newImgWGrid.data[i * scale * width * 4 + j * 4] = 0;
				newImgWGrid.data[i * scale * width * 4 + j * 4 + 1] = 0;
				newImgWGrid.data[i * scale * width * 4 + j * 4 + 2] = 66;
				newImgWGrid.data[i * scale * width * 4 + j * 4 + 3] = 255;

			}
		}
		for (i = 0; i < imgData.width; i++) {
			for (j = 0; j < newImgWGrid.height * 2; j++) {
				newImgWGrid.data[i * scale * width * 4 + j * scale * 4] = 0;
				newImgWGrid.data[i * scale * width * 4 + j * scale * 4 + 1] = 0;
				newImgWGrid.data[i * scale * width * 4 + j * scale * 4 + 2] = 66;
				newImgWGrid.data[i * scale * width * 4 + j * scale * 4 + 3] = 255;

			}
		}
		return newImgWGrid;



	},
	getColCountInSrcByPal: function(params) {

		// Returns sorted count of each pallet color in specified pattern matrix

		var self = this,
			countColors = [],
			pallete = params.pallete,
			pattern = params.pattern,
			i = 0,
			rgb,
			num;


		for (var i = 0; i < pallete.length; i++) {
			countColors[i] = [];
			countColors[i][0] = 0;
			countColors[i][1] = i;

		}
		for (i = 0; i < pattern.data.length; i += 4) {
			rgb = [pattern.data[i], pattern.data[i + 1], pattern.data[i + 2]];
			num = self.checkColInPal({
				colRGB: rgb,
				pallete: pallete
			});
			if (num != -1) {
				countColors[num][0] += 1;
			}
		}

		function sortFunction(a, b) {
			if (a[0] === b[0]) {
				return 0;
			} else {
				return (a[0] < b[0]) ? 1 : -1;
			}
		}
		countColors.sort(sortFunction);
		return countColors;

	},
	checkColInPal: function(params) {

		// Checks if color is in pallet

		var self = this,
			colRGB = params.colRGB,
			pallete = params.pallete,
			i = 0;

		for (i = 0; i < pallete.length; i++) {
			if (self.compareTwoCol({
					col1: colRGB,
					col2: pallete[i]
				})) return i;
		}
		return -1;
	},
	compareTwoCol: function(params) {

		// Checks if two colors are same
		var col1 = params.col1,
			col2 = params.col2;

		if (col1[0] == col2[0] && col1[1] == col2[1] && col1[2] == col2[2]) return true;
		else return false;
	},
	getPalleteByColCount: function(params) {

		// Returns new pallete with specified number of most used colors in specified pattern

		var newPallete = [],
			colCount = params.colCount,
			pallete = params.pallete,
			order = params.order,
			i = 0;

		for (i = 0; i < colCount; i++) {
			newPallete[i] = [];
			newPallete[i][0] = pallete[order[i][1]][0];
			newPallete[i][1] = pallete[order[i][1]][1];
			newPallete[i][2] = pallete[order[i][1]][2];
			newPallete[i][3] = pallete[order[i][1]][3];
		}
		return newPallete;
	},
	testAlert: function() {
		alert("asdasd");
	}
};