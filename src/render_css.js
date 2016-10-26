const renderCss = () => {
  let stylesheet = [
    '.mock-trigger {position:fixed; display:block!important; left:10%; bottom:10%; z-index:10002;}',
    '.mock-trigger .mock-btn {border-radius: 50%; padding: 0; width: 30px; height: 30px; font-size: 16px; outline: none; background-color: #2ECC71; color: #ECF0F1; cursor: pointer;}',
    '.mock-trigger--disabled .mock-btn {background-color: #7F8C8D;}',

    '.mock-pop-hidden {display: none;}',
    '.mock-pop:after {content: ""; position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: black;z-index: 1000;opacity: 0.3;}',
    '.mock-pop .mock-pop__content {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);padding:20px;width: 300px;background: white;z-index: 10001;}',
    '.mock-pop .group {margin-bottom:20px;}',
    '.mock-pop .group-btn {margin-top:30px; text-align:center;}',
    '.mock-pop label {line-height: 2em;}',
    '.mock-pop input{display: inline-block; background-color: #fff; background-image: none; height: 22px; padding: 4px 12px; font-family: Lato,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.467; color: #7F8C8D; border: 2px solid #BDC3C7; border-radius: 6px; box-shadow: none; -webkit-transition: border .25s linear, color .25s linear, background-color .25s linear; transition: border .25s linear,color .25s linear, background-color .25s linear;width:90%}',
    '.mock-pop .mock-btn {margin: 0 20px; padding: 10px 15px; font-size: 16px; font-weight: 400; line-height: 1.4; border: none; border-radius: 4px;-webkit-transition: border .25s linear,color .25s linear,background-color .25s linear;transition: border .25s linear,color .25s linear,background-color .25s linear;-webkit-font-smoothing: subpixel-antialiased; cursor: pointer; background-color: #27AE60; color: white;}',
    '.mock-pop .mock-btn-danger {background-color: #C0392B;}',
    '.mock-pop .help-link {color:#16A085; margin: 0 16px;};'
];
  let style = document.createElement('style');
  style.innerHTML = stylesheet.join('');
  document.head.appendChild(style);
};

export default renderCss;
