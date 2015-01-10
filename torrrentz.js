(function(){
  var ec=encodeURIComponent,
      mm=function(h,n,t){return '<a style=float:left;margin-right:1px href=magnet:?xt=urn:btih:'+ec(h.toUpperCase())+'&dn='+ec(n)+t.map(function(v){return '&tr='+ec(v)}).join()+'>(m)</a>'},
     pu=function(t){return t.replace(/\[.*?\]/g,'').replace(/[\.\[\]-]/g,' ').toLowerCase().replace(/(.*)s0*([0-9]+?)e0*([0-9]+).*$/,'$1$2x$3').replace(/\b(web ?dl|(brr?|hd|web|dvd|cam|bd)rip|truefrench|dvdscr|eztv|hd(tv|cam)|[hx]264|yify|xvid|bluray|ettv|ac3|mkv|(720|480|1080)p)\b.*/,'').replace(/\s+/g,' ').trim()},
      mi=function(n){return '<a style=float:left;margin-right:3px href=https://www.google.com/search?btnI&q=site:imdb.com%2Ftitle%2F%20'+ec(n.replace(/\s+[0-9]+x[0-9]+\s+/,' '))+'>(i)</a>'};

  // add links to upper left to result page
  if(/^\/[a-f0-9]{40}$/.test(location.pathname))
    $('body').append('<span style=position:fixed;top:0;left:0>'+mm(location.pathname.substr(1), $('.files li.t').text(), $('.trackers dt a').map(function(i,e){return e.firstChild.nodeValue}).toArray())+mi(pu($('.files li.t').text()))+'</span>');

  var seen = {},
      remove_dup = "/aN/aA/aS/sN/sA/sS/vN/vS/my/".indexOf((location.pathname+"/").replace(/ny|erified|earch/,''))==-1 && !/%2B/.test(location.search);

  // modify results
  $('.results dt a').each(function(){
    var e= $(this);
    
    // remove porn results
    if(!/\bxxx\b/.test(location.search) && /\b(xxx|porn)\b/.test(e.parent().text())){
      $(this).closest('dl').remove();
      return
    }

    // remove duplicates results
    var t = pu(e.text());
    if(remove_dup) {
      if(!(t in seen)) seen[t]= 1;
      else {
        $(this).closest('dl').remove();
        return
      }
    }

    // add links to results
    $(mm(e.attr('href').substr(1),e.text(),[])).insertBefore(e).click(function(){
      if(-1==$(this).attr('href').indexOf('&tr='))
        $(this).attr('href', function(i,v){
          return v+$('.trackers dt a', $.ajax({url:e.attr('href'),async:!1}).responseText).map(function(i,e){return '&tr='+encodeURIComponent(e.firstChild.nodeValue)}).toArray().join()
        })
    });
    $(mi(pu(e.text()))).insertBefore(e)
  })
})();
