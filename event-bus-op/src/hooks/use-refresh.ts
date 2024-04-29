import { ref } from 'vue';
import { AnyFunction } from 'fx-front-utils';

const SECOND = 1000;
const DEFAULT_LOOP_TIME = 30 * SECOND;

let loopTimer: (null | ReturnType<typeof setInterval>) = null;
let funcQueue: AnyFunction<any>[] = [];
// 首页刷新开关
const indexPageRefreshFlag = ref(false);

function useRefresh() {

  const _init = (loopSeconds: number = DEFAULT_LOOP_TIME) => {
    loopTimer = setInterval(() => {
      funcQueue.forEach( (func: AnyFunction<any>) => {
        if (typeof func === 'function') {
          func();
        }
      });
    }, loopSeconds || DEFAULT_LOOP_TIME)
  }

  const _clearTimer = () => {
    clearInterval(loopTimer as ReturnType<typeof setInterval>);
    loopTimer = null;
  }

  // 启动
  const startTimer = (loopSeconds: number = DEFAULT_LOOP_TIME) => {
    if (!loopTimer) {
      _init(loopSeconds);
    }
  }

  // 暂停
  const pauseTimer = () => {
    _clearTimer();
  }

  // 销毁
  const destoryTimer = () => {
    _clearTimer();
    funcQueue = [];
  }

  // 注册需要定时刷新的函数
  const addToRefreshQueue = (func: AnyFunction<any>) => {
    if (typeof func === 'function') {
      funcQueue.push(func);
    } else {
      console.warn('请传入函数对象');
    }
  }

  const refreshIndexData = ()=> {
    indexPageRefreshFlag.value = !indexPageRefreshFlag.value
  }

  return {
    startTimer,
    destoryTimer,
    pauseTimer,
    addToRefreshQueue,
    indexPageRefreshFlag,
    refreshIndexData
  }
}

export { useRefresh }