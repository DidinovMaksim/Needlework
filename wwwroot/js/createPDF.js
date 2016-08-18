createPDF();

//createPDF - save pages to pdf by click
function createPDF() {
    var doc = {};      
    $(document).on('click', '.savePattern', function() { 
        html2canvas($("#patternImgCanvas"), {
            onrendered: function() { 
                var canvasList = {
                    	patternImage: $('#patternImgCanvas').get(0),
                    	originalImage: $('#srcImgCanvas').get(0),
                    	colorsReport: $('#colorsReportForPDF').get(0)
                    };

                doc = createDOC(canvasList);
                doc.save('sample-file.pdf');
            } 
        });
    });
} 

/*
getInMm convert canvases element from pixels to mm size, it`s 
important to print images on pdf
*/
function getInMm(value) {
	var PX =  0.264583;
	
	if(typeof value == 'number'){
		return value*PX;
	}
	else{
		return 'Value is not a number';
	}
}

/*
createDOC function get all canvases and deside in which 
format of pdf page it will be printed
*/
function createDOC(canvasList) {
    var spaces = 0,
        doc = {},
        WIDTHA4 = 210,
        HEIGHTA4 = 297,
        data = {
        	patternImage: canvasList.patternImage.toDataURL('image/jpg'),
        	originalImage: canvasList.originalImage.toDataURL('image/jpg'),
        	colorsList: canvasList.colorsReport.toDataURL('image/jpg'),
        },
   		pattern = {
    		width: canvasList.patternImage.width,
    		height: canvasList.patternImage.height,
    	},
    	image = {
    		width: canvasList.originalImage.width,
    		height: canvasList.originalImage.height,
    	},
    	colorsList = {
    		height: canvasList.colorsReport.height,
    		width: canvasList.colorsReport.width,
    		context: canvasList.colorsReport.getContext('2d'),
    	};

    if((getInMm(pattern.width) < WIDTHA4) && (getInMm(image.width) < WIDTHA4)){
    	doc = writeInA4Format(pattern, image, data, colorsList);
    }
    else {
       	doc = writeInSizebleFormat(pattern, image, data, colorsList);  	
    }

    return doc;
}

/* cutColorReport it`s function which cut colors report canvas 
on many smaller part to write it in pdf, if colors report canvas 
bigger than pdf page
value it`s pattern or image size, which of them decieded in writeInSizebleFormat()
*/
function cutColorReport(value, colorsList, doc) {
	$(".uploadedSection").append("<canvas id = 'hiddenCanvas' style=\"display:none\" width="+colorsList.width+" height="+value.height+"></canvas>");

    var hiddenCanvas = $('#hiddenCanvas').get(0);
    	hiddenContext = hiddenCanvas.getContext('2d'),
        space = 5,
        reportCount = Math.trunc(value.width/colorsList.width),
        reportCount = Math.trunc(value.width/(colorsList.width + space * reportCount)),
        reportOnPage = 0;

    doc.setFontSize(12);
    doc.text(5,7,"Colors list:");

    for(var i = 0; i < colorsList.height; i += value.height) {
        hiddenData = colorsList.context.getImageData(0, i, colorsList.width, i + value.height);
        hiddenContext.putImageData(hiddenData, 0, 0);

        if(reportOnPage <= reportCount) {
            doc.addImage(hiddenCanvas.toDataURL("image/png"), 'PNG', getInMm(colorsList.width + space) * reportOnPage + 5, 8);
            reportOnPage++;
        }
        else{
            doc.addPage();
            doc.text(5,7,"Colors list:");
            reportOnPage = 0;
            doc.addImage(hiddenCanvas.toDataURL("image/png"), 'PNG', getInMm(colorsList.width + space) * reportOnPage + 5, 8);
            reportOnPage++;
        }
    }

    $('#hiddenCanvas').remove();

	return doc;
}

//this function add pattern and original image to doc object
function addPatternAndOriginal(data, doc){
    doc.addImage(data.patternImage, 'JPEG', 5, 5);
    doc.addPage();
    doc.setFontSize(14);
    doc.text(5,7,"Original image");
    doc.addImage(data.originalImage,'JPEG',5,10);
    doc.addPage();

    return doc;
}

//function which create pdf in A4 format
function writeInA4Format(pattern, image, data, colorsList){
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
        };
        
    doc = new jsPDF('p', 'mm','a4');
    spaces = (getInMm(A4.width) - getInMm(pattern.width))/2;
    doc.addImage(data.patternImage, 'JPEG', spaces, 10);
    doc.addPage();
    doc.setFontSize(14);
    doc.text(5,7,"Original image");
    doc.addImage(data.originalImage,'JPEG',5,10);
    doc.addPage();
    doc = cutColorReport(fakeA4, colorsList, doc);

    return doc;
}

//function which create pdf by pattern or original image size
function writeInSizebleFormat(pattern, image, data, colorsList) {
   	var	doc = {},
        orientation = pattern.width >= pattern.height ? 'l':'p';

    if(pattern.width > image.width) {
        doc = new jsPDF(orientation, 'mm', [getInMm(pattern.width)+10, getInMm(pattern.height)+10]);
        doc = addPatternAndOriginal(data, doc);

        for(i=0; i <=100; i++) {
            if(pattern.height%80 != 0){
                pattern.height--;
            }
        };
    
        doc = cutColorReport(pattern, colorsList, doc);
        }else {
            doc = new jsPDF(orientation, 'mm', [getInMm(image.width)+10, getInMm(image.height)+20]);

            for(i=0; i <=100; i++) {
                if(image.height%80 != 0){
                    image.height--;
                }
            };

            doc = addPatternAndOriginal(data, doc);
            doc = cutColorReport(image, colorsList, doc);
        }

    return doc;
}



