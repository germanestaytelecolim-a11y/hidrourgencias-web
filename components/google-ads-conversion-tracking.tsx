const GOOGLE_ADS_CONVERSION_ID = "AW-16486513262";
const GOOGLE_ADS_PHONE_CONVERSION_SEND_TO = "AW-16486513262/KXWbCKyknqoZEO70sLU9";

export function GoogleAdsConversionTracking() {
  const trackingScript = `
(function(){
  var id='${GOOGLE_ADS_CONVERSION_ID}';
  var sendTo='${GOOGLE_ADS_PHONE_CONVERSION_SEND_TO}';
  var loaded=false;
  var last=0;

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  function load(){
    if(loaded){return;}
    loaded=true;
    var s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag('js',new Date());
    window.gtag('config',id);
  }

  window.__hidrourgenciasLoadGtag=load;
  window.addEventListener('pointerdown',load,{once:true,passive:true});
  window.addEventListener('keydown',load,{once:true,passive:true});

  document.addEventListener('click',function(event){
    var node=event.target&&event.target.nodeType===1?event.target:event.target&&event.target.parentElement;
    var link=node&&node.closest&&node.closest('a[href^="tel:"]');
    if(!link||link.getAttribute('href').replace(/[\\s().-]/g,'').toLowerCase()!=='tel:+56940918672'){return;}
    var now=Date.now();
    if(now-last<3000){return;}
    last=now;
    load();
    window.gtag('event','conversion',{'send_to':sendTo});
  },true);
})();
`.trim();

  return <script id="google-ads-lazy-tracking" dangerouslySetInnerHTML={{ __html: trackingScript }} />;
}
