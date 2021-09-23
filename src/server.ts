import { channelsConfig } from './channels-config';
import { ServerIPC } from './api/ipc-server';
import chalk from 'chalk';
import { Socket } from 'net';
import ipcRoot, { IPC } from 'node-ipc';
const ipc: IPC = ipcRoot as unknown as IPC;
// declare let ipc: IPC & { config: Config } & { server: Server };

function start_load_handler(data: any, socket?: Socket): void {
  console.log(
    chalk.green(
      'Сервер получил данные ',
      channelsConfig.CLIENT_CHANNEL_NAME1,
      ' recieved data : '
    ),
    data
  );
  ipc.server.emit(socket!, channelsConfig.SRV_CMD_START, {
    id: 'возвратное сообщение от сервера',
    message: data,
  });
}

async function main() {
  const serverIPC = new ServerIPC(channelsConfig.SERVER_CHANNEL_NAME, [
    { event: channelsConfig.CLIENT_CHANNEL_NAME1, handler: start_load_handler },
  ]);
  await serverIPC.start();
}

main();
