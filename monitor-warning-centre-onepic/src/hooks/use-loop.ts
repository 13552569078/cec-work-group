import { onUnmounted } from "vue";

const useLoop = () => {
  const shArr:any[] = [];

  const setLoop = (func: Function, second: number) => {
    const time = second * 1000;
    const sh = setInterval(() => {
      func()
    }, time);
    shArr.push(sh);
  }

  onUnmounted(() => {
    shArr.forEach(sh => {
      clearInterval(sh);
    })
  })

  return {
    setLoop
  }
}

export { useLoop };