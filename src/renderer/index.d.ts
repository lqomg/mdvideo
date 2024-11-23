// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResponsePayload, RequestPayload } from '@api/types';

declare global {
  interface Window {
    invoke: <T, S>(channel: string, payload: T) => Promise<S>;
    send: <T>(channel: string, payload: T) => void;
    sendSync: <T, S>(channel: string, payload: T) => S;
    on: (channel: string, fun: any) => void;
    clipboard: any,
    PIXI: any;
  }
}
