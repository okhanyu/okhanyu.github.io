/*
            /$$
    /$$    /$$$$
   | $$   |_  $$    /$$$$$$$
 /$$$$$$$$  | $$   /$$_____/
|__  $$__/  | $$  |  $$$$$$
   | $$     | $$   \____  $$
   |__/    /$$$$$$ /$$$$$$$/
          |______/|_______/
================================
        Keep calm and get rich.
                    Is the best.

  	@Author: Dami
  	@Date:   2019-03-19 14:03:12
 * @Last Modified by: suxing
 * @Last Modified time: 2019-08-11 16:14:18
*/
/*
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */
var CanvasImage=function(a){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),document.body.appendChild(this.canvas),this.width=this.canvas.width=a.width,this.height=this.canvas.height=a.height,this.context.drawImage(a,0,0,this.width,this.height)};CanvasImage.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},CanvasImage.prototype.update=function(a){this.context.putImageData(a,0,0)},CanvasImage.prototype.getPixelCount=function(){return this.width*this.height},CanvasImage.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)},CanvasImage.prototype.removeCanvas=function(){this.canvas.parentNode.removeChild(this.canvas)};var ColorThief=function(){};if(ColorThief.prototype.getColor=function(a,b){var c=this.getPalette(a,5,b),d=c[0];return d},ColorThief.prototype.getPalette=function(c,d,e){("undefined"==typeof d||2>d||256<d)&&(d=10),("undefined"==typeof e||1>e)&&(e=10);for(var f,h,j,k,l,m=new CanvasImage(c),n=m.getImageData(),o=n.data,p=m.getPixelCount(),q=[],s=0;s<p;s+=e)f=4*s,h=o[f+0],j=o[f+1],k=o[f+2],l=o[f+3],125<=l&&!(250<h&&250<j&&250<k)&&q.push([h,j,k]);var t=MMCQ.quantize(q,d),u=t?t.palette():null;return m.removeCanvas(),u},ColorThief.prototype.getColorFromUrl=function(a,b,c){sourceImage=document.createElement("img");var d=this;sourceImage.addEventListener("load",function(){var e=d.getPalette(sourceImage,5,c),f=e[0];b(f,a)}),sourceImage.src=a},ColorThief.prototype.getImageData=function(a,b){xhr=new XMLHttpRequest,xhr.open("GET",a,!0),xhr.responseType="arraybuffer",xhr.onload=function(){if(200==this.status){uInt8Array=new Uint8Array(this.response),a=uInt8Array.length,binaryString=Array(a);for(var a=0;a<uInt8Array.length;a++)binaryString[a]=String.fromCharCode(uInt8Array[a]);data=binaryString.join(""),base64=window.btoa(data),b("data:image/png;base64,"+base64)}},xhr.send()},ColorThief.prototype.getColorAsync=function(a,b,c){var d=this;this.getImageData(a,function(a){sourceImage=document.createElement("img"),sourceImage.addEventListener("load",function(){var a=d.getPalette(sourceImage,5,c),e=a[0];b(e,this)}),sourceImage.src=a})},!pv)var pv={map:function(a,b){var c={};return b?a.map(function(a,d){return c.index=d,b.call(c,a)}):a.slice()},naturalOrder:function(c,a){return c<a?-1:c>a?1:0},sum:function(a,b){var c={};return a.reduce(b?function(a,e,d){return c.index=d,a+b.call(c,e)}:function(a,b){return a+b},0)},max:function(a,b){return Math.max.apply(null,b?pv.map(a,b):a)}};var MMCQ=function(){function a(a,c,d){return(a<<10)+(c<<5)+d}function b(a){function b(){c.sort(a),d=!0}var c=[],d=!1;return{push:function(a){c.push(a),d=!1},peek:function(a){return d||b(),void 0===a&&(a=c.length-1),c[a]},pop:function(){return d||b(),c.pop()},size:function(){return c.length},map:function(a){return c.map(a)},debug:function(){return d||b(),c}}}function c(a,b,c,d,e,f,g){var h=this;h.r1=a,h.r2=b,h.g1=c,h.g2=d,h.b1=e,h.b2=f,h.histo=g}function d(){this.vboxes=new b(function(c,a){return pv.naturalOrder(c.vbox.count()*c.vbox.volume(),a.vbox.count()*a.vbox.volume())})}function e(b){var c,d,e,f,g=Array(32768);return b.forEach(function(b){d=b[0]>>3,e=b[1]>>3,f=b[2]>>3,c=a(d,e,f),g[c]=(g[c]||0)+1}),g}function f(a,b){var d,e,f,g=1e6,h=0,i=1e6,j=0,k=1e6,l=0;return a.forEach(function(a){d=a[0]>>3,e=a[1]>>3,f=a[2]>>3,d<g?g=d:d>h&&(h=d),e<i?i=e:e>j&&(j=e),f<k?k=f:f>l&&(l=f)}),new c(g,h,i,j,k,l,b)}function g(b,c){function d(a){var b,d,e,f,g,h=a+"1",i=a+"2",j=0;for(l=c[h];l<=c[i];l++)if(r[l]>q/2){for(e=c.copy(),f=c.copy(),b=l-c[h],d=c[i]-l,g=b<=d?Math.min(c[i]-1,~~(l+d/2)):Math.max(c[h],~~(l-1-b/2));!r[g];)g++;for(j=s[g];!j&&r[g-1];)j=s[--g];return e[i]=g,f[h]=e[i]+1,[e,f]}}if(c.count()){var e=c.r2-c.r1+1,f=c.g2-c.g1+1,g=c.b2-c.b1+1,h=pv.max([e,f,g]);if(1==c.count())return[c.copy()];var l,m,n,o,p,q=0,r=[],s=[];if(h==e)for(l=c.r1;l<=c.r2;l++){for(o=0,m=c.g1;m<=c.g2;m++)for(n=c.b1;n<=c.b2;n++)p=a(l,m,n),o+=b[p]||0;q+=o,r[l]=q}else if(h==f)for(l=c.g1;l<=c.g2;l++){for(o=0,m=c.r1;m<=c.r2;m++)for(n=c.b1;n<=c.b2;n++)p=a(m,l,n),o+=b[p]||0;q+=o,r[l]=q}else for(l=c.b1;l<=c.b2;l++){for(o=0,m=c.r1;m<=c.r2;m++)for(n=c.g1;n<=c.g2;n++)p=a(m,n,l),o+=b[p]||0;q+=o,r[l]=q}return r.forEach(function(a,b){s[b]=q-a}),h==e?d("r"):h==f?d("g"):d("b")}}return c.prototype={volume:function(a){var b=this;return(!b._volume||a)&&(b._volume=(b.r2-b.r1+1)*(b.g2-b.g1+1)*(b.b2-b.b1+1)),b._volume},count:function(b){var c=this,d=c.histo;if(!c._count_set||b){var e,f,g,h,l=0;for(f=c.r1;f<=c.r2;f++)for(g=c.g1;g<=c.g2;g++)for(h=c.b1;h<=c.b2;h++)e=a(f,g,h),l+=d[e]||0;c._count=l,c._count_set=!0}return c._count},copy:function(){var a=this;return new c(a.r1,a.r2,a.g1,a.g2,a.b1,a.b2,a.histo)},avg:function(b){var c=this,d=c.histo;if(!c._avg||b){var e,f,g,h,l,m=0,n=0,o=0,p=0;for(f=c.r1;f<=c.r2;f++)for(g=c.g1;g<=c.g2;g++)for(h=c.b1;h<=c.b2;h++)l=a(f,g,h),e=d[l]||0,m+=e,n+=8*(e*(f+.5)),o+=8*(e*(g+.5)),p+=8*(e*(h+.5));c._avg=m?[~~(n/m),~~(o/m),~~(p/m)]:[~~(8*(c.r1+c.r2+1)/2),~~(8*(c.g1+c.g2+1)/2),~~(8*(c.b1+c.b2+1)/2)]}return c._avg},contains:function(a){var b=this,c=a[0]>>3;return gval=a[1]>>3,bval=a[2]>>3,c>=b.r1&&c<=b.r2&&gval>=b.g1&&gval<=b.g2&&bval>=b.b1&&bval<=b.b2}},d.prototype={push:function(a){this.vboxes.push({vbox:a,color:a.avg()})},palette:function(){return this.vboxes.map(function(a){return a.color})},size:function(){return this.vboxes.size()},map:function(a){for(var b=this.vboxes,c=0;c<b.size();c++)if(b.peek(c).vbox.contains(a))return b.peek(c).color;return this.nearest(a)},nearest:function(a){for(var b,c,d,e=this.vboxes,f=0;f<e.size();f++)c=Math.sqrt(Math.pow(a[0]-e.peek(f).color[0],2)+Math.pow(a[1]-e.peek(f).color[1],2)+Math.pow(a[2]-e.peek(f).color[2],2)),(c<b||void 0===b)&&(b=c,d=e.peek(f).color);return d},forcebw:function(){var a=this.vboxes;a.sort(function(c,a){return pv.naturalOrder(pv.sum(c.color),pv.sum(a.color))});var b=a[0].color;5>b[0]&&5>b[1]&&5>b[2]&&(a[0].color=[0,0,0]);var c=a.length-1,d=a[c].color;251<d[0]&&251<d[1]&&251<d[2]&&(a[c].color=[255,255,255])}},{quantize:function(a,c){function h(a,b){for(var c,d=1,e=0;1000>e;){if(c=a.pop(),!c.count()){a.push(c),e++;continue}var f=g(i,c),h=f[0],j=f[1];if(!h)return;if(a.push(h),j&&(a.push(j),d++),d>=b)return;if(1000<e++)return}}if(!a.length||2>c||256<c)return!1;var i=e(a),j=0;i.forEach(function(){j++}),j<=c;var k=f(a,i),l=new b(function(c,a){return pv.naturalOrder(c.count(),a.count())});l.push(k),h(l,.75*c);for(var m=new b(function(c,a){return pv.naturalOrder(c.count()*c.volume(),a.count()*a.volume())});l.size();)m.push(l.pop());h(m,c-m.size());for(var n=new d;m.size();)n.push(m.pop());return n}}}();
/* quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @license
 */
/*!
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 * @license
 */
if(ColorThief.prototype.getColor=function(a,b){var c=this.getPalette(a,5,b),d=c[0];return d},ColorThief.prototype.getPalette=function(a,b,c){"undefined"==typeof b&&(b=10),("undefined"==typeof c||c<1)&&(c=10);for(var d,e,f,g,h,i=new CanvasImage(a),j=i.getImageData(),k=j.data,l=i.getPixelCount(),m=[],n=0;n<l;n+=c)d=4*n,e=k[d+0],f=k[d+1],g=k[d+2],h=k[d+3],h>=125&&(e>250&&f>250&&g>250||m.push([e,f,g]));var o=MMCQ.quantize(m,b),p=o?o.palette():null;return i.removeCanvas(),p},!pv)var pv={map:function(a,b){var c={};return b?a.map(function(a,d){return c.index=d,b.call(c,a)}):a.slice()},naturalOrder:function(a,b){return a<b?-1:a>b?1:0},sum:function(a,b){var c={};return a.reduce(b?function(a,d,e){return c.index=e,a+b.call(c,d)}:function(a,b){return a+b},0)},max:function(a,b){return Math.max.apply(null,b?pv.map(a,b):a)}};var MMCQ=function(){function a(a,b,c){return(a<<2*i)+(b<<i)+c}function b(a){function b(){c.sort(a),d=!0}var c=[],d=!1;return{push:function(a){c.push(a),d=!1},peek:function(a){return d||b(),void 0===a&&(a=c.length-1),c[a]},pop:function(){return d||b(),c.pop()},size:function(){return c.length},map:function(a){return c.map(a)},debug:function(){return d||b(),c}}}function c(a,b,c,d,e,f,g){var h=this;h.r1=a,h.r2=b,h.g1=c,h.g2=d,h.b1=e,h.b2=f,h.histo=g}function d(){this.vboxes=new b(function(a,b){return pv.naturalOrder(a.vbox.count()*a.vbox.volume(),b.vbox.count()*b.vbox.volume())})}function e(b){var c,d,e,f,g=1<<3*i,h=new Array(g);return b.forEach(function(b){d=b[0]>>j,e=b[1]>>j,f=b[2]>>j,c=a(d,e,f),h[c]=(h[c]||0)+1}),h}function f(a,b){var d,e,f,g=1e6,h=0,i=1e6,k=0,l=1e6,m=0;return a.forEach(function(a){d=a[0]>>j,e=a[1]>>j,f=a[2]>>j,d<g?g=d:d>h&&(h=d),e<i?i=e:e>k&&(k=e),f<l?l=f:f>m&&(m=f)}),new c(g,h,i,k,l,m,b)}function g(b,c){function d(a){var b,d,e,f,g,h=a+"1",j=a+"2",k=0;for(i=c[h];i<=c[j];i++)if(o[i]>n/2){for(e=c.copy(),f=c.copy(),b=i-c[h],d=c[j]-i,g=b<=d?Math.min(c[j]-1,~~(i+d/2)):Math.max(c[h],~~(i-1-b/2));!o[g];)g++;for(k=p[g];!k&&o[g-1];)k=p[--g];return e[j]=g,f[h]=e[j]+1,[e,f]}}if(c.count()){var e=c.r2-c.r1+1,f=c.g2-c.g1+1,g=c.b2-c.b1+1,h=pv.max([e,f,g]);if(1==c.count())return[c.copy()];var i,j,k,l,m,n=0,o=[],p=[];if(h==e)for(i=c.r1;i<=c.r2;i++){for(l=0,j=c.g1;j<=c.g2;j++)for(k=c.b1;k<=c.b2;k++)m=a(i,j,k),l+=b[m]||0;n+=l,o[i]=n}else if(h==f)for(i=c.g1;i<=c.g2;i++){for(l=0,j=c.r1;j<=c.r2;j++)for(k=c.b1;k<=c.b2;k++)m=a(j,i,k),l+=b[m]||0;n+=l,o[i]=n}else for(i=c.b1;i<=c.b2;i++){for(l=0,j=c.r1;j<=c.r2;j++)for(k=c.g1;k<=c.g2;k++)m=a(j,k,i),l+=b[m]||0;n+=l,o[i]=n}return o.forEach(function(a,b){p[b]=n-a}),d(h==e?"r":h==f?"g":"b")}}function h(a,c){function h(a,b){for(var c,d=1,e=0;e<k;)if(c=a.pop(),c.count()){var f=g(i,c),h=f[0],j=f[1];if(!h)return;if(a.push(h),j&&(a.push(j),d++),d>=b)return;if(e++>k)return}else a.push(c),e++}if(!a.length||c<2||c>256)return!1;var i=e(a),j=0;i.forEach(function(){j++});var m=f(a,i),n=new b(function(a,b){return pv.naturalOrder(a.count(),b.count())});n.push(m),h(n,l*c);for(var o=new b(function(a,b){return pv.naturalOrder(a.count()*a.volume(),b.count()*b.volume())});n.size();)o.push(n.pop());h(o,c-o.size());for(var p=new d;o.size();)p.push(o.pop());return p}var i=5,j=8-i,k=1e3,l=.75;return c.prototype={volume:function(a){var b=this;return b._volume&&!a||(b._volume=(b.r2-b.r1+1)*(b.g2-b.g1+1)*(b.b2-b.b1+1)),b._volume},count:function(b){var c=this,d=c.histo;if(!c._count_set||b){var e,f,g,h=0;for(e=c.r1;e<=c.r2;e++)for(f=c.g1;f<=c.g2;f++)for(g=c.b1;g<=c.b2;g++)index=a(e,f,g),h+=d[index]||0;c._count=h,c._count_set=!0}return c._count},copy:function(){var a=this;return new c(a.r1,a.r2,a.g1,a.g2,a.b1,a.b2,a.histo)},avg:function(b){var c=this,d=c.histo;if(!c._avg||b){var e,f,g,h,j,k=0,l=1<<8-i,m=0,n=0,o=0;for(f=c.r1;f<=c.r2;f++)for(g=c.g1;g<=c.g2;g++)for(h=c.b1;h<=c.b2;h++)j=a(f,g,h),e=d[j]||0,k+=e,m+=e*(f+.5)*l,n+=e*(g+.5)*l,o+=e*(h+.5)*l;k?c._avg=[~~(m/k),~~(n/k),~~(o/k)]:c._avg=[~~(l*(c.r1+c.r2+1)/2),~~(l*(c.g1+c.g2+1)/2),~~(l*(c.b1+c.b2+1)/2)]}return c._avg},contains:function(a){var b=this,c=a[0]>>j;return gval=a[1]>>j,bval=a[2]>>j,c>=b.r1&&c<=b.r2&&gval>=b.g1&&gval<=b.g2&&bval>=b.b1&&bval<=b.b2}},d.prototype={push:function(a){this.vboxes.push({vbox:a,color:a.avg()})},palette:function(){return this.vboxes.map(function(a){return a.color})},size:function(){return this.vboxes.size()},map:function(a){for(var b=this.vboxes,c=0;c<b.size();c++)if(b.peek(c).vbox.contains(a))return b.peek(c).color;return this.nearest(a)},nearest:function(a){for(var b,c,d,e=this.vboxes,f=0;f<e.size();f++)c=Math.sqrt(Math.pow(a[0]-e.peek(f).color[0],2)+Math.pow(a[1]-e.peek(f).color[1],2)+Math.pow(a[2]-e.peek(f).color[2],2)),(c<b||void 0===b)&&(b=c,d=e.peek(f).color);return d},forcebw:function(){var a=this.vboxes;a.sort(function(a,b){return pv.naturalOrder(pv.sum(a.color),pv.sum(b.color))});var b=a[0].color;b[0]<5&&b[1]<5&&b[2]<5&&(a[0].color=[0,0,0]);var c=a.length-1,d=a[c].color;d[0]>251&&d[1]>251&&d[2]>251&&(a[c].color=[255,255,255])}},{quantize:h}}();

if (typeof jQuery != 'undefined') {
	var $ = jQuery.noConflict();
}

$(document).on('click', '#btn-bigger-cover', function(event) {
	event.preventDefault();

	var that = $(this);

	if( that.hasClass('loading') ){
		return false;
	}
	that.addClass('loading');

	var id = that.data('id');
	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'json',
		data: {action: 'create-bigger-image', id: id},
	})
	.done(function( data ) {

		if( data.status == 200 ){

			var popup = ncPopup( 'cover', data.html, 'background:rgba(0,0,0,0.5);');

			var colorThief = new ColorThief();
			colorThief.getColorAsync(data.head_image, function(color, element) {
				var colors = colorThief.getPalette(element, 1);
				var mainColor = 'rgba(' + colors[0][0] + ', '+ colors[0][1] +', ' + colors[0][2] + ', .3)';
				var style = {
					backgroundColor: mainColor,
					'background': + mainColor 
				}
				popup.find('.nice-tips-overlay').css(style);

	        });

			$('[data-toggle="tooltip"]').tooltip();

		}else{
			ncPopupTips(0, data.msg);
		}
		that.removeClass('loading');
	})
	.fail(function() {
		ncPopupTips(0, '网络错误，请稍后再试');
		that.removeClass('loading');
	});
});