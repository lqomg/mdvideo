import TextPlugin from './Text';
import ImagePlugin from './Image';
import VideoPlugin from './Video';
import AudioPlugin from './Audio';
import ChartPlugin from './Chart';
import SubtitlePlugin from './Subtitle';
import LottiePlugin from './Lottie';
import RectanglePlugin from './RoundedRect';
import CirclePlugin from './Circle';
import { IMDPluginOptions } from './helper';

class PluginManager {
  static instance: PluginManager;
  private pluginMap: Map<IMDPluginOptions['name'], IMDPluginOptions> = new Map();
  constructor() { }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new PluginManager();
    }

    return this.instance;
  }
  registerPlugins(options: IMDPluginOptions) {
    if (options._registered || this.getPlugin(options.name)) {
      console.warn('插件' + options.name + '已被注册');
      return;
    }
    options._registered = true;
    const { name } = options;
    this.pluginMap.set(name, options);
  }
  getPropsCom(name: string) {
    return this.pluginMap.get(name)?.Props || null;
  }
  getSpriteCom(name: string) {
    return this.pluginMap.get(name)?.Sprite || null;
  }
  getToolsCom(name: string) {
    return this.pluginMap.get(name)?.Tools || null;
  }
  getLayer(name: string) {
    return this.pluginMap.get(name)?.layer || { icon: '', title: `元素${name}` };
  }
  getPlugin(name: string) {
    return this.pluginMap.get(name);
  }
}

const pluginManager = PluginManager.getInstance();
pluginManager.registerPlugins(TextPlugin);
pluginManager.registerPlugins(ImagePlugin);
pluginManager.registerPlugins(VideoPlugin);
pluginManager.registerPlugins(ChartPlugin);
pluginManager.registerPlugins(SubtitlePlugin);
pluginManager.registerPlugins(AudioPlugin);
pluginManager.registerPlugins(LottiePlugin);
pluginManager.registerPlugins(RectanglePlugin);
pluginManager.registerPlugins(CirclePlugin);
export { pluginManager };
