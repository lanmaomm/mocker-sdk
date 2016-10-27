import { checkMockAvailability, setMockAvailability, getMockOption, setMockOption } from './util';

const renderPop = () => {
    let container = document.createElement('div');
    let mockInfo = getMockOption();
    container.setAttribute('class', 'mock-pop mock-pop-hidden');
    container.setAttribute('id', 'js-mock-pop');
    container.innerHTML = [
      '<div class="mock-pop__content">',
        '<div class="group">',
          '<label>项目：</label>',
          '<input id="js-mock-pop-pro" placeholder="填入在mock后台设置的项目别名" value="', mockInfo.project, '" />',
        '</div>',
        '<div class="group">',
          '<label>版本：</label>',
          '<input id="js-mock-pop-ver" placeholder="填入在mock后台设置的版本号" value="', mockInfo.version , '" />',
        '</div>',
        '<div class="group group-btn">',
          '<button id="js-mock-pop-confirm" class="mock-btn">使用mock</button>',
          '<button id="js-mock-pop-cancel" class="mock-btn mock-btn-danger">禁用mock</button>',
        '</div>',
        '<div class="group group-btn">',
          '<a class="help-link" href="#" target="_blank">使用说明</a>',
          '<a class="help-link" href="http://mock.qima-inc.com" target="_blank">mock后台</a>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(container);

    document.getElementById('js-mock-pop-confirm').addEventListener('click', function(e) {
      setMockOption(document.getElementById('js-mock-pop-pro').value, document.getElementById('js-mock-pop-ver').value);
      switchStatus(true);
    });

    document.getElementById('js-mock-pop-cancel').addEventListener('click', function(e) {
      switchStatus(false);
    });
};

const switchStatus = (enable) => {
  switchBtn(enable);
  setMockAvailability(enable);
  closeModal();
}

const switchBtn = (enable) => {
  document.getElementById('js-mock-trigger').className = enable ? 'mock-trigger' : 'mock-trigger mock-trigger--disabled';
}

const closeModal = () => {
  document.getElementById('js-mock-pop').className = 'mock-pop mock-pop-hidden';
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

export default renderPop;
