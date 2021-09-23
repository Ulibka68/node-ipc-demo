### Run:

This project is fully working. To run you need to run two terminal window:

"srv": "ts-node src/server.ts",  
"cli": "ts-node src/client.ts"

### Problem
If I'm using standart @types/node-ipc I can't use Client class, for example.

I'm write my own type definition file using declare module 'node-ipc'

External node-ipc package export singleton by default:  
```
const singleton=new IPCModule;

export {
singleton as default,
IPCModule
}
```

I can't declare singleton const in my type definition file.

In every file using node-ipc I need to write:

```
import ipcRoot, { IPC } from 'node-ipc';
const ipc: IPC = ipcRoot as unknown as IPC;
```

Please, help me describe singleton const in my d.ts file.
I try declare var - but take error.