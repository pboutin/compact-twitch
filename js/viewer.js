window.config = {
    apiStreamEmbed: 'http://www.twitch.tv/{{stream}}/embed',
    apiChatEmbed: 'http://www.twitch.tv/{{channel}}/chat'
}

$(function() {
    var stream = /s=(\w+)$/.exec(window.location.href)[1];

    $('._stream').attr('src', config.apiStreamEmbed.replace('{{stream}}', stream));
    $('._chat').attr('src', config.apiChatEmbed.replace('{{channel}}', stream));

    resizeFrames();
    $(window).resize(resizeFrames);
});


function resizeFrames() {
    var width = $('body').width();
    var height = $('body').height();

    var streamHeight = width / 16 * 9 + 20;
    $('._stream').attr('height', streamHeight);

    var chatHeight = height - streamHeight;
    $('._chat').attr('height', chatHeight);
}
