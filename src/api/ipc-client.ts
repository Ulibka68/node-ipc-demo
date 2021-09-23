import { Client, IPC } from 'node-ipc';
import ipcRoot from 'node-ipc';
// import chalk from 'chalk';

const ipc: IPC = ipcRoot as unknown as IPC;

export interface OnClientHandlers {
  event: string;
  handler: (data: any) => void;
}

export class ClientIPC {
  ipcClient: Client | null = null;

  constructor(
    public chanelName: string = 'pipser',
    public srvChanelName: string = 'srv',
    public handlers: Array<OnClientHandlers> = []
  ) {}

  async connectChanelIPC(): Promise<Client> {
    ipc.config.id = this.chanelName;
    ipc.config.retry = 1500;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Connecting to IPC timeout 3000.'));
      }, 3000);
      ipc.connectTo(this.srvChanelName, () => {
        const ipcClient = ipc.of[this.srvChanelName];
        this.ipcClient = ipcClient;
        ipcClient.enableEmit = false;
        ipcClient.on('connect', () => {
          ipcClient.enableEmit = true;
        });
        ipcClient.on('disconnect', () => {
          ipcClient.enableEmit = false;
        });
        // запустим необходимые обработчики
        this.handlers.forEach((handler) => {
          ipcClient.on(handler.event, handler.handler);
        });
        resolve(ipcClient);
      });
    });
  }

  // ожидает события connect
  async waitConnectionEvent(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('No connect event.'));
      }, 3000);

      if (this.ipcClient) {
        this.ipcClient.on('connect', () => {
          this.ipcClient!.enableEmit = true;
          // console.log(chalk.red('***** CONNECT EVENT ****'));
          resolve(true);
        });
      }
    });
  }

  emit(event: string, data: any): boolean {
    // console.log(chalk.yellow('Emit start'));
    // console.log('this.ipcClient!.enableEmit ', this.ipcClient!.enableEmit);
    // console.log(this.ipcClient);
    if (this.ipcClient && this.ipcClient.enableEmit) {
      this.ipcClient.emit(event, data);
      return true;
    }
    return false;
  }

  destroy(): void {
    if (this.ipcClient) {
      this.ipcClient.socket.destroy();
    }
  }

  /**
   * https://www.npmjs.com/package/node-ipc#disconnect
   * Used to disconnect a client from a Unix, Windows, TCP or TLS socket.
   * The socket and its refrence will be removed from memory and the ipc.of scope.
   * This can be local or remote. UDP clients do not maintain connections and so there are no Clients and this method has no value to them
   * @param id is the string id of the socket from which to disconnect
   */
  disconnect(): void {
    ipc.disconnect(this.chanelName);
  }
}
