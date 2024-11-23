import { markRaw, Raw } from 'vue';
import LibScene from './libs/Scene/index.vue';
import LibText from './libs/Text/index.vue';
import LibImage from './libs/Image/index.vue';
import LibSource from './libs/Source/index.vue';
import LibBackground from './libs/Background/index.vue';
import LibLottie from './libs/Lottie/index.vue';
import LibTools from './libs/Tools/index.vue';
import LibMaterials from './libs/Material/index.vue';

export interface IMDSiderbarMenu {
  label: string;
  value: string;
  com: Raw<any>;
  icon: string;
}
export const sidebarMenus: IMDSiderbarMenu[] = [
  {
    label: '场景',
    value: 'scene',
    com: markRaw(LibScene),
    icon: 'icon-changjingguanli'
  },
  {
    label: '背景',
    value: 'background',
    com: markRaw(LibBackground),
    icon: 'icon-beijing'
  },
  {
    label: '文/幕',
    value: 'text',
    com: markRaw(LibText),
    icon: 'icon-wenzi'
  },
  {
    label: '图/表',
    value: 'image',
    com: markRaw(LibImage),
    icon: 'icon-tupian1'
  },
  {
    label: '视/音',
    value: 'source',
    com: markRaw(LibSource),
    icon: 'icon-video'
  },
  // {
  //   label: '角色',
  //   value: 'lottie',
  //   com: markRaw(LibLottie),
  //   icon: 'icon-reddit'
  // },
  {
    label: '资源',
    value: 'mterials',
    com: markRaw(LibMaterials),
    icon: 'icon-reddit'
  },
  {
    label: '工具库',
    value: 'tools',
    com: markRaw(LibTools),
    icon: 'icon-tool'
  }
];

export const layerZIndexList = [
  {
    title: '图层上移',
    value: 'layerUp',
    icon: 'icon-tucengshangyi'
  },
  {
    title: '图层下移',
    value: 'layerDown',
    icon: 'icon-tucengxiayi'
  },
  {
    title: '图层置顶',
    value: 'layerTop',
    icon: 'icon-tucengzhiding'
  },
  {
    title: '图层置底',
    value: 'layerBottom',
    icon: 'icon-tucengzhidi'
  }
];
