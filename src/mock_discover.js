import renderCss from './render_css';
import truncation from './truncation';
import renderButton from './render_button';
import renderPop from './render_pop';
import { checkMockAvailability, setMockAvailability, getMockOption, setMockOption } from './util';

const mocker = {
  init: function() {
    truncation();
    renderCss();
    renderButton();
    renderPop();
  },

  isAddEvent: false,

    renderDom: function() {
    },

    dePopup: function() {
        document.body.removeChild(document.getElementById('mock-pop'));
        this.isAddEvent = false;
    },

    popup: function() {

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
            document.getElementById('mock-trigger').setAttribute('class', 'mock-trigger mock-trigger--disabled');
            self.dePopup();
        });
    } 
};

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

export default mocker;
