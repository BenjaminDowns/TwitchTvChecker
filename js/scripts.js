$(function () {

    var channelNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "cg_village_captain"]

    function getNewChannel(input) {
        var request = $.ajax({
            method: 'get',
            url: 'https:/api.twitch.tv/kraken/streams/' + input,
            dataType: 'jsonp'
        });
        request.done(function (data) {
            template(data, input)
        });
        request.fail(function (data) {
            toggleSearch(data)
        });
    }

    function getChannels(callback) {
        for (var c in channelNames) {
            // closure
            (function (channel) {
                $.ajax({
                    method: 'get',
                    url: 'https://api.twitch.tv/kraken/streams/' + channelNames[channel],
                    dataType: 'jsonp',
                    success: function (data) {
                        template(data, channelNames[channel]);
                    }
                });
            })(c)
        }
    }

    function template(data, channelName) {
        var logo, link, displayName, status, channel, onlineClass;
        if (data.error) {
            logo = "http://mmotitles.com/wp-content/uploads/2014/01/54abc__DERP-Offline.jpg";
            link = "http://www.twitch.tv"
            displayName = channelName
            status = "channel permanently closed"
            onlineClass = "closed"
        }

        if (data.stream !== null && !data.error) {
            logo = data.stream.channel.logo == null ? "http://www.greatbitblog.com/wp-content/uploads/2014/05/youtube-buys-twitch.jpg" : data.stream.channel.logo
            link = data.stream.channel.url;
            displayName = data.stream.channel.display_name;
            status = data.stream.channel.status;
            onlineClass = "online"
        } else if (!data.error) {
            logo = "http://mmotitles.com/wp-content/uploads/2014/01/54abc__DERP-Offline.jpg";
            link = "http://www.twitch.tv/" + data._links.channel.substr(38)
            displayName = data._links.channel.substr(38)
            status = ''
            onlineClass = "offline"
        }

        channel = "<div class='media channel-body " + onlineClass + "' ><div class='media-left media-middle' ><a href=" + link + ">"
        channel += "<img class='media-object logo' src=" + logo + " alt= 'Channel logo'></a></div>"
        channel += "<div class='media-body'><h3 class='media-heading'>" + displayName + "</h3>"
        channel += "<p>" + status + "<p>"
        channel += "</div></div>"

        onlineClass != "online" ? $('#unavailable').append(channel) : $('#available').append(channel)
    }
    // NOT NECESSARY; MAYBE DO LATER
    // $('#online').on('click', function (e) {
    //     $('.offline').hide('fast');
    //     $('.online').show('fast')
    //     // $('.online').fadeUp();
    // })

    // $('#offline').on('click', function (e) {
    //     $('.online').hide('fast')
    //     $('.offline').show('fast')          
    // })
    
    function toggleSearch(x) {
        console.log('inside toggleSearch function')
        $('#getNewChannel').css('display') == 'none' ? $('#getNewChannel').slideDown() : $('#getNewChannel').slideUp()
        if (x.length > 0) {
            $('#searchBoxInput').val('No channel by that name.')
        } else {
            $('#searchBoxInput').val("")
        } 
    }

    $('#revealSearch').on('click', toggleSearch)

    $('#channelSearch').on('click', function (e) {
        e.preventDefault();
        var input = $('#searchBoxInput').val()
        getNewChannel(input)
        toggleSearch()
    })

    getChannels(template)
});