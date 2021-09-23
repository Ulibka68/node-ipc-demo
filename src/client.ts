import { channelsConfig } from './channels-config';
import { ClientIPC } from './api/ipc-client';
import chalk from 'chalk';

function start_load_handler(data: any): void {
  console.log(
    chalk.blue(
      'Канал ',
      channelsConfig.CLIENT_CHANNEL_NAME1,
      ' recieved data : '
    ),
    data
  );
}

async function main() {
  const chanelClient1 = new ClientIPC(
    channelsConfig.CLIENT_CHANNEL_NAME1,
    channelsConfig.SERVER_CHANNEL_NAME,
    [{ event: channelsConfig.SRV_CMD_START, handler: start_load_handler }]
  );
  await chanelClient1.connectChanelIPC();
  const conEnable = await chanelClient1.waitConnectionEvent();

  console.log(chalk.bgCyan('Emit client >>>>>>>> ', conEnable));

  chanelClient1.emit(channelsConfig.CHANEL1_MSGS, {
    id: channelsConfig.CLIENT_CHANNEL_NAME1,
    msg: 'Сообщение 1',
  });
  chanelClient1.emit(channelsConfig.CHANEL1_MSGS, {
    id: channelsConfig.CLIENT_CHANNEL_NAME1,
    msg: 'Сообщение 2',
  });

  let i = 0;
  setInterval(() => {
    chanelClient1.emit(channelsConfig.CHANEL1_MSGS, {
      id: channelsConfig.CLIENT_CHANNEL_NAME1,
      msg: `Сообщение ${i++}`,
    });
  }, 3000);
}
main();
