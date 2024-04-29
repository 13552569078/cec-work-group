 interface SocketOptions {
  // token
  token?: string;
  // 发送心跳间隔时间
   heartTime?: number;
  // 检查链接状态时间
  checkTime?: number;
  // 断线后重连间隔时间
  lockTime?: number;
  // 是否立刻关闭socket
  closeNow?: boolean
}

const createSocket = (url: string, callback: (e: any) => void) => {
  class Ws {
      private url: string = url // socket 地址
      private callback: (e: any) => void = callback
      private heartTime: number = 3000 // 心跳时间
      private checkTime: number = 3000 // 检查链接状态时间
      private lockTime: number = 4000 // 重连时间
      public ws: WebSocket | undefined // socket实例
      private hTimer: NodeJS.Timeout | undefined // 心跳定时器
      private cTimer: NodeJS.Timeout | undefined // 检查链接定时器
      private lTimer: NodeJS.Timeout | undefined // 重连定时器
      private isLock: boolean = false // 重连锁
      private token: string | undefined // token
      private closeNow: boolean | undefined // token

      public init(options: SocketOptions = {}): void {
        const { token, heartTime, checkTime, lockTime, closeNow } = options;

        if (token) {
          this.token = token;
        }

        if (heartTime) {
          this.heartTime = heartTime;
        }

        if (checkTime) {
          this.checkTime = checkTime;
        }

        if (lockTime) {
          this.lockTime = lockTime;
        }

        if (closeNow) {
          this.closeNow = closeNow;
        }

        if (this.url === '') {
          throw new Error('socket链接地址不能为空');
        }
        this.wsInit();
      }

      // 处理有token时的socket链接地址
      private getUrl(): string {
        if (this.token !== undefined) {
          return `${this.url}?token=${this.token}`;
        }
        return `${this.url}`;
      }

      // 初始化socket
      public wsInit(): void {
        const ws = new WebSocket(this.getUrl());

        ws.onopen = () => {
          this.heartCheck();
        };

        ws.onclose = () => {
          if (!this.closeNow) {
            this.reconnect();
          }
        };

        ws.onerror = () => {
          this.reconnect();
        };

        ws.onmessage = e => {
          this.heartCheck();
          this.callback(e);
        };

        this.ws = ws;
      }

      // 心跳
      private heartCheck(): void {
        this.hTimer && clearTimeout(this.hTimer);
        this.cTimer && clearTimeout(this.cTimer);
        this.hTimer = setTimeout(() => {
          // (this.ws as WebSocket).send("type:ping");
          this.cTimer = setTimeout(() => {
            if ((this.ws as WebSocket).readyState !== 1) {
              (this.ws as WebSocket).close();
            }
          }, this.checkTime);
        }, this.heartTime);
      }

      // 重连
      private reconnect(): void {
        if (this.isLock) {
          return;
        }

        this.isLock = true;
        this.lTimer && clearTimeout(this.lTimer);
        this.lTimer = setTimeout(() => {
          this.wsInit();
          this.isLock = false;
        }, this.lockTime);
      }

      // 关闭
      public close() {
        if ((this.ws as WebSocket)) {
          (this.ws as WebSocket).close();
        }
      }
  }

  return new Ws();
};

export {
  createSocket
};
