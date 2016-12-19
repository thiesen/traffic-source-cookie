// https://github.com/dm-guy/utm-alternative

/* jslint browser: true */

var TrafficSourceCookie;

(function () {
  'use strict';
  if (typeof TrafficSourceCookie !== 'undefined') return;

  var COOKIE_TOKEN_SEPARATOR = '>>';
  var COOKIE_PREFIX = 'encoded_';
  var QUERY_EXTRA_PARAMS = /rdst_srcid/;
  var NONE = '(none)';

  var cookieName;
  var cookieDomain;
  var source;

  var init = function (name, domain) {
    cookieName = name;
    cookieDomain = domain || window.location.hostname;
    source = window.location.search.substring(1);

    if (document.cookie.indexOf(cookieName) === -1) {
      var trafficSource = generateSourceData(true);
      generateCookie(trafficSource, trafficSource);
    } else {
      var cookieParams = getCookieParams();
      var existingConversionSource = cookieParams.current_session.value;
      var acquisition = cookieParams.first_session;
      var newConversion = generateSourceData();

      generateCookie(acquisition, newConversion);
    }
  };

  var encodeValue = function (value) {
    if (typeof window.btoa === 'function') return COOKIE_PREFIX + btoa(value);
    return value;
  };

  var decodeValue = function (value) {
    if (typeof window.atob !== 'function') return value;
    if (value.length > 0 && value.indexOf(COOKIE_PREFIX) === 0) {
      var decodedValue = value.replace(COOKIE_PREFIX, '');
      return atob(decodedValue);
    }
    return value;
  };

  var getCookie = function (ckName) {
    var name = ckName + '=';
    var cookieArray = document.cookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i].replace(/^\s+|\s+$/g, '');
      if (cookie.indexOf(name) === 0) return cookie.substring(name.length, cookie.length);
    }

    return null;
  };

  var setCookie = function (value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 62208000000);
    document.cookie = cookieName + '=' + value + '; expires=' + expires.toGMTString() + '; domain=' + cookieDomain + '; path=/';
  };

  var getCookieParams = function () {
    var cookieValue = getCookie(cookieName);
    cookieValue = decodeValue(cookieValue);

    try {
      cookieValue = JSON.parse(unescape(cookieValue));
    } catch (error) {
      cookieValue = cookieValue.split(COOKIE_TOKEN_SEPARATOR);
      cookieValue = mountJsonCookie({ value: cookieValue[1] }, { value: cookieValue[0] });
    }

    return cookieValue;
  };

  var getCampaignQuery = function () {
    if ((source.indexOf('utm_campaign') === -1) || (source.indexOf('utm_source') === -1)) return '';
    return source;
  };

  var getCampaignExtraParams = function () {
    var extraParam = {};

    source.split('&').forEach(function (param) {
      if (!param.match(QUERY_EXTRA_PARAMS)) return;
      var newParam = param.split('=');
      extraParam[newParam[0]] = newParam[1];
    });

    return extraParam;
  };

  var isNotNullOrEmpty = function (string) {
    return string !== null && string !== '';
  };

  var removeProtocol = function (href) {
    return href.replace(/.*?:\/\//g, '');
  };

  var generateSourceData = function (isAcquisition) {
    var utmzCookie = getCookie('__utmz');
    var cookieCampaignParams = getCampaignQuery();
    var trafficSource;

    if (utmzCookie !== null && isAcquisition) {
      trafficSource = utmzCookie;
    } else if (isNotNullOrEmpty(cookieCampaignParams)) {
      trafficSource = cookieCampaignParams;
    } else if (isNotNullOrEmpty(document.referrer)) {
      trafficSource = document.referrer.split(';')[0];
    } else {
      trafficSource = NONE;
    }

    return {
      value: trafficSource,
      extra_params: getCampaignExtraParams()
    };
  };

  var mountJsonCookie = function (acquisitionSource, conversionSource) {
    return {
      first_session: acquisitionSource,
      current_session: conversionSource
    };
  };

  var generateCookie = function (acquisitionSource, conversionSource) {
    var cookieValue = mountJsonCookie(acquisitionSource, conversionSource);
    var encodedCookieValue = encodeValue(JSON.stringify(cookieValue));
    setCookie(encodedCookieValue);
  };

  TrafficSourceCookie = {
    init: init
  };
}());
