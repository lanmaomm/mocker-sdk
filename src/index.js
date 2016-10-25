console.log(Vue);
var mocker = {
    init: function() {
        renderCss();
        this.renderDom();
        this.startIntercept();
    },

    isAddEvent: false,

    startIntercept: function() {
        var self = this;
        //if (!$) return;

        // jquery before send listener
        if (typeof jQuery !== 'undefined') {
            $(document).ajaxSend(changeSettings);
        
        } else if(typeof Vue !== 'undefined'){
            Vue.http.interceptors.push(function(request, next) {
                // ...
                changeVueSettings(request);
                // ...
                next(function(response) {
                    return response
                })
            })
        } else{// zepto before send listener
            $(document).on('ajaxBeforeSend', function(event, xhr, settings) {
                changeSettings(event, xhr, settings);
            });
        }
    },

    renderDom: function() {
        var container = document.createElement('div');
        var isMockEnable = checkMockAvailability();
        var self = this;

        var className = isMockEnable ? 'mock-trigger' : 'mock-trigger mock-trigger--disable';

        container.setAttribute('class', className);
        container.setAttribute('id', 'mock-trigger');
        container.innerHTML = '<button id="js-mock-trigger-confirm" draggable="true" class="btn btn-success">M</button>';

        document.body.appendChild(container);
        document.getElementById('js-mock-trigger-confirm').addEventListener('click', function() {
            if (!document.getElementById('mock-pop')) {
                self.popup();
            } else {
                self.dePopup();
            }
        });

        document.getElementById('js-mock-trigger-confirm').addEventListener('dragend', function(e) {
            document.getElementById('js-mock-trigger-confirm').style.position = 'fixed';
            document.getElementById('js-mock-trigger-confirm').style.left = e.x + 'px';
            document.getElementById('js-mock-trigger-confirm').style.top = e.y + 'px';
        });
    },

    dePopup: function() {
        document.body.removeChild(document.getElementById('mock-pop'));
        this.isAddEvent = false;
    },

    popup: function() {
        var container = document.createElement('div');
        var mockInfo = decodeURIComponent(getMockOption());
        var mockInfoArr = mockInfo && mockInfo.split('&&');

        var proInfo = '';
        var verInfo = '';

        if (mockInfoArr.length === 2) {
            proInfo = mockInfoArr[0].split('@@')[1];
            verInfo = mockInfoArr[1].split('@@')[1];
        }
        container.setAttribute('class', 'mock-pop');
        container.setAttribute('id', 'mock-pop');
        container.innerHTML = '<div class="pop__mask">' +
        '</div>' +
        '<div class="pop__content">' +
        '   <div class="group">' +
        '       <label>项目：</label>' +
        '       <input id="js-mock-pop-pro" placeholder="填入在mock后台设置的项目别名" value="' + proInfo + '" />' +
        '   </div>' +
        '   <div class="group">' +
        '       <label>版本：</label>' +
        '       <input id="js-mock-pop-ver" placeholder="填入在mock后台设置的版本号" value="' + verInfo + '" />' +
        '   </div>' +
        '   <div class="group group-btn">' +
        '       <button id="js-mock-pop-confirm" class="btn btn-success js-confirm">使用mock</button>' +
        '       <button id="js-mock-pop-cancel" class="btn btn-danger js-cancel">禁用mock</button>' +
        '   </div>' +
        '   <div class="group">' +
        '       <a class="help-link" href="http://mock.qima-inc.com/help" target="_blank">使用说明</a>' +
        '   </div>' +
        '   <div class="group">' +
        '       <a class="help-link" href="http://mock.qima-inc.com" target="_blank">mock后台</a>' +
        '   </div>' +
        '</div>';

        document.body.appendChild(container);
        if (!this.isAddEvent) {
            this.addEventHandler();
            this.isAddEvent = true;
        }
    },

    addEventHandler: function() {
        var confirmBtn = document.getElementById('js-mock-pop-confirm');
        var cancelBtn = document.getElementById('js-mock-pop-cancel');
        var self = this;
        this.addEvent = true;

        confirmBtn.addEventListener('click', function() {
            var project = document.getElementById('js-mock-pop-pro').value;
            var version = document.getElementById('js-mock-pop-ver').value;

            setMockOption(project, version);
            setMockAvailability(true);

            document.getElementById('mock-trigger').setAttribute('class', 'mock-trigger');
            self.dePopup();
        });

        cancelBtn.addEventListener('click', function() {
            setMockAvailability(false);
            document.getElementById('mock-trigger').setAttribute('class', 'mock-trigger mock-trigger--disable');
            self.dePopup();
        });
    } 
};

var checkMockAvailability = function() {
  return localStorage.getItem('MOCK_AVAILABILITY') !== 'false';
};

var setMockAvailability = function(able) {
  localStorage.setItem('MOCK_AVAILABILITY', able);
};

var getMockOption = function() {
  return localStorage.getItem('MOCK_OPTION');
};

var setMockOption = function(project, version) {
  localStorage.setItem('MOCK_OPTION', 'project@@' + project + '&&version@@' + version);
}

var changeVueSettings = function(request) {
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
    var originUrl = request.url;
    var originMethod = request.method;
    var data = request.data;

    var urlPattern = /qima-inc\.com/;
    var mockUrl = 'http://';

    var localPattern = /\/\/localhost/;
    var localPattern2 = /\/\/127\.0\.0\.1/;

    if (localPattern.test(originUrl) || localPattern2.test(originUrl)) {
        return;
    }

    if (urlPattern.test(window.location.host)) {
        mockUrl += 'mock.qima-inc.com';
    } else {
        mockUrl += 'mock.koudaitong.com';
    }

    if (localStorage && localStorage.getItem('mockDebug')) {
        mockUrl += ':3104';
    }

    mockUrl += '/mock';

    var location = document.createElement('a');
    location.href = originUrl;

    var qs = ['project=' + proInfo, 'version=' + verInfo , 'api=' + location.pathname.slice(1), 'qs=' + encodeURIComponent(location.search), 'server=' + location.origin];

    request.url = mockUrl + '?' + qs.join('&&');
    // 跨域发送请求
    request.xhrFields = request.xhrFields || {};
    request.xhrFields.withCredentials = true;
    var async = 'async' in request ? request.async : true;
    /*if (xhr.open) {
        xhr.open(request.type, request.url, async, request.username, request.password);
    }*/
};
var changeSettings = function(event, xhr, settings) {
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

    if (urlPattern.test(window.location.host)) {
        mockUrl += 'mock.qima-inc.com';
    } else {
        mockUrl += 'mock.koudaitong.com';
    }

    if (localStorage && localStorage.getItem('mockDebug')) {
        mockUrl += ':3104';
    }

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

var renderCss = function() {
    var stylesheet = '';
    var maskText = '.mock-pop .pop__mask{position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: black;z-index: 1000;opacity: 0.3;}';
    var contentText = '.mock-pop .pop__content{position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);padding:20px;width: 300px;background: white;z-index: 10001;}';
    var groupText = '.mock-pop .pop__content .group{margin-bottom;} .mock-pop .pop__content .group {margin-bottom:20px;} .mock-pop .pop__content .group-btn{margin-top:60px;text-align:center;}';
    var inputText = '.mock-pop .pop__content input{display: inline-block;background-color: #fff;background-image: none;height: 22px;padding: 8px 12px;font-family: Lato,Helvetica,Arial,sans-serif;font-size: 15px;line-height: 1.467;color: #34495e;border: 2px solid #bdc3c7;border-radius: 6px;box-shadow: none;-webkit-transition: border .25s linear,color .25s linear,background-color .25s linear;transition: border .25s linear,color .25s linear,background-color .25s linear;width:90%}';
    var buttonText = '.mock-pop .btn{padding: 10px 15px;font-size: 15px;font-weight: 400;line-height: 1.4;border: none;border-radius: 4px;-webkit-transition: border .25s linear,color .25s linear,background-color .25s linear;transition: border .25s linear,color .25s linear,background-color .25s linear;-webkit-font-smoothing: subpixel-antialiased;} .mock-trigger .btn-success{color: #fff;background-color: #2ecc71;}.mock-trigger--disable .btn{color: #fff;background-color: #e74c3c;}.mock-trigger .btn-danger{color: #fff;background-color: #e74c3c;}}';
    var triggerText = '.mock-trigger {position:fixed;display:block!important;left:10%;bottom:10px;width:30px;height:30px;z-index:10002;};.mock-trigger .btn{border-radius: 50%;padding: 0;width: 30px;height: 30px;font-size: 16px;outline: none;} .mock-trigger--disable {background-color:#d35400;}';
    var helpLinkText = '.mock-pop .help-link {color:#3498DB;};';

    var style = document.createElement('style');
    style.innerHTML = maskText + contentText + inputText + buttonText + groupText + triggerText + helpLinkText;

    document.head.appendChild(style);
};

var mockListener = function() {
  setTimeout(function() {
    if (typeof Zepto !== 'undefined' || typeof jQuery !== 'undefined' || typeof Vue !=='undefined') {
      mocker.init();
    } else {
      mockListener();
    }
  }, 100);
}

mockListener();
