$(document).ready(function(){
    $("#query").submit(function(event){
        event.preventDefault();
        var $form = $(this), url = $form.attr('action');
        $.post("handle",
        {
            allWords: $('#allWords').val(),
            exactPhrase: $('#exactPhrase').val(),
            anyWords: $('#anyWords').val(),
            notWords: $('#notWords').val(),
            hashtags: $('#hashtags').val(),
            fromAccounts: $('#fromAccounts').val(),
            toAccount: $('#toAccount').val(),
            mentionAccounts: $('#mentionAccounts').val()
        },
        function(data, status){

            var list = $("#tweets");
            $(list).html("");
            $(data[0]).each(function(index){
                $(list).append("<div class='well'><h3>"+data[0][index].user.name+"</h3><span class='date'>"+data[0][index].created_at+"</span><p>"+data[0][index].text+"</p></div>");

                // if(data[0][index].geo != null){
                //     var marker = new google.maps.Marker({
                //         position: {lat:data[0][index].geo.coordinates[0], lng:data[0][index].geo.coordinates[1]},
                //         map: map,
                //         title: 'Hello World!'
                //     });
                // }
            });

            $(list).load()
        },'json');
    });
});