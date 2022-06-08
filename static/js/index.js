var xhr = new XMLHttpRequest();
xhr.open( 'get', 'https://v1.hitokoto.cn?c=i' );
xhr.onreadystatechange = function () {
  if ( xhr.readyState === 4 ) {
    var data = JSON.parse( xhr.responseText );
    var hitokoto = document.getElementById( 'hitokoto' );
    hitokoto.innerHTML = "";
    //hitokoto.appendChild(document.createTextNode(data.hitokoto))
    var typed = new Typed( "#hitokoto", {
      strings: [ data.hitokoto ],
      typeSpeed: 80
    } );
  }
}
xhr.send();
var plaaaay = function ( id ) {
  //$('#' + id)[0].play();
}
var exWords = function ( id, str ) {
  $( id )
    .html( str );
}
var swLinks = function ( st, play = true ) {
  if ( st == 1 ) {
    $( '#link' )
      .removeClass( 'l-hidden' );
    $( '#l-back' )
      .removeClass( 'l-hidden' );
    $( '#main' )
      .addClass( 'm-hidden' );
    if ( play ) {
      plaaaay( 'ruready' );
    }
  } else if ( st == 0 ) {
    $( '#link' )
      .addClass( 'l-hidden' );
    $( '#l-back' )
      .addClass( 'l-hidden' );
    $( '#main' )
      .removeClass( 'm-hidden' );
  }
}
var getLinks = function ( url, keywords = false ) {
  var isSearch = keywords ? true : false;
  var t = Date.parse( new Date() )
    .toString()
    .substr( 0, 8 );
  $.getJSON( url, {
    t: t
  }, function ( result ) {
    $.each( result, function ( i, obj ) {
      $.each( obj, function ( n, links ) {
        var countSearchResult = 0;
        var l_group = $( '<div class="l-group"></div>' );
        var l_title = $( '<div class="l-title"><h1>' + n + '</h1></div>' );
        l_group.append( l_title );
        var l_box = $( '<div class="l-box"></div>' );
        //links.sort(function(){ return 0.5 - Math.random() }); //random
        $.each( links, function ( j, link ) {
          var isShow = true;
          if ( isSearch ) {
            var beSearchStr = link.name + link.href + link.desc;
            isShow = ( beSearchStr.search( keywords ) >= 0 );
          }
          var lil_url = link.logo != null ? link.logo : 'static/img/loading.svg';
          var lid_text = link.desc != null ? link.desc : '暂无描述 ┑(￣Д ￣)┍';
          var l_item = $( '<div class="l-item"></div>' );
          l_item.attr( "title", '✦ ' + link.name + '\n✧ ' + lid_text + '\n✧ ' + link.href );
          l_item.bind( 'click', function () {
              if ( link.func ) {
                var func = new Function( 'n,h,d,l', link.func );
                func( link.name, link.href, link.desc, link.logo );
              } else {
                window.open( link.href + ( link.noUtm === undefined ? '' : '' ) );
              }
            } )
            .bind( "contextmenu", function () {
              showQr( link.href + ( link.noUtm === undefined ? '?qrCode=hanyu.cool' : '' ), link.name + '<br><span>' + lid_text + '</span>', lil_url );
              return false;
            } );
          var li_logo = $( '<div class="li-logo"></div>' );
          li_logo.css( 'background-image', 'url(' + lil_url + ')' );
          l_item.append( li_logo );
          var li_name = $( '<h2>' + link.name + '</h2>' );
          l_item.append( li_name );
          var li_desc = $( '<span>' + lid_text + '</span>' );
          l_item.append( li_desc );
          l_item.bind( 'mouseover', function () {
            $( '.l-back' )
              .css( 'background-image', 'url(' + lil_url + ')' );
          } );
          if ( isShow ) {
            countSearchResult += 1;
            l_box.append( l_item );
          }
        } );
        l_group.append( l_box );
        if ( countSearchResult > 0 ) {
          $( '#link' )
            .append( l_group );
        }
      } );
    } );
  } );
}
var randomNum = function ( minNum, maxNum ) {
  switch ( arguments.length ) {
    case 1:
      return parseInt( Math.random() * minNum + 1, 10 );
      break;
    case 2:
      return parseInt( Math.random() * ( maxNum - minNum + 1 ) + minNum, 10 );
      break;
    default:
      return 0;
      break;
  }
}
var showQr = function ( url, txt, logo ) {
  var qrnode = new AraleQRCode( {
    render: 'canvas',
    correctLevel: 2,
    text: url,
    size: 260,
    background: '#fff',
    foreground: '#000',
    pdground: '#f33',
    image: logo,
    imageSize: 32
  } );
  $( '#qrImg' )
    .html( qrnode );
  $( '#qrCode' )
    .css( 'display', 'block' );
  $( '#qrDesc' )
    .html( txt );
}
var hideQr = function ( url ) {
  $( '#qrCode' )
    .css( 'display', 'none' );
}
//躲猫猫的「猫猫」形象出自游戏「Don't catch Cats」(https://apps.apple.com/app/dont-catch-cats/id1375311035)。
var duoMaomao = function () {
  var maomao = $( '#maomao' );
  maomao.css( 'bottom', randomNum( 5, 80 ) + 'vh' );
}
var linkCache;
var showSearch = function () {
  $( '#search' )
    .css( 'height', '50px' )
    .css( 'font-size', '22px' );
  $( '#search' )
    .parent()
    .css( 'padding', '50px 0 20px 0' );
  $( '#l-search' )
    .attr( 'onclick', 'hideSearch()' );
  linkCache = $( '.l-group' );
}
var hideSearch = function () {
  $( '#search' )
    .removeAttr( 'style' );
  $( '#search' )
    .parent()
    .removeAttr( 'style' );
  $( '#l-search' )
    .attr( 'onclick', 'showSearch()' );
  $( '.l-group' )
    .detach();
  $( '#search' )
    .val( '' );
  $( '#link' )
    .append( linkCache );
}
var doSearch = function () {
  var keywords = $( '#search' )
    .val();
  $( '.l-group' )
    .detach();
  getLinks( 'static/config/links.json', keywords );
}
$( function () {
  getLinks( 'static/config/links.json' );
  if ( location.hash == '#link' || location.hash == '#search' ) {
    swLinks( 1, false );
    if ( location.hash == '#search' ) {
      setTimeout( 'showSearch()', 520 );
    }
  }
  var doSearchTimeOut = null;
  $( '#search' )
    .bind( 'input propertychange', function () {
      clearTimeout( doSearchTimeOut );
      doSearchTimeOut = setTimeout( 'doSearch()', 500 );
    } )
    .keydown( function ( event ) {
      var keywords = $.trim( $( '#search' )
        .val() );
      if ( keywords != '' ) {
        switch ( event.keyCode ) {
          case 13:
            location.href = 'https://www.sogou.com/web?ie=UTF-8&query=' + encodeURI( keywords );
            break;
          case 40:
            location.href = 'https://cn.bing.com/search?q=' + encodeURI( keywords );
            break;
          case 38:
            location.href = 'http://' + keywords;
            break;
          default:
            //console.log(event.keyCode);
        }
      }
    } );
} );
