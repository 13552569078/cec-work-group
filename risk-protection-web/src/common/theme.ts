import { THEME_STYLE_NAME } from './constant';

function _addStyle(styleText: string) {
  const styleNode = document.createElement('style');
  styleNode.id = THEME_STYLE_NAME;
  styleNode.textContent = styleText;
  const head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(styleNode);
}

function removeStyle(id: string) {
  const sheets = document.querySelectorAll('style');
  const head = document.head || document.getElementsByTagName('head')[0];
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].id === id) {
      head.removeChild(sheets[i]);
      break;
    }
  }
}

function addStyle(styleText: string) {
  if (document.getElementById(THEME_STYLE_NAME)) {
    removeStyle(THEME_STYLE_NAME);
  }
  _addStyle(styleText);
}

export { addStyle, removeStyle };
