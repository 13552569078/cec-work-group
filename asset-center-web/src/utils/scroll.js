var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) { e.preventDefault(); }
  e.returnValue = false;
}

function keydown(e) {
  for (var i = keys.length; i--;) {
    if (e.keyCode === keys[i]) {
      preventDefault(e);
      return;
    }
  }
}

function wheel(e) {
  console.log('eeeeee')
  preventDefault(e);
}

export const disable_scroll = function disable_scroll() {
  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', wheel, { passive: false });
    window.addEventListener('mousewheel', wheel, { passive: false });
    window.addEventListener('keydown', keydown, { passive: false });
  }
  // window.onmousewheel = document.onmousewheel = wheel;
  // document.onkeydown = keydown;
}

export const enable_scroll = function enable_scroll() {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', wheel, { passive: false });
    window.removeEventListener('mousewheel', wheel, { passive: false });
    window.removeEventListener('keydown', keydown, { passive: false });
  }
  // window.onmousewheel = document.onmousewheel = document.onkeydown = null;
}
