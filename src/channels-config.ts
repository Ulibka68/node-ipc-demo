export const channelsConfig = {
  SERVER_CHANNEL_NAME: 'pipser',
  CLIENT_CHANNEL_NAME1: 'node-kraken',

  /*
   * event для передачи клиенту
   */
  SRV_CMD_START: 'start_load',

  /*
   * event для передачи серверу
   */
  CHANEL1_MSGS: 'node-kraken',
} as const;
