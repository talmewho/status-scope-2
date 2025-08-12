const pingInterval = 1000 * 20;
const pongTimeout = 5000;
const activationTimeout = 5000;

export type TSocketManagerOptions<T> = {
  notify: (data: T) => void;
  notifyFailed: () => void;
  dataTimeout?: number;
};

export class SocketManager<T> {
  private socket: WebSocket | undefined;

  private didInitiateClose = false;

  private dataTimeoutTimer: ReturnType<typeof setTimeout> | undefined;
  private activationTimeoutTimer: ReturnType<typeof setInterval> | undefined;
  private pingTimer: ReturnType<typeof setInterval> | undefined;
  private pongExpectancyTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly dataTimeout: number | undefined;
  private readonly notifyFailed: (messageOrEvent?: string | Event) => void;
  private readonly notify: (data: T) => void;

  constructor(url: string, { notify, notifyFailed, dataTimeout }: TSocketManagerOptions<T>) {
    this.notifyFailed = notifyFailed;
    this.notify = notify;
    this.dataTimeout = dataTimeout;

    this.initialise(url);
  }

  private handleOpen = () => {
    if (this.activationTimeoutTimer) {
      clearTimeout(this.activationTimeoutTimer);
      this.activationTimeoutTimer = undefined;
    }

    this.startPinging();
    this.expectData();
  };

  private handleClose = () => {
    if (this.didInitiateClose) {
      return;
    }

    this.fail('Socket closed not by the client');
  };

  private handleError = (event: Event) => {
    this.fail(event);
  };

  private handleMessage = ({ data }: MessageEvent) => {
    if (data === 'pong') {
      if (this.pongExpectancyTimer) {
        clearTimeout(this.pongExpectancyTimer);
        this.pongExpectancyTimer = undefined;
      }
      return;
    }

    this.expectData();

    this.notify(data);
  };

  private initialise(url: string) {
    this.socket = this.createSocket(url);
    if (!this.socket) {
      this.fail('Failed to create socket');

      return {
        close,
      };
    }

    this.activationTimeoutTimer = setTimeout(() => {
      this.fail('Failed to activate socket');
    }, activationTimeout);

    this.socket.addEventListener('open', this.handleOpen);

    this.socket.addEventListener('message', this.handleMessage);

    this.socket.addEventListener('close', this.handleClose);

    this.socket.addEventListener('error', this.handleError);
  }

  private createSocket(url: string): WebSocket | undefined {
    try {
      return new WebSocket(url);
    }
    catch (error) {
      console.log('Could not create a websocket', error);
    }
  }

  private stopTimers = () => {
    function stopTimer(timer: ReturnType<typeof setTimeout> | undefined) {
      if (timer) {
        clearTimeout(timer);
      }
    }

    stopTimer(this.activationTimeoutTimer);
    stopTimer(this.pingTimer);
    stopTimer(this.pongExpectancyTimer);
    stopTimer(this.dataTimeoutTimer);
  };

  private fail = (messageOrEvent: string | Event) => {
    console.error(messageOrEvent);
    this.close();
    this.notifyFailed(messageOrEvent);
  };

  private startPinging = () => {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    this.pingTimer = setInterval(() => {
      this.socket?.send('ping');

      this.expectPong();
    }, pingInterval);
  };

  private expectPong = () => {
    this.pongExpectancyTimer = setTimeout(() => {
      this.fail('Failed to receive pong');
    }, pongTimeout);
  };

  private expectData = () => {
    if (!this.dataTimeout) {
      return;
    }

    if (this.dataTimeoutTimer) {
      clearTimeout(this.dataTimeoutTimer);
    }

    this.dataTimeoutTimer = setTimeout(() => {
      this.fail(`Failed to receive data after ${this.dataTimeout} ms`);
    }, this.dataTimeout);
  };

  public close = () => {
    this.didInitiateClose = true;
    try {
      this.socket?.close();
    }
    catch (error) {
      console.log('Could not close the socket', error);
    }

    this.stopTimers();
  };
}
