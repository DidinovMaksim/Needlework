needlework.createPDFJs = {
    createPDF: function () {
        //createPDF - save pages to pdf by click
        var doc = {},
            self = this;

        html2canvas($("#patternImgCanvas"), {
            onrendered: function () {
                var canvasList = {
                    patternImage: $('#patternImgCanvas').get(0),
                    originalImage: $('#srcImgCanvas').get(0),
                    colorsReport: $('#colorsReport').get(0)
                };

                doc = self.createDOC(canvasList);
                doc.save('sample-file.pdf');
            }
        });
    },
    getInMm: function (value) {
        /*
        getInMm convert canvases element from pixels to mm size, it`s 
        important to print images on pdf
        */
        var PX = 0.264583;

        if (typeof value == 'number') {
            return value * PX;
        }
        else {
            return 'Value is not a number';
        }
    },
    createDOC: function (canvasList) {
        /*
        createDOC function get all canvases and deside in which 
        format of pdf page it will be printed
        */
        var spaces = 0,
            doc = {},
            WIDTHA4 = 210,
            HEIGHTA4 = 297,
            self = this,
            canvasesParameters = {
                pattern: {
                    width: canvasList.patternImage.width,
                    height: canvasList.patternImage.height,
                    data: canvasList.patternImage.toDataURL('image/jpg'),
                },
                image: {
                    width: canvasList.originalImage.width,
                    height: canvasList.originalImage.height,
                    data: canvasList.originalImage.toDataURL('image/jpg'),
                },
                colorsList: {
                    height: canvasList.colorsReport.height,
                    width: canvasList.colorsReport.width,
                    context: canvasList.colorsReport.getContext('2d'),
                    data: canvasList.colorsReport.toDataURL('image/jpg'),
                }
            };

        if ((self.getInMm(canvasesParameters.pattern.width) < WIDTHA4) && (self.getInMm(canvasesParameters.image.width) < WIDTHA4)) {
            doc = self.writeInA4Format(canvasesParameters);
        }
        else {
            doc = self.writeInSizebleFormat(canvasesParameters);
        }

        return doc;
    },
    cutColorReport: function (cutParameters) {
        /* cutColorReport it`s function which cut colors report canvas 
        on many smaller part to write it in pdf, if colors report canvas 
        bigger than pdf page
        value it`s pattern or image size, which of them decieded in writeInSizebleFormat()
        */
        var value = cutParameters.value,
            colorsList = cutParameters.colorsList,
            doc = cutParameters.doc;

        $(".uploadedSection").append("<canvas id = 'hiddenCanvas' style=\"display:none\" width=" + colorsList.width + " height=" + value.height + "></canvas>");

        var hiddenCanvas = $('#hiddenCanvas').get(0);
        hiddenContext = hiddenCanvas.getContext('2d'),
        space = 5,
        self = this,
        reportCount = Math.trunc(value.width / colorsList.width),
        reportCount = Math.trunc(value.width / (colorsList.width + space * reportCount)),
        reportOnPage = 0;

        doc.setFontSize(12);
        doc.text(5, 7, "Colors list:");

        for (var i = 0; i < colorsList.height; i += value.height) {
            hiddenData = colorsList.context.getImageData(0, i, colorsList.width, i + value.height);
            hiddenContext.putImageData(hiddenData, 0, 0);

            if (reportOnPage <= reportCount) {
                doc.addImage(hiddenCanvas.toDataURL("image/png"), 'PNG', self.getInMm(colorsList.width + space) * reportOnPage + 5, 8);
                reportOnPage++;
            }
            else {
                doc.addPage();
                doc.text(5, 7, "Colors list:");
                reportOnPage = 0;
                doc.addImage(hiddenCanvas.toDataURL("image/png"), 'PNG', self.getInMm(colorsList.width + space) * reportOnPage + 5, 8);
                reportOnPage++;
            }
        }

        $('#hiddenCanvas').remove();

        return doc;
    },
    addPatternAndOriginal: function (data, doc) {
        //this function add pattern and original image to doc object
        doc.addImage(data.patternImage, 'JPEG', 5, 5);
        doc.addPage();
        doc.setFontSize(14);
        doc.text(5, 7, "Original image");
        doc.addImage(data.originalImage, 'JPEG', 5, 10);
        doc.addPage();

        return doc;
    },
    writeInA4Format: function (canvasesParameters) {
        //function which create pdf in A4 format
        var doc = {},
            spaces = 0,
            A4 = {
                width: 793.7017,
                height: 1122.5210
            },
            //it`s smaller size of A4 format, 
            //to print colors report with considering spaces
            fakeA4 = {
                width: 603,
                height: 1040
            },
            self = this,
            pattern = canvasesParameters.pattern,
            image = canvasesParameters.image,
            colorsList = canvasesParameters.colorsList,
            data = {
                patternImage: pattern.data,
                originalImage: image.data,
            };

        doc = new jsPDF('p', 'mm', 'a4');
        spaces = (self.getInMm(A4.width) - self.getInMm(pattern.width)) / 2;
        doc.addImage(data.patternImage, 'JPEG', spaces, 10);
        doc.addPage();
        doc.setFontSize(14);
        doc.text(5, 7, "Original image");
        doc.addImage(data.originalImage, 'JPEG', 5, 10);
        doc.addPage();
        doc = self.cutColorReport(fakeA4, colorsList, doc);

        return doc;
    },
    writeInSizebleFormat: function (canvasesParameters) {
        //function which create pdf by pattern or original image size
        var doc = {},
            pattern = canvasesParameters.pattern,
            image = canvasesParameters.image,
            colorsList = canvasesParameters.colorsList,
            data = {
                patternImage: pattern.data,
                originalImage: image.data
            },
            cutParameters = {
                value: {},
                colorsList: colorsList,
                doc: {}
            },
            self = this,
            orientation = pattern.width >= pattern.height ? 'l' : 'p';

        if (pattern.width > image.width) {
            doc = new jsPDF(orientation, 'mm', [self.getInMm(pattern.width) + 10, self.getInMm(pattern.height) + 10]);
            doc = self.addPatternAndOriginal(data, doc);

            for (i = 0; i <= 100; i++) {
                if (pattern.height % 80 != 0) {
                    pattern.height--;
                }
            };

            cutParameters.doc = doc;
            cutParameters.value = pattern;
            doc = self.cutColorReport(cutParameters);

        } else {
            doc = new jsPDF(orientation, 'mm', [self.getInMm(image.width) + 10, self.getInMm(image.height) + 20]);

            for (i = 0; i <= 100; i++) {
                if (image.height % 80 != 0) {
                    image.height--;
                }
            };

            cutParameters.doc = doc;
            cutParameters.value = image;

            doc = self.addPatternAndOriginal(data, doc);
            doc = self.cutColorReport(cutParameters);
        }

        return doc;
    },
}

needlework.createPDFJs.bindActions = {
    savePDF: function () {
        $('.savePattern').click(function () {
            needlework.createPDFJs.createPDF();
        });
    },
}

needlework.createPDFJs.bindActions.savePDF();













