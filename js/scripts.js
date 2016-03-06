'use strict'
$(function () {
    const TWITCH_STREAMS = 'https:/api.twitch.tv/kraken/streams/'
    const CHANNEL_NAMES = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "cg_village_captain"]

    function getNewChannel(input) {
        var request = $.ajax({
            method: 'get',
            url: TWITCH_STREAMS + input,
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
        for (let channel of CHANNEL_NAMES) {
            $.ajax({
                method: 'get',
                url: TWITCH_STREAMS + channel,
                dataType: 'jsonp',
                success: function (data) {
                    template(data, channel);
                }
            });
        }
    }

    function template(data, channelName) {
        let logo, link, displayName, status, channel, onlineClass;
        if (data.error) {
            logo = "http://mmotitles.com/wp-content/uploads/2014/01/54abc__DERP-Offline.jpg";
            link = "http://www.twitch.tv"
            displayName = channelName
            status = "channel permanently closed"
            onlineClass = "closed"
        }

        if (data.stream !== null && !data.error) {
            channel = data.stream.channel
            logo = channel.logo || "http://www.greatbitblog.com/wp-content/uploads/2014/05/youtube-buys-twitch.jpg"
            link = channel.url;
            displayName = channel.display_name;
            status = channel.status;
            onlineClass = "online"
        } else if (!data.error) {
            logo = "http://mmotitles.com/wp-content/uploads/2014/01/54abc__DERP-Offline.jpg";
            displayName = data._links.channel.substr(38)
            link = `http://www.twitch.tv/${displayName}`          
            status = ''
            onlineClass = "offline"
        }

        channel = `<div class='media channel-body ${onlineClass}'><div class='media-left media-middle'><a href='${link}'>`
        channel += `<img class='media-object logo' src=${logo} alt='Channel logo'></a></div>`
        channel += `<div class='media-body'><h3 class='media-heading'>${displayName}</h3>`
        channel += `<p>${status}<p>`
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
        $('#getNewChannel').css('display') == 'none' ? $('#getNewChannel').slideDown() : $('#getNewChannel').slideUp()
        // TO BE IMPLEMENTED : handle errors if channel not found //
        // x === undefined ? $('#searchBoxInput').val('No channel by that name.') : $('#searchBoxInput').val("")
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