//$(function() {
		
		var canvas = document.getElementById('canvas_picker').getContext('2d');
		
		popup();
		draw();
		getPixelColor();

		//appeared canvas holder
    	function popup(){

    	    $(".clear").click(function () {
    	        $("#choiceColor label").text("");
    	        $("input#inputColorName").val("");
	    	    $("input#inputColorRGB").val("");
	    		$("input#inputColorHex").val("");
	    	})
	    };

	    // drawing picture on the canvas
	    function draw(){
	    	
			var img = new Image();

			img.crossOrigin="anonymous";
			img.src = './img/imagePalette.png';

			$(img).load(function(){
			  canvas.drawImage(img,0,0);
			});
	    }

		function rgbToHex(R,G,B) {
			return toHex(R)+toHex(G)+toHex(B)
		}

		function toHex(n) {
		  n = parseInt(n,10);
		  if (isNaN(n)) return "00";
		  n = Math.max(0,Math.min(n,255));
		  return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
		}

    
    function drawCross(x,y){

			var pic  = new Image();              
		    pic.src  = './img/cross.png';

		    var img = new Image();
		    img.src = './img/imagePalette.png';

		    pic.onload = function() { 
		    	canvas.drawImage(img, 0, 0);
		    	canvas.drawImage(pic, x-10, y-10);  
		    }
		}
    
    
    
		//getting color of clicked pixel
		function getPixelColor() {

			$('#canvas_picker').click(function(event) {
				
				var x = event.pageX - $( "#colorPalette" ).offset().left+10 - this.offsetLeft; 
				var y = event.pageY - $( "#colorPalette" ).offset().top+10 - this.offsetTop; 
                console.log(x+"-----"+y);

		              
                drawCross(x,y);

				var img_data = canvas.getImageData(x, y, 1, 1).data;
				var R = img_data[0];
				var G = img_data[1];
				var B = img_data[2];  var rgb = R + ',' + G + ',' + B;

				var hex = rgbToHex(R,G,B);

				$('input#inputColorRGB').val(rgb);
				$('input#inputColorHex').val('#' + hex);
			});
		}
    
        		
    
    
    
    
	//});



