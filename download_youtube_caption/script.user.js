// ==UserScript==
// @name           Download YouTube Captions
// @namespace      http://userscripts.org/users/tim
// @include        http://*youtube.com/watch*
// @include        https://*youtube.com/watch*
// @author         Tim Smart
// @copyright      2009 Tim Smart; 2011 gw111zz
// @license        GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

////// Copyright 2011 Eli Grey
/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */
var BlobBuilder=BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||(function(j){"use strict";var c=function(v){return Object.prototype.toString.call(v).match(/^\[object\s(.*)\]$/)[1]},u=function(){this.data=[]},t=function(x,v,w){this.data=x;this.size=x.length;this.type=v;this.encoding=w},k=u.prototype,s=t.prototype,n=j.FileReaderSync,a=function(v){this.code=this[this.name=v]},l=("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),r=l.length,o=j.URL||j.webkitURL||j,p=o.createObjectURL,b=o.revokeObjectURL,e=o,i=j.btoa,f=j.atob,m=false,h=function(v){m=!v},d=j.ArrayBuffer,g=j.Uint8Array;u.fake=s.fake=true;while(r--){a.prototype[l[r]]=r+1}try{if(g){h.apply(0,new g(1))}}catch(q){}if(!o.createObjectURL){e=j.URL={}}e.createObjectURL=function(w){var x=w.type,v;if(x===null){x="application/octet-stream"}if(w instanceof t){v="data:"+x;if(w.encoding==="base64"){return v+";base64,"+w.data}else{if(w.encoding==="URI"){return v+","+decodeURIComponent(w.data)}}if(i){return v+";base64,"+i(w.data)}else{return v+","+encodeURIComponent(w.data)}}else{if(real_create_object_url){return real_create_object_url.call(o,w)}}};e.revokeObjectURL=function(v){if(v.substring(0,5)!=="data:"&&real_revoke_object_url){real_revoke_object_url.call(o,v)}};k.append=function(z){var B=this.data;if(g&&z instanceof d){if(m){B.push(String.fromCharCode.apply(String,new g(z)))}else{var A="",w=new g(z),x=0,y=w.length;for(;x<y;x++){A+=String.fromCharCode(w[x])}}}else{if(c(z)==="Blob"||c(z)==="File"){if(n){var v=new n;B.push(v.readAsBinaryString(z))}else{throw new a("NOT_READABLE_ERR")}}else{if(z instanceof t){if(z.encoding==="base64"&&f){B.push(f(z.data))}else{if(z.encoding==="URI"){B.push(decodeURIComponent(z.data))}else{if(z.encoding==="raw"){B.push(z.data)}}}}else{if(typeof z!=="string"){z+=""}B.push(unescape(encodeURIComponent(z)))}}}};k.getBlob=function(v){if(!arguments.length){v=null}return new t(this.data.join(""),v,"raw")};k.toString=function(){return"[object BlobBuilder]"};s.slice=function(y,v,x){var w=arguments.length;if(w<3){x=null}return new t(this.data.slice(y,w>1?v:this.data.length),x,this.encoding)};s.toString=function(){return"[object Blob]"};return u}(self));

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||(function(h){"use strict";var r=h.document,l=function(){return h.URL||h.webkitURL||h},e=h.URL||h.webkitURL||h,n=r.createElementNS("http://www.w3.org/1999/xhtml","a"),g="download" in n,j=function(t){var s=r.createEvent("MouseEvents");s.initMouseEvent("click",true,false,h,0,0,0,0,0,false,false,false,false,0,null);return t.dispatchEvent(s)},o=h.webkitRequestFileSystem,p=h.requestFileSystem||o||h.mozRequestFileSystem,m=function(s){(h.setImmediate||h.setTimeout)(function(){throw s},0)},c="application/octet-stream",k=0,b=[],i=function(){var t=b.length;while(t--){var s=b[t];if(typeof s==="string"){e.revokeObjectURL(s)}else{s.remove()}}b.length=0},q=function(t,s,w){s=[].concat(s);var v=s.length;while(v--){var x=t["on"+s[v]];if(typeof x==="function"){try{x.call(t,w||t)}catch(u){m(u)}}}},f=function(t,u){var v=this,B=t.type,E=false,x,w,s=function(){var F=l().createObjectURL(t);b.push(F);return F},A=function(){q(v,"writestart progress write writeend".split(" "))},D=function(){if(E||!x){x=s(t)}w.location.href=x;v.readyState=v.DONE;A()},z=function(F){return function(){if(v.readyState!==v.DONE){return F.apply(this,arguments)}}},y={create:true,exclusive:false},C;v.readyState=v.INIT;if(!u){u="download"}if(g){x=s(t);n.href=x;n.download=u;if(j(n)){v.readyState=v.DONE;A();return}}if(h.chrome&&B&&B!==c){C=t.slice||t.webkitSlice;t=C.call(t,0,t.size,c);E=true}if(o&&u!=="download"){u+=".download"}if(B===c||o){w=h}else{w=h.open()}if(!p){D();return}k+=t.size;p(h.TEMPORARY,k,z(function(F){F.root.getDirectory("saved",y,z(function(G){var H=function(){G.getFile(u,y,z(function(I){I.createWriter(z(function(J){J.onwriteend=function(K){w.location.href=I.toURL();b.push(I);v.readyState=v.DONE;q(v,"writeend",K)};J.onerror=function(){var K=J.error;if(K.code!==K.ABORT_ERR){D()}};"writestart progress write abort".split(" ").forEach(function(K){J["on"+K]=v["on"+K]});J.write(t);v.abort=function(){J.abort();v.readyState=v.DONE};v.readyState=v.WRITING}),D)}),D)};G.getFile(u,{create:false},z(function(I){I.remove();H()}),z(function(I){if(I.code===I.NOT_FOUND_ERR){H()}else{D()}}))}),D)}),D)},d=f.prototype,a=function(s,t){return new f(s,t)};d.abort=function(){var s=this;s.readyState=s.DONE;q(s,"abort")};d.readyState=d.INIT=0;d.WRITING=1;d.DONE=2;d.error=d.onwritestart=d.onprogress=d.onwrite=d.onabort=d.onerror=d.onwriteend=null;h.addEventListener("unload",i,false);return a}(self));
//////

function saveFile (output, format) {
  var bb = new BlobBuilder;
  bb.append(output);
  saveAs(bb.getBlob("text/plain;charset=utf-8"), TITLE + format);
}

var PLAYER              = unsafeWindow.document.getElementById('movie_player'),
    VIDEO_ID            = unsafeWindow.yt.getConfig('VIDEO_ID'),
    TITLE               = unsafeWindow.yt.playerConfig.args.title,
    FORMATS             = {srt: '.srt', text: 'text'},
    FORMAT_SELECTOR_ID  = 'format_selector',
    caption_array = [];

var makeTimeline = function (time) {
  var string,
      time_array   = [],
      milliseconds = Math.round(time % 1 * 1000).toString();

  while (3 > milliseconds.length) {
    milliseconds = '0' + milliseconds;
  }

  time_array.push(Math.floor(time / (60 * 60)));
  time_array.push(Math.floor((time - (time_array[0] * 60 * 60)) / 60));
  time_array.push(Math.floor(time - ((time_array[1] * 60) + (time_array[0] * 60 * 60))));

  for (var i = 0, il = time_array.length; i < il; i++) {
    string = '' + time_array[i];

    if (1 === string.length) {
      time_array[i] = '0' + string;
    }
  }

  return time_array.join(":") + "," + milliseconds;
}

function loadCaption (selector) {
  var caption = caption_array[selector.selectedIndex - 1];

  if (!caption) return;

  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://video.google.com/timedtext?hl=' + caption.lang_code +
         '&lang=' + caption.lang_code + '&name=' + caption.name + '&v=' + VIDEO_ID,
    onload:function(xhr) {
      if (xhr.responseText !== "") {
        var caption, previous_start, start, end,
            captions      = new DOMParser().parseFromString(xhr.responseText, "text/xml").getElementsByTagName('text'),
            textarea      = document.createElement("textarea"),
            output_format = FORMATS[document.getElementById(FORMAT_SELECTOR_ID).value] || FORMATS['srt'],
            srt_output    = '';

        for (var i = 0, il = captions.length; i < il; i++) {
          caption = captions[i];
          start   = +caption.getAttribute('start');

          if (0 <= previous_start) {
            textarea.innerHTML = captions[i - 1].textContent.replace(/</g, "&lt;").
                                                             replace( />/g, "&gt;" );
            if (output_format === FORMATS['text']) {
                srt_output += textarea.value + "\n";
            } else {
                srt_output += i + "\n" + makeTimeline(previous_start) + ' --> ' +
                              makeTimeline(start) + "\n" + textarea.value + "\n\n";
            }
            previous_start = null;
          }

          if (end = +caption.getAttribute('dur')) {
            end = start + end;
          } else {
            if (captions[i + 1]) {
              previous_start = start;
              continue;
            }
            end = PLAYER.getDuration();
          }

          textarea.innerHTML = caption.textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if (output_format === FORMATS['text']) {
              srt_output += textarea.value + "\n";
          } else {
            srt_output   += i + "\n" + makeTimeline(start) + ' --> ' +
                                makeTimeline(end) + "\n" + textarea.value + "\n\n";
          }
        }

        textarea = null;

        saveFile(srt_output, output_format);
      } else {
        alert("Error: No response from server.");
      }

      selector.options[0].selected = true;

    }
  });
}

function loadCaptions (select) {
  GM_xmlhttpRequest({
    method: 'GET',
    url:    'http://video.google.com/timedtext?hl=en&v=' + VIDEO_ID + '&type=list',
    onload: function( xhr ) {

      var caption, option, caption_info,
          captions = new DOMParser().parseFromString(xhr.responseText, "text/xml").
                                     getElementsByTagName('track');

      if (captions.length === 0) {
        return select.options[0].textContent = 'No captions.';
      }

      for (var i = 0, il = captions.length; i < il; i++) {
        caption      = captions[i];
        option       = document.createElement('option');
        caption_info = {
          name:      caption.getAttribute('name'),
          lang_code: caption.getAttribute('lang_code'),
          lang_name: caption.getAttribute('lang_translated')
        };

        caption_array.push(caption_info);
        option.textContent = caption_info.lang_name;

        select.appendChild(option);
      }

      select.options[0].textContent = 'Download captions.';
      select.disabled               = false;
    }
  });
}

function loadFormats (select) {
  var type

  for (type in FORMATS) {
    option             = document.createElement('option');
    option.value       = type;
    option.textContent = FORMATS[type];

    select.appendChild(option);
  }

  select.options[0].textContent = 'Select caption format.';
  select.disabled               = false;
}

(function () {
  var div      = document.createElement('div'),
      select   = document.createElement('select'),
      option   = document.createElement('option'),
      controls = document.getElementById('watch7-headline');

  div.setAttribute( 'style', 'display: inline-block;' );

  select.id       = 'captions_selector';
  select.disabled = true;

  option.textContent = 'Loading...';
  option.selected    = true;

  select.appendChild(option);
  select.addEventListener('change', function() {
    loadCaption(this);
  }, false);

  div.appendChild(select);


  var format_div       = document.createElement('div'),
      format_select    = document.createElement('select'),
      format_option    = document.createElement('option');

  format_div.setAttribute('style', 'display: inline-block;');

  format_select.id         = FORMAT_SELECTOR_ID;
  format_select.disabled   = true;

  format_option.textContent    = 'Loading...';
  format_option.selected       = true;

  format_select.appendChild(format_option);

  format_div.appendChild(format_select);

  controls.appendChild(format_div);
  controls.appendChild(div);

  loadFormats(format_select);
  loadCaptions(select);
})();

