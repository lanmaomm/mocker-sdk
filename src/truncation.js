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

const changeSettings = function(event, xhr, settings) {

    return;
    var isMockEnable = checkMockAvailability();
    var mockInfo = getMockOption();

    console.log(123);
    if (!isMockEnable || !mockInfo) {
      return;
    }

    console.log(mockInfo);
    var mockArr = mockInfo.split('&&');
    var proInfo = mockArr[0].split('@@')[1];
    var verInfo = mockArr[1].split('@@')[1];
    var originUrl = settings.url;
    var originMethod = settings.method;
    var data = settings.data;

    var urlPattern = /qima-inc\.com/;
    var mockUrl = 'http://';

    var localPattern = /\/\/localhost/;
    var localPattern2 = /\/\/127\.0\.0\.1/;

    if (localPattern.test(originUrl) || localPattern2.test(originUrl)) {
        return;
    }

    mockUrl += 'localhost:8787';
    mockUrl += '/mock';

    var location = document.createElement('a');
    location.href = originUrl;

    var qs = ['project=' + proInfo, 'version=' + verInfo , 'api=' + location.pathname.slice(1), 'qs=' + encodeURIComponent(location.search), 'server=' + location.origin];

    settings.url = mockUrl + '?' + qs.join('&&');
    // 跨域发送请求
    settings.xhrFields = settings.xhrFields || {};
    settings.xhrFields.withCredentials = true;
    var async = 'async' in settings ? settings.async : true;
    if (xhr.open) {
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);
    }
};

export default truncation;
