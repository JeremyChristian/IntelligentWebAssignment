$(document).ready(function(){
    $("#wikiquery").submit(function(event){
        event.preventDefault();
        var $form = $(this), url = $form.attr('action');
        $.post("wikiquery",
        {
            search1: $('#search1').val(),
            search2: $('#search2').val()
        },
        function(data, status){
            console.log(data);
            var list = $("#team2");
            $(list).html("");
            try {
               $(list).append('<div class="tab-content"><div id="team2" class="tab-pane fade in active">');
                $(list).append("<div class='well'><h3>Information</h3><p>"+data[1][1].abstract.value+"</p></div>");
                $(list).append("<div class='well'><h3>Stadium</h3><p>"+data[1][1].ground_abstract.value+"<p></div>");
                $(list).append("<div style='text-align:center;'>");
                $(data[1]).each(function(index){
                    $(list).append("<div class='well col-sm-3' style='margin:1%;'><p>"+data[1][index].name.value+"</p><p>"+data[1][index].dob.value+"</p><p>"+data[1][index].position_name.value+"</p><img src="+data[1][index].pic.value+" width='100px' height = '100px style='float:right;' alt='test'></div>");
                });
                $(list).append("</div></div></div>");

                $(list).load()
            }
            catch (err) {
               
            }
            

            var list = $("#team1");
            $(list).html("");            
            try {
                $(list).append('<div class="tab-content"><div id="team1" class="tab-pane fade in active">');
                $(list).append("<div class='well'><h3>Information</h3><p>"+data[0][1].abstract.value+"</p></div>");
                $(list).append("<div class='well'><h3>Stadium</h3><p>"+data[0][1].ground_abstract.value+"<p></div>");
                $(list).append("<div style='text-align:center;'>");
                $(data[0]).each(function(index){
                    $(list).append("<div class='well col-sm-3' style='margin:1%;'><p>"+data[0][index].name.value+"</p><p>"+data[0][index].dob.value+"</p><p>"+data[0][index].position_name.value+"</p><img src="+data[0][index].pic.value+" width='100px' height = '100px style='float:right;' alt='test'></div>");
                });
                $(list).append("</div></div></div>");

                $(list).load()
            }
            catch (err) {

            }
        },'json');
    });
});