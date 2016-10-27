import { checkMockAvailability, setMockAvailability, getMockOption, setMockOption } from './util';

const truncation = function() {
  if(typeof Vue !== 'undefined'){
    Vue.http.interceptors.push(function(request, next) {
      changeVueSettings(request);
      next(function(response) {
        return response
      })
    })
  } else if (typeof jQuery !== 'undefined') {
    $(document).ajaxSend(changeSettings);

  } else{
    // zepto before send listener
    $(document).on('ajaxBeforeSend', function(event, xhr, settings) {
      changeSettings(event, xhr, settings);
    });
  }
}
const changeVueSettings = function(request) {
    var isMockEnable = checkMockAvailability();
    console.log(123);
    if (!isMockEnable) {
      return;
    }
    debugger;
    let originUrl = request.url;
    if (/\/\/localhost/.test(originUrl) || /\/\/127\.0\.0\.1/.test(originUrl)) {
        return;
    }

    let mockInfo = getMockOption();
    let originData = request.data;
    let mockUrl = 'http://localhost:8787/mock';
    let location = document.createElement('a');
    location.href = originUrl;
    let query = [
      `project=${mockInfo.project}`,
      `version=${mockInfo.version}`,
      `api=${location.pathname.slice(1)}`,
      `qs=${encodeURIComponent(location.search)}`,
      `server=${location.origin}`
    ]

    request.url = mockUrl + '?' + query.join('&');
    request.xhrFields = request.xhrFields || {};
    request.xhrFields.withCredentials = true;
    var async = 'async' in request ? request.async : true;
}

const changeSettings = function(event, xhr, settings) {
    let isMockEnable = checkMockAvailability();

    if (!isMockEnable) {
      return;
    }

    let originUrl = settings.url;
    if (/\/\/localhost/.test(originUrl) || /\/\/127\.0\.0\.1/.test(originUrl)) {
        return;
    }

    let mockInfo = getMockOption();
    let originData = settings.data;
    let mockUrl = 'http://localhost:8787/mock';
    let location = document.createElement('a');
    location.href = originUrl;
    let query = [
      `project=${mockInfo.project}`,
      `version=${mockInfo.version}`,
      `api=${location.pathname.slice(1)}`,
      `qs=${encodeURIComponent(location.search)}`,
      `server=${location.origin}`
    ]

    settings.url = mockUrl + '?' + query.join('&');
    settings.xhrFields = settings.xhrFields || {};
    settings.xhrFields.withCredentials = true;
    var async = 'async' in settings ? settings.async : true;
    if (xhr.open) {
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);
    }
};

export default truncation;
