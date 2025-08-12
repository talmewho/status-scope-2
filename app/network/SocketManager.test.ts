import { SocketManager } from './SocketManager';
import mock from '../../mocks/status-mock.json';

const constructorUrl = jest.fn();
const send = jest.fn();
const close = jest.fn();

class WebSocket extends EventTarget {
  url = '';
  constructor(url: string) {
    super();
    constructorUrl(url);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentSocket = this;
  }

  send = send;

  close = () => {
    this.dispatchEvent(new Event('close'));
    close();
  };
}

let currentSocket: WebSocket | undefined;

describe('SocketManager', () => {
  beforeEach(() => {
    jest.useRealTimers();
    Object.defineProperty(window, 'WebSocket', {
      value: WebSocket,
    });
  });

  it('creates a websocket with the given url', () => {
    new SocketManager('/', { notify: jest.fn(), notifyFailed: jest.fn() });

    expect(constructorUrl).toHaveBeenCalledWith('/');
  });

  it('calls notifyFailed when the socket fails to create', () => {
    const notifyFailed = jest.fn();
    Object.defineProperty(window, 'WebSocket', {
      value: () => { throw new Error('Cannot create WebSocket'); },
    });

    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    expect(notifyFailed).toHaveBeenCalledWith('Failed to create socket');
  });

  it('calls notifyFailed when the socket fails to open', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();

    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    jest.runAllTimers();

    expect(notifyFailed).toHaveBeenCalledWith('Failed to activate socket');
  });

  it('calls notifyFailed when the server fails to respond to pings', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    currentSocket?.dispatchEvent(new Event('open'));

    jest.runOnlyPendingTimers();

    expect(send).toHaveBeenCalledWith('ping');

    jest.runOnlyPendingTimers();

    expect(notifyFailed).toHaveBeenCalledWith('Failed to receive pong');
  });

  it('does not call notifyFailed when the server responds to pings', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    currentSocket?.dispatchEvent(new Event('open'));

    jest.runOnlyPendingTimers();

    expect(send).toHaveBeenCalledWith('ping');

    currentSocket?.dispatchEvent(new MessageEvent('message', { data: 'pong' }));

    jest.runOnlyPendingTimers();

    expect(notifyFailed).not.toHaveBeenCalled();
  });

  it('calls notifyFailed when the server does not send data after a given data timeout', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    const dataTimeout = 6000;

    new SocketManager('/', { notify: jest.fn(), notifyFailed, dataTimeout });
    currentSocket?.dispatchEvent(new Event('open'));
    currentSocket?.dispatchEvent(new MessageEvent('message', { data: 'pong' }));

    jest.runOnlyPendingTimers();

    expect(notifyFailed).toHaveBeenCalledWith(`Failed to receive data after ${dataTimeout} ms`);
  });

  it('does not call notifyFailed when the server sends data', () => {
    const dataTimeout = 3000;
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    new SocketManager('/', { notify: jest.fn(), notifyFailed, dataTimeout });

    currentSocket?.dispatchEvent(new Event('open'));
    currentSocket?.dispatchEvent(new MessageEvent('message', { data: 'pong' }));
    currentSocket?.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(mock) }));

    jest.advanceTimersByTime(dataTimeout - 1);

    currentSocket?.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(mock) }));

    jest.advanceTimersByTime(dataTimeout - 1);

    expect(notifyFailed).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(notifyFailed).toHaveBeenCalledWith(`Failed to receive data after ${dataTimeout} ms`);
  });

  it('does not call notifyFailed when the client closes it', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    const manager = new SocketManager('/', { notify: jest.fn(), notifyFailed });

    manager.close();

    jest.runAllTimers();

    expect(notifyFailed).not.toHaveBeenCalled();
  });

  it('calls notifyFailed when the server closes it', () => {
    jest.useFakeTimers();
    const notifyFailed = jest.fn();
    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    currentSocket?.dispatchEvent(new Event('close'));

    jest.runAllTimers();

    expect(notifyFailed).toHaveBeenCalledWith('Socket closed not by the client');
  });

  it('calls notifyFailed when an error event is fired', () => {
    jest.useFakeTimers();
    const errorEvent = new Event('error');
    const notifyFailed = jest.fn();
    new SocketManager('/', { notify: jest.fn(), notifyFailed });

    currentSocket?.dispatchEvent(errorEvent);

    jest.runAllTimers();

    expect(notifyFailed).toHaveBeenCalledWith(errorEvent);
  });
});
