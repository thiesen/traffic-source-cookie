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
        var source = generateSourceData(true);
        generateCookie(source, source);
      } else {
        var cookieParams = getCookiesParams();
        var existingConversionSource = cookieParams[0];
        var acquisition = cookieParams[1];
        var newConversionSource = generateSourceData();

        if (existingConversionSource != newConversionSource) {
          generateCookie(acquisition, newConversionSource);
        }

      }

    },

    encodeValue = function(value) {
      if (typeof window.btoa == 'function') {
        return btoa(value);
      }

      return value;
    },

    decodeValue = function(value) {
      if (typeof window.atob == 'function') {
        return atob(value);
      }

      return value;
    },

    getCookie = function (ck_name) {
      var name = ck_name + "=",
          cookieArray = document.cookie.split(';');

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
      document.cookie = cookieName + "=" + value + "; expires=" + expires.toGMTString() + "; domain=" + cookieDomain + "; path=/";
    },

    getCookiesParams = function () {
      var cookieValue = getCookie(cookieName);

      if (cookieValue.length > 0 && !cookieValue.includes(COOKIE_TOKEN_SEPARATOR)) {
        cookieValue = decodeValue(cookieValue);
      }

      return cookieValue.split(COOKIE_TOKEN_SEPARATOR);
    },

    getCampaignQuery = function () {
      var query = window.location.search.substring(1);
      var parsedQuery = "";

      if ((query.indexOf("utm_campaign") != -1) || (query.indexOf("utm_source") != -1)) {
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

    generateSourceData = function (isAcquisition) {
      var traffic_source = "",
          utmzCookie = getCookie("__utmz"),
          cookieCampaignParams = getCampaignQuery();

      if (utmzCookie !== null && isAcquisition) {
        traffic_source = utmzCookie;
      } else if (isNotNullOrEmpty(cookieCampaignParams)) {
        traffic_source = cookieCampaignParams;
      } else if (isNotNullOrEmpty(document.referrer)) {
        traffic_source = document.referrer.split(';')[0];
      } else {
        traffic_source = NONE;
      }

      return traffic_source;
    },

    generateCookie = function (acquisitionSource, conversionSource) {
      var cookieValue = conversionSource + COOKIE_TOKEN_SEPARATOR + acquisitionSource;
      cookieValue = encodeValue(cookieValue);

      setCookie(cookieValue);
    };

    TrafficSourceCookie = {
      init : init
    };

}());
