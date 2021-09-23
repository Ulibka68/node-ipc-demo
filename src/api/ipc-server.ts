import ipcRoot, { IPC } from 'node-ipc';
// import ipcRoot from 'node-ipc';
import { Socket } from 'net';
import chalk from 'chalk';
const ipc: IPC = ipcRoot as unknown as IPC;

// const ipc: IPC = ipcRoot as unknown as IPC;
// declare let ipc: IPC & { config: Config } & { server: Server };

export interface OnServerHandlers {
  event: string;
  handler: (data: any, socket?: Socket) => void;
}

export class ServerIPC {
  private servePromise: Promise<boolean> | null = null;
  constructor(
    public srvChanelName: string = 'srv',
    public handlers: Array<OnServerHandlers> = []
  ) {
    ipc.config.id = srvChanelName;
    ipc.config.retry = 1500;
  }

  async _serve(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Server can`t exec serve.'));
      }, 3000);
      ipc.serve(() => {
        resolve(true);
      });
    });
  }

  async start(): Promise<boolean> {
    this.servePromise = this._serve();
    ipc.server.start();
    await this.servePromise;
    console.log(chalk.yellow('Сервер стартовал'));
    /* ipc.server.on('connect', (_data, socket) => {
      // console.log(data);
      console.log(
        Object.keys(socket).forEach((val) => {
          console.log(val);
        })
      );
    });*/
    this.handlers.forEach((handler) => {
      ipc.server.on(handler.event, handler.handler);
    });
    return true;
  }

  emit(socket: Socket, event: string, data: any): void {
    ipc.server.emit(socket, event, data);
  }

  broadcast(event: string, data: any): void {
    ipc.server.broadcast(event, data);
  }
}
