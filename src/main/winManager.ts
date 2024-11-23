import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import * as Splashscreen from '@trodi/electron-splashscreen';
import loadingHtml from '../../resources/loading.html?asset';
import { join } from 'path';
class WindowManager {
  private static instance: WindowManager;
  public mainWin!: BrowserWindow;
  public markdownWin!: BrowserWindow;
  static getInstance() {
    if (!this.instance) {
      this.instance = new WindowManager();
    }
    return this.instance;
  }
  createMainWin() {
    if (this.mainWin) {
      return this.mainWin;
    }
    // Create the browser window.
    const mainOpts: Electron.BrowserWindowConstructorOptions = {
      width: 1280,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        webSecurity: false,
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    };
    const templateUrl = loadingHtml;
    const config: Splashscreen.Config = {
      windowOpts: mainOpts,
      templateUrl: templateUrl,
      splashScreenOpts: {
        width: 1280,
        height: 800
      }
    };
    // initialize the splashscreen handling
    this.mainWin = Splashscreen.initSplashScreen(config);

    return this.mainWin;
  }
  createMarkdownWin() {
    // Create the browser window.
    const winOptions: Electron.BrowserWindowConstructorOptions = {
      width: 1280,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        webSecurity: false,
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    };
    const win = new BrowserWindow(winOptions);
    this.markdownWin = win;
    return win;
  }
}

export const winsInstance = WindowManager.getInstance();
