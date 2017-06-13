$( document ).ready(function() {  
    //console.log("Window Ready!")
});

var width = $(window).width();
$(window).on('resize', function(){
    if($(this).width() != width){
        width = $(this).width();
    }
});

$(".decl-selected").mouseover(function(e){         
    $("."+this.id).show();         
    $("."+this.id).css({             
        top: (e.pageY ) + "px",             
        left: (e.pageX ) + "px"         
    });     
});

$(".decl-selected").mouseout(function(){        
    $("."+this.id).hide();     
});
