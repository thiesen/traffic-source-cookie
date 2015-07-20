// https://github.com/dm-guy/utm-alternative

(function() {

  var cookieName = _trf.ckn
  var domain = _trf.dmn || window.location.hostname;

  var COOKIE_TOKEN_SEPARATOR = ">>";
  var NONE = "(none)";

  function getCookie(cookieName){
    var name = cookieName + "=";
    var cookieArray = document.cookie.split(';');
    for(var i = 0; i < cookieArray.length; i++){
      var cookie = cookieArray[i].replace(/^\s+|\s+$/g, '');
      if (cookie.indexOf(name)==0){
       return cookie.substring(name.length,cookie.length);
     }
   }
   return null;
  }

  function setCookie(cookieName, cookieValue){
    var expires = new Date();
    expires.setTime(expires.getTime() + 62208000000);
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + expires.toGMTString() + "; domain=" + domain + "; path=/";
  }

  function setConversionSource(cookieName) {
    existingCookieValue = getCookie(cookieName);
    newValue = parseCookieValue();
    if(firstCookieParam(cookieName) != newValue) {
      newCookieValue = newValue + COOKIE_TOKEN_SEPARATOR + existingCookieValue;
      setCookie(cookieName, newCookieValue);
    } else {
      return
    }
  }

  function getConversionSource(cookieName){
    var cookieParams = getCookie(cookieName).split(COOKIE_TOKEN_SEPARATOR);
    return cookieParams[0];
  }

  function getAcquisitionSource(cookieName){
    var cookieParams = getCookie(cookieName).split(COOKIE_TOKEN_SEPARATOR);
    return cookieParams[1];
  }

  function getCampaignQuery(){
    var query = window.location.search.substring(1);
    if((query.indexOf("utm_campaign") != -1) || (query.indexOf("utm_campaign") != -1)) {
      parsedQuery = query;
    } else {
      parsedQuery = "";
    }
    return parsedQuery;
  }

  function isNotNullOrEmpty(string){
    return string !== null && string !== "";
  }

  function removeProtocol(href) {
    return href.replace(/.*?:\/\//g, "");
  }

  function generateSourceData() {
    var traffic_source = "";
    var utmzCookie = getCookie("__utmz");
    var cookieCampaignParams = getCampaignQuery();
    if(utmzCookie != null) {
      traffic_source = "utmz:" + utmzCookie;
    } else if(isNotNullOrEmpty(cookieCampaignParams)) {
      traffic_source = "campaign:" + cookieCampaignParams;
    } else if(isNotNullOrEmpty(document.referrer)) {
      traffic_source = document.referrer;
    } else {
      traffic_source = NONE;
    }
    return traffic_source;
  }

  function generateCookie(cookieName, acquisitionSource, conversionSource) {
    cookieValue = conversionSource + COOKIE_TOKEN_SEPARATOR + acquisitionSource;
    setCookie(cookieName, cookieValue);

  }

  if(document.cookie.indexOf(cookieName) === -1) {
    source = generateSourceData();
    generateCookie(cookieName, source, source)
  } else {
    acquisition = getAcquisitionSource(cookieName);
    existingConversionSource = getConversionSource(cookieName);
    newConversionSource = generateSourceData();
    if (existingConversionSource != newConversionSource) {
      generateCookie(cookieName, acquisition, newConversionSource);
    }
  }
})();
