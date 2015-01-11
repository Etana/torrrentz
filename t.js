// small jquery implemntation
var $ = function(c, s) {
  var t= this;
  if(t.__proto__.constructor !== $) { return new $(c,s) };

  if(s) {
    var d = document.implementation.createHTMLDocument().documentElement; 
    d.innerHTML = s;
    s = d;
  } else {
    s = document;
  };

  if(typeof(c) == "string") {
    if(c.indexOf('<')==-1)
      c = s.querySelectorAll(c);
    else { 
      var e = document.createElement('div')
      e.innerHTML= c;
      c = e.childNodes
    }
  } if(c instanceof NodeList) {
    c = [].slice.call(c);
  } else if(c instanceof Array) {} else {
    c = [c];
  };
   
  t.s = s;
  t.c = c;

  t.remove = function() { c.forEach(function(e){ e.parentNode.removeChild(e) }) };
  t.map = function(f) { return c.map(f) };
  t.insertBefore = function(e) { var s = $(e).c[0]; c.reverse(); c.forEach(function(e){ s.parentNode.insertBefore(e, s) }); return t; }
  t.on = function(n, f) { c.forEach(function(e){ e.addEventListener(n, f) }) };
  t.text = function() { return c[0].innerText };
  t.parent = function() { return $(c[0].parentNode); }
};

$.get = function(u) {
  var r = new XMLHttpRequest();
  r.open('GET', u, false);
  r.send();

  return r.responseText
};

var com ='<a style=float:left;margin-right:3px href=',
    ec=encodeURIComponent,
    mm=function(h,n,t){return com+'magnet:?xt=urn:btih:'+ec(h.toUpperCase())+'&dn='+ec(n)+t.map(function(v){return '&tr='+ec(v)}).join()+'>(m)</a>'},
    pu=function(t){return t.replace(/\[.*?\]/g,'').replace(/[\.\[\]-]/g,' ').toLowerCase().replace(/(.*)s0*([0-9]+?)e0*([0-9]+).*$/,'$1$2x$3').replace(/\b((web|brr?|[hb]d|dvd|cam) ?(rip|scr|tv|cam)|truefrench|screener|[hx]264|yify|xvid|bluray|ettv|ac3|mkv|(72|48|108)0p)\b.*/,'').replace(/\s+/g,' ').trim()},
    mi=function(n){return com+'https://www.google.com/search?btnI&q=site:imdb.com%2Ftitle%20'+ec(n.replace(/\s+[0-9]+x[0-9]+\s+/,' '))+'>(i)</a>'};


// add links to upper left to result page
if(/^\/[a-f0-9]{40}$/.test(location.pathname))
  $('<span style=position:fixed;top:0;left:0>'+mm(location.pathname.substr(1), $('.files li.t').text(), $('.trackers dt a').map(function(e){return $(e).text()}))+mi(pu($('.files li.t').text()))+'</span>').insertBefore('.footer');

var seen = {},
    remove_dup = "/aN/aA/aS/sN/sA/sS/vN/vS/my/".indexOf((location.pathname+"/").replace(/ny|erified|earch/,''))==-1 && !/%2B/.test(location.search);

// modify results
$('.results dt a').map(function(result_link){
  // remove porn results
  if(!/\bxxx\b/.test(location.search) && /\b(xxx|porn)\b/.test($(result_link).parent().parent().text())){
    $(result_link).parent().parent().remove();
    return
  }

  // remove duplicates results
  var t = pu($(result_link).text());
  if(remove_dup) {
    if(!(t in seen)) seen[t]= 1;
    else {
      $(result_link).parent().parent().remove();
      return
    }
  }

  // add links to results
  $(mm(result_link.getAttribute('href').substr(1), $(result_link).text(),[])).insertBefore(result_link).on('click', function(){
    if(-1==this.getAttribute('href').indexOf('&tr='))
      this.setAttribute('href', this.getAttribute('href')+$('.trackers dt a', $.get(result_link.getAttribute('href'))).map(function(e){return '&tr='+encodeURIComponent($(e).text())}).join());
  });
  $(mi(pu($(result_link).text()))).insertBefore(result_link)
})
