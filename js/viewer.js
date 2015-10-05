window.config = {
    apiStreamEmbed: 'http://www.twitch.tv/{{stream}}/embed',
    apiChatEmbed: 'http://www.twitch.tv/{{channel}}/chat',
    apiStream: 'https://api.twitch.tv/kraken/streams/{{stream}}?callback=?',
    stream: ''
};


$(function() {
    var stream = /s=(\w+)$/.exec(window.location.href)[1];
    window.config.stream = stream;
    document.title = stream;

    $('._stream').attr('src', config.apiStreamEmbed.replace('{{stream}}', stream));
    $('._chat').attr('src', config.apiChatEmbed.replace('{{channel}}', stream));

    resizeFrames();
    $(window).resize(resizeFrames);

    setInterval(refreshDetails, 60000);
    refreshDetails();
});

function resizeFrames() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var streamHeight = width / 16 * 9;
    $('._stream').attr('height', streamHeight);

    $('._viewers-container').css('top', streamHeight + 35);

    var chatHeight = height - streamHeight;
    $('._chat').attr('height', chatHeight);
}

function refreshDetails() {
    var streamUrl = config.apiStream.replace('{{stream}}', window.config.stream);
    $.getJSON(streamUrl, function(data) {
        $('._viewers').text(data.stream.viewers);
    });
}
