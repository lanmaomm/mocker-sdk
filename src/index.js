import renderCss from './render_css';
import truncation from './truncation';
import renderButton from './render_button';
import renderPop from './render_pop';

const mocker = () => {
  truncation();
  renderCss();
  renderButton();
  renderPop();
};

const discover = () => {
  setTimeout(() => {
    if (typeof Vue !=='undefined' || typeof Zepto !== 'undefined' || typeof jQuery !== 'undefined') {
      mocker();
    } else {
      discover();
    }
  }, 100);
}

discover();
