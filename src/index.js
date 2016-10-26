import mocker from './mock_discover';

const discover = () => {
  setTimeout(() => {
    if (typeof Vue !=='undefined' || typeof Zepto !== 'undefined' || typeof jQuery !== 'undefined') {
      mocker.init();
    } else {
      discover();
    }
  }, 100);
}

discover();
