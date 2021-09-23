### Запуск:

В двух окнах терминала надо запустить сервер и клиент :

"srv": "ts-node src/server.ts",  
"cli": "ts-node src/client.ts"

### Описание 
Для организации межпроцессного взаимодействия в Node решил использовать модуль node-ipc (1 млн скачиваний) и использовать unix socket

Не получилось до конца правильно типизировать модуль node-ipc. В types написал declare module ...

### Проблема
Модуль node-ipc экспортирует singleton по умолчанию:  

```const singleton=new IPCModule;

export {
singleton as default,
IPCModule
}
```

Задекларировать глобальную переменную в файле index.d.ts мне не удалось  
Приходится каждый раз при импорте писать так:
```
import ipcRoot, { IPC } from 'node-ipc';
const ipc: IPC = ipcRoot as unknown as IPC;
```
### Вопрос
Как правильно описать глобальную переменную ?