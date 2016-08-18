needlework = needlework || {};

needlework.homepage = {
    createPattern: function () {

        // Main function of pattern creation

        var drawing = needlework.homepage.drawing,
            algorithm = needlework.homepage.algorithm,
            utils = needlework.homepage.utils,
            globals = needlework.homepage.globals,
            palletes = needlework.homepage.palletes,
            algo = document.getElementById('patAlgo').value,
			params = {},
			finalPattern;

        //utils.getPalletefromDB();
        globals.workingPallete = palletes.anchor;

        if (globals.workingPallete.length == 0) {
            alert("Palette is empty!");
            return;

        }

        params = {
            colCount: document.getElementById('colorsCount').value,
            scale: document.getElementById('patScale').value,
            pallete: globals.workingPallete
        };
        console.log(params);

        if (algo == "Contrast")
            finalPattern = algorithm.getContrastPattern(params);

        if (algo == "Average")
            finalPattern = algorithm.getAvgPattern(params);

        drawing.displayPattern(finalPattern.pattern);
        needlework.homepage.utils.showBlocks("patternImgCanvas");

        drawing.createReportByCol({
            colCount: params.colCount,
            order: finalPattern.colReport,
            pallete: finalPattern.usedPallete
        });
    },
    savePatternFromServer: function () {


        var self = this,
            srcImgDataFull = $('#srcImgCanvas').get(0).toDataURL(),
            patternImgDataFull = $('#patternImgCanvas').get(0).toDataURL(),
            reportFull = $('#colorsReportForPDF').get(0).toDataURL(),
            srcImgData = [],
            patternImgData = [],
            report = [],
            imgData,
            strLength = 50000,
            i = 0;

        for (i = 0; i < srcImgDataFull.length; i += strLength) {
            srcImgData[srcImgData.length] = srcImgDataFull.substring(i, i + strLength);
        }
        for (i = 0; i < patternImgDataFull.length; i += strLength) {
            patternImgData[patternImgData.length] = patternImgDataFull.substring(i, i + strLength);
        }
        for (i = 0; i < reportFull.length; i += strLength) {
            report[report.length] = reportFull.substring(i, i + strLength);
        }
        


        imgData = {
            srcImgData: srcImgData,
            patternImgData: patternImgData,
            report: report
        };
        console.log(imgData);
        var test = {
            srcImgData: JSON.stringify(imgData.srcImgData),
            patternImgData: JSON.stringify(imgData.patternImgData),
            report: JSON.stringify(imgData.report),
        };
        console.log(test);
        //$.download('NewPDF/CreatePDF', imgData);
        //console.log(JSON.stringify(imgData));
        /*$.ajax({
            url: 'NewPDF/CreatePDF',
            type: 'POST',
            async: false,
            data: imgData,
            //cache: false,
            //dataType: 'json',
            //contentType: 'application/pdf',
            success: function (result, status) {
                //console.log(result);
                console.log(status);
            },

            //processData: false, 
            //contentType: false,
        });*/
        $.ajax({
            url: 'NewPDF/CreatePDF',
            type: 'POST',
            data: imgData,
            success: function (data) {
                alert(data);
                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "testPDFfromServer.pdf";
                link.click();
            }
        });

    }

};
$(document).ready(function () {
    needlework.homepage.events.initAllOnLoad();

});