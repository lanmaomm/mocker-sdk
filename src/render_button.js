import { checkMockAvailability, setMockAvailability, getMockOption, setMockOption } from './util';

const renderButton = () => {
  let container = document.createElement('div');
  let className = checkMockAvailability() ? 'mock-trigger' : 'mock-trigger mock-trigger--disabled';

  container.setAttribute('class', className);
  container.setAttribute('id', 'js-mock-trigger');
  container.innerHTML = '<button id="js-mock-trigger-btn" draggable="true" class="mock-btn ">M</button>';

  document.body.appendChild(container);

  let mockBtn = document.getElementById('js-mock-trigger-btn');

  mockBtn.addEventListener('click', function() {
    let targetNode = document.getElementById('js-mock-pop');
    if (/mock-pop-hidden/.test(targetNode.className)) {
      targetNode.className = 'mock-pop';
    } else {
      targetNode.className = 'mock-pop mock-pop-hidden';
    }
  });

  mockBtn.addEventListener('dragend', function(e) {
      mockBtn.style.position = 'fixed';
      mockBtn.style.left = e.x + 'px';
      mockBtn.style.top = e.y + 'px';
  });
}

export default renderButton;
