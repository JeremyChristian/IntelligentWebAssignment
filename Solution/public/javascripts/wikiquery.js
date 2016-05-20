$(document).ready(function(){
    $("#query").submit(function(event){
        event.preventDefault();
        var $form = $(this), url = $form.attr('action');
        $.post("wikiquery",
        {
            search: $('#search').val()
        },
        function(data, status){

            var list = $("#tweets");
            $(list).html("");
            $(list).append("<h3>Information</h3><p>"+data[1].abstract.value+"</p>");
            $(list).append("<h3>Stadium</h3><p>"+data[1].ground.value+"<p>");
            $(data).each(function(index){
                // $(list).append("<div class='well'><p>"+data[index].abstract.value+"</p><p>"+data[index].dob.value+"</p><p>"+data[index].position_name.value+"</p><img src="+data[index].pic.value+" alt='test'></div>");
            });

            $(list).load()
        },'json');
    });
});