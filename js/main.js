window.config = {
    apiFollowing: 'https://api.twitch.tv/kraken/users/{{user}}/follows/channels?callback=?',
    apiStreams: 'https://api.twitch.tv/kraken/streams?callback=?',
    apiFollowingParams: {
        limit: 75,
        sortby: 'last_broadcast'
    },
    apiStreamsParams: {
        limit: 75
    }
};

$(function() {
    if (localStorage.user) {
        initializeFor(localStorage.user);
    } else {
        $('._login').fadeIn();
    }

    $('._btn-login').click(function() {
        var username = $('._login input').val();
        localStorage.user = username;
        $('._login').fadeOut(function() {
            initializeFor(username);
        });
    });

    $('._btn-logout').click(function() {
        localStorage.clear();
        $('._streams').fadeOut(function() {
            $('._login').fadeIn();
        });
    });

    $('._login input').keyup(function(e) {
        if(e.keyCode == 13){
            $('._btn-login').trigger('click');
        }
    });
});

function initializeFor(username) {
    loadOnlineStreamsFor(username, function(streams) {
        $channelsContainer = $('._online-channels');
        $channelsContainer.empty();
        streams.forEach(function(stream) {
            $channelsContainer.append(generateCardFor(stream));
        });

        $('._streamers-length').text(streams.length);
        $('._username').text(username);
        $('._streams').fadeIn();
    });
}

function loadOnlineStreamsFor(username, resolveWith) {
    var followingUrl = config.apiFollowing.replace('{{user}}', username);
    $.getJSON(followingUrl, config.apiFollowingParams, function(channels_json) {
        var names = channels_json.follows.map(function(follow) {
            return follow.channel.name;
        });
        config.apiStreamsParams.channel = names.join(',');
        $.getJSON(config.apiStreams, config.apiStreamsParams, function(streams_json) {
            resolveWith(streams_json.streams);
        });
    });
}

function generateCardFor(stream) {
    $card = $('<div></div>');
    var template = "\
    <div class='stream-card'> \
        <h3>TITLE</h3> \
        <h4>DISPLAY_NAME</h4> \
        <h4>Playing GAME</h4> \
        <img class='avatar' src='AVATAR' alt='avatar' /> \
        <img class='preview' src='http://static-cdn.jtvnw.net/previews-ttv/live_user_NAME-320x180.jpg' alt='preview' /> \
    </div>";

    template = template.replace(/TITLE/, stream.channel.status);
    template = template.replace(/DISPLAY_NAME/, stream.channel.display_name);
    template = template.replace(/NAME/, stream.channel.name);
    template = template.replace(/GAME/, stream.channel.game);
    template = template.replace(/AVATAR/, stream.channel.logo);

    $card.html(template);
    $card.data('stream', stream.channel.name);
    $card.click(function() { openViewerFor($(this).data('stream')); })
    return $card;
}

function openViewerFor(stream) {
    window.open('viewer.html?s=' + stream, stream, 'width=500, height=800');
}
