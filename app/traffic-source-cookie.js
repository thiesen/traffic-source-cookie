"use strict";
// https://github.com/dm-guy/utm-alternative

var TrafficSourceCookie;

(function () {
  if (typeof TrafficSourceCookie != 'undefined' ) return;

  var COOKIE_TOKEN_SEPARATOR = ">>";
  var NONE = "(none)";

  var cookieName, cookieDomain,

    init = function (name, domain) {
      cookieName = name;
      cookieDomain = domain || window.location.hostname;

      if (document.cookie.indexOf(cookieName) === -1) {
        source = generateSourceData();
        generateCookie(cookieName, source, source);
      } else {
        acquisition = getAcquisitionSource(cookieName);
        existingConversionSource = getConversionSource(cookieName);
        newConversionSource = generateSourceData();

        if (existingConversionSource != newConversionSource) {
          generateCookie(cookieName, acquisition, newConversionSource);
        }

      }

    },

    getCookie = function () {
      var name = cookieName + "=";
      var cookieArray = document.cookie.split(';');

      for(var i = 0; i < cookieArray.length; i++){
        var cookie = cookieArray[i].replace(/^\s+|\s+$/g, '');

        if (cookie.indexOf(name) === 0){
          return cookie.substring(name.length,cookie.length);
        }

      }

      return null;
    },

    setCookie = function (value) {
      var expires = new Date();
      expires.setTime(expires.getTime() + 62208000000);
      document.cookie = cookieName + "=" + cookieValue + "; expires=" + expires.toGMTString() + "; domain=" + cookieDomain + "; path=/";
    },

    setConversionSource = function () {
      existingCookieValue = getCookie(cookieName);
      newValue = parseCookieValue();

      if (firstCookieParam(cookieName) == newValue) {
        return;
      }

      newCookieValue = newValue + COOKIE_TOKEN_SEPARATOR + existingCookieValue;
      setCookie(cookieName, newCookieValue);
    },

    getConversionSource = function () {
      var cookieParams = getCookie(cookieName).split(COOKIE_TOKEN_SEPARATOR);
      return cookieParams[0];
    },

    getAcquisitionSource = function () {
      var cookieParams = getCookie(cookieName).split(COOKIE_TOKEN_SEPARATOR);
      return cookieParams[1];
    },

    getCampaignQuery = function () {
      var query = window.location.search.substring(1);
      var parsedQuery = "";

      if ((query.indexOf("utm_campaign") != -1) || (query.indexOf("utm_campaign") != -1)) {
        parsedQuery = query;
      }

      return parsedQuery;
    },

    isNotNullOrEmpty = function (string) {
      return string !== null && string !== "";
    },

    removeProtocol = function (href) {
      return href.replace(/.*?:\/\//g, "");
    },

    generateSourceData = function () {
      var traffic_source = "";
      var utmzCookie = getCookie("__utmz");
      var cookieCampaignParams = getCampaignQuery();

      if (utmzCookie !== null) {
        traffic_source = "utmz:" + utmzCookie;
      } else if (isNotNullOrEmpty(cookieCampaignParams)) {
        traffic_source = "campaign:" + cookieCampaignParams;
      } else if (isNotNullOrEmpty(document.referrer)) {
        traffic_source = document.referrer;
      } else {
        traffic_source = NONE;
      }

      return traffic_source;
    },

    generateCookie = function (acquisitionSource, conversionSource) {
      cookieValue = conversionSource + COOKIE_TOKEN_SEPARATOR + acquisitionSource;
      setCookie(cookieName, cookieValue);
    };

    TrafficSourceCookie = {
      init : init
    };

}());
