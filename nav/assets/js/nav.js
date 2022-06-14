var jump = function(url) {
    var s = url.substr(0, 1);
    if (s == "/") {
        location.href = url
    } else if (s == "h") {
        ss = url.substr(0, 4);
        if (ss == "http") {
            location.href = url
        } else {
            location.href = "/" + url
        }
    } else {
        location.href = "/" + url
    }
}

var getLinks = function(url, keywords = false) {
    var isSearch = keywords ? true: false;
    var t = Date.parse(new Date()).toString().substr(0, 8);
    $.getJSON(url, {
        t: t
    },
    function(result) {

        $.each(result,
        function(i, obj) {
            $.each(obj,
            function(n, links) {

                $.each(links,
                function(j, link) {

                    var html = "";
                    html += '<div class="col-xl-3 col-sm-6" onClick="jump(\'' + link.href + '\')" >';
                    html += ' <div class = "card" > ';
                    html += ' <div class = "card-body" style="cursor:pointer" > ';
                    html += ' <div class = "d-flex text-muted" > ';
                    html += ' <div class = "flex-shrink-0 me-3 align-self-center" > ';
                    html += ' <div id = "radialchart-1"class = "apex-charts"dir = "ltr"style = "width: 5rem;" > ';
                    html += ' <img src = "' + link.logo + '"width = "100%"height = "100%" > ';
                    html += ' </div>';
                    html += ' </div > ';
                    html += ' <div class = "flex-grow-1 overflow-hidden" > ';
                    html += ' <p class = "mb-1" > ' + link.desc + ' </p>';
                    html += ' <h5 class="mb-3"> ' + link.name + ' </h5 > ';
                    //html += ' <p class = "text-truncate mb-0" > <span class = "text-success me-2" >  <i class = "ri-arrow-right-up-line align-bottom ms-1" > </i></span > </p>';
                    html += ' </div > ';
                    html += ' </div>';
                    html += ' </div > ';
                    html += ' </div>';
                    html += '</div > ';
                    $("#ac").append($(html))

                    // h1 = $('<div class="col-xl-3 col-sm-6"></div>');
                    // h2 = $('<div class = "card" ></div>');
                    // h1.append(h2)
                    // h3 = $('<div class = "card-body" > </div>');
                    // h2.append(h3)
                    // h4 = $('<div class = "d-flex text-muted" > </div>');
                    // h3.append(h4)
                    // h5 = $('<div class = "flex-shrink-0 me-3 align-self-center" ></div>');
                    // h4.append(h5)
                    // h6 = $('<div id = "radialchart-1"class = "apex-charts"dir = "ltr"style = "width: 5rem;" ></div>');
                    // h5.append(h6)
                    // h7 = $('<img src = "' + link.href + '"width = "100%"height = "100%" >');
                    // h6.append(h7)
                    // h8 = ' <div class = "flex-grow-1 overflow-hidden" > </div >';
                    // h4.append(h8)
                    // h9 = ' <p class = "mb-1" > ' + link.desc + ' < /p>';
                    // h10 = '<h5 class="mb-3"> ' + link.name + ' </h5 > ';
                    // h11 = '<p class = "text-truncate mb-0" > <span class = "text-success me-2" > 0.02 % <i class = "ri-arrow-right-up-line align-bottom ms-1" > </i></span > From previous < /p>';
                    // h4.append(h9)
                    // h4.append(h10)
                    // h4.append(h11)
                    //$("#ac").append(h1)
                });
            });
        });
    });
}

$(function() {
    getLinks('assets/config/nav.json');

});