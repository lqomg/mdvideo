import { contextBridge,clipboard } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('invoke', electronAPI.ipcRenderer.invoke);
    contextBridge.exposeInMainWorld('send', electronAPI.ipcRenderer.send);
    contextBridge.exposeInMainWorld('sendSync', electronAPI.ipcRenderer.sendSync);
    contextBridge.exposeInMainWorld('on', electronAPI.ipcRenderer.on);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('clipboard', clipboard);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.invoke = electronAPI.ipcRenderer.invoke;
  // @ts-ignore (define in dts)
  window.send = electronAPI.ipcRenderer.send;
  // @ts-ignore (define in dts)
  window.sendSync = electronAPI.ipcRenderer.sendSync;
  // @ts-ignore (define in dts)
  window.on = electronAPI.ipcRenderer.on;
   // @ts-ignore (define in dts)
  window.clipboard = clipboard;
}
