Notification.requestPermission();

var index = new Vue({
    el: '#index',
    data: {
        apiBaseUrl: 'https://api.twitch.tv/kraken/',

        username: '',
        isUserNotFound: false,
        isLoggedIn: false,
        isLoaded: false,
        streams: null
    },
    computed: {
        apiFollowingUrl: function() {
            return this.apiBaseUrl + 'users/' + this.username + '/follows/channels?callback=?';
        },

        countMessage: function() {
            if ( ! this.isLoaded) {
                return 'Initialization...';
            }

            var count = this.streams.length;
            if (count === 0) {
                return 'Meh, you will have to find something else to watch.';
            }
            return 'You have ' + count + ' stream' + (count > 1 ? 's' : '') + ' online !';
        }
    },
    methods: {
        logout: function() {
            localStorage.clear();
            this.isLoggedIn = false;

        },
        load: function () {
            $.getJSON(this.apiFollowingUrl, {
                limit: 75,
                sortby: 'last_broadcast'
            }, function(response) {
                if (response.status === 404) {
                    this.isUserNotFound = true;
                    return;
                }
                this.isUserNotFound = false;
                localStorage.username = this.username;

                var names = response.follows.map(function(follow) {
                    return follow.channel.name;
                });

                $.getJSON('https://api.twitch.tv/kraken/streams?callback=?', {
                    channel: names.join(','),
                    limit: 75
                }, function(response) {
                    if (this.streams !== null) {
                        var currentStreamIds = this.streams.map(function(stream) {
                            return stream._id;
                        });

                        var newStreamsMessage = response.streams
                            .filter(function(stream) {
                                return ! currentStreamIds.includes(stream._id);
                            }.bind(this))
                            .map(function(stream) {
                                return stream.channel.display_name;
                            })
                            .join(', ');

                        if (newStreamsMessage) {
                            new Notification('New streams online : ', {
                                body: newStreamsMessage
                            });
                        }
                    }

                    this.streams = response.streams;
                    this.isLoaded = true;
                    this.isLoggedIn = true;

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
            this.isLoggedIn = true;
            this.load();
        }
    }
});
