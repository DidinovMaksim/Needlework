$(document).ready(function(){

    needlework.localization.localizatePage('HomePage');
    // Effect for image Adjustment & Draw tabs
    
    function imageAdjustmentEffect(num,className){
        var i = 0;
        var drawText = $('#tabs ul li:eq('+num+') a').text();
        $('#tabs ul li:eq('+num+') a').text("");
        for(var i = 0; i<drawText.length; i++){       
            if(i%2==0){
                if(drawText[i]==" ")
                    $('#tabs ul li:eq('+num+') a').append("<div class='myspan3'>s</div>");
                else
                    $('#tabs ul li:eq('+num+') a').append("<div class='"+className+"1'>"+drawText[i]+"</div>");
            }
            else{
                if(drawText[i]==" ")
                    $('#tabs ul li:eq('+num+') a').append("<div class='myspan3'>s</div>");
                else
                    $('#tabs ul li:eq('+num+') a').append("<div class='"+className+"2'>"+drawText[i]+"</div>");
            }
        }
    };

    imageAdjustmentEffect('1',"myspan");
    imageAdjustmentEffect('2',"myspanDraw");
    
    
    //Scoll to Image upload
    $('#top ul li:eq(0)').click(function(){    
        $('body').animate({scrollTop: $('.homePage').offset().top}, 600);
    });

    //Scoll to Pattern
    $('#crtPattern').click(function(){      
        $('#rightPatternCreation').css({display:"block"});
        $('body').animate({scrollTop: $('#rightPatternCreation').offset().top-70}, 600);
    });
    
    //Responvise design for Image Adjustment div;
    $(window).resize(function(){
        $('#editSrcImgDiv').css({width: (($(window).width()*0.65)-$('#tableAndReset').width()) + "px"});
    });

    
    // Some fix design scripts;
    $('#top').css({height: $(window).height() + "px"});
    $('#srcImgCanvasDiv').css({height: $(window).height()*0.7 + "px"});
    $('#patternImgCanvasDiv').css({height: $(window).height()*0.5 + "px"});
    $('#editSrcImgDiv').css({width: (($(window).width()*0.80)-$('#tableAndReset').width()) + "px"});


    // Left & Top menu effects 

    var toogleMenu = false;
    $('#hamburger').click(function(){
        if(!toogleMenu){
            $('html').css({overflowX:"hidden"});
            $('body').animate({left:"400px"},500)
            $('#leftMenu').animate({left:"0px"},500)
            toogleMenu = true;
        }
        else{            
            $('body').animate({left:"0px"},500)
            $('#leftMenu').animate({left:"-405px"},500)
            $('html').css({overflowX:"auto"},500);
            toogleMenu = false;
        }
    });


    var fixScrollUl = $('#top ul').offset().top;

    $(window).scroll(function(){
        if($(window).scrollTop() > fixScrollUl){
            $('#topMenu').css({display:"block"});
        }        
        if($(window).scrollTop() <= fixScrollUl){
            $('#topMenu').css({display:"none"});
        }
    });
});    