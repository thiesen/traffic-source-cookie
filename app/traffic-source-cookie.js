// https://github.com/dm-guy/utm-alternative

(function(cookieName, domain){

    var traffic_source_COOKIE_TOKEN_SEPARATOR = ">>";
    var traffic_source_date_SEPARATOR = "|>"
    var NONE = "(none)";

    domain = domain || window.location.hostname;

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

    function getCampaignQuery(){
      var query = window.location.search.substring(1);
      if((query.indexOf("utm_campaign") != -1) || (query.indexOf("utm_campaign") != -1)) {
        parsedQuery = query;
      } else {
        parsedQuery = "";
      }
      return parsedQuery;
    }

    function setCookie(cookie, value){
        var expires = new Date();
        expires.setTime(expires.getTime() + 62208000000);
        document.cookie = cookie + "=" + value + "; expires=" + expires.toGMTString() + "; domain=" + domain + "; path=/";
    }

    function isNotNullOrEmpty(string){
        return string !== null && string !== "";
    }

    function removeProtocol(href) {
        return href.replace(/.*?:\/\//g, "");
    }

    function getCookieValue() {
      var traffic_source = "";
      var utmzCookie = getCookie("__utmz");
      var cookieCampaignParams = getCampaignQuery();
      if(utmzCookie != null) {
        traffic_source = "utmz:" + utmzCookie;
      } else if(isNotNullOrEmpty(cookieCampaignParams)) {
        traffic_source = "campaign:" + cookieCampaignParams;
      } else {
        traffic_source = document.referrer;
      }
      return traffic_source;
    }
    if(document.cookie.indexOf(cookieName) === -1) {
      setCookie(cookieName, getCookieValue());
    } else {
      console.log("%"); // WIP - append new traffic info to existing cookie
    }
 })("__trf.src", ".resultadosdigitais.com.br");
