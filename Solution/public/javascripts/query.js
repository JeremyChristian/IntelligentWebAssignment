$(document).ready(function(){
    $("#query").submit(function(event){
        event.preventDefault();
        var $form = $(this), url = $form.attr('action');
        $.post("handle",
        {
            search: $('#search').val()
        },
        function(data, status){

            var list = $("#tweets");
            $(list).html("");
            $(data).each(function(index){
                $(list).append("<div class='well'><h3>"+data[index].user.name+"</h3><span class='date'>"+data[index].created_at+"</span><p>"+data[index].text+"</p></div>");

                if(data[index].geo != null){
                    var marker = new google.maps.Marker({
                        position: {lat:data[index].geo.coordinates[0], lng:data[index].geo.coordinates[1]},
                        map: map,
                        title: 'Hello World!'
                    });
                }
            });

            $(list).load()
        },'json');
    });
});