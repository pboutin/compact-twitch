Notification.requestPermission();

var index = new Vue({
    el: '#index',
    data: {
        apiBaseUrl: 'https://api.twitch.tv/kraken/',

        username: '',
        isReady: false,
        streams: []

    },
    computed: {
        apiFollowingUrl: function() {
            return this.apiBaseUrl + 'users/' + this.username + '/follows/channels?callback=?';
        },

        count: function() {
            var count = this.streams.length;
            if (count === 0) {
                return 'Meh, you will have to find something else to watch.';
            }
            return 'You have ' + count + ' stream' + (count > 1 ? 's' : '') + ' online !';
        }
    },
    methods: {
        login: function() {
            localStorage.username = this.username;
            this.load();

        },
        logout: function() {
            localStorage.clear();
            this.isReady = false;

        },
        load: function () {
            $.getJSON(this.apiFollowingUrl, {
                limit: 75,
                sortby: 'last_broadcast'
            }, function(response) {
                var names = response.follows.map(function(follow) {
                    return follow.channel.name;
                });

                $.getJSON('https://api.twitch.tv/kraken/streams?callback=?', {
                    channel: names.join(','),
                    limit: 75
                }, function(response) {
                    if (this.isReady) {
                        new Notification('New streams online : ', {
                            body: response.streams
                                    .filter(function(stream) {
                                        return ! this.streams.includes(stream);
                                    }.bind(this))
                                    .map(function(stream) {
                                        return stream.channel.display_name;
                                    })
                                    .join(', ')
                        });
                    }

                    this.streams = response.streams;
                    this.isReady = true;

                    setTimeout(this.load.bind(this), 300000);
                }.bind(this));
            }.bind(this));
        },
        open: function(stream) {
            window.open('viewer.html?s=' + stream.channel.name, stream.channel.display_name, 'width=500, height=800');
        }
    },

    ready: function() {
        if (localStorage.username) {
            this.username = localStorage.username;
            this.login();
        }
    }
});
