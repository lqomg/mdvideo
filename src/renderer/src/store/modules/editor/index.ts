import { defineStore } from 'pinia';
import { getters } from './getters';
import { state as DefaultState, IEditorState } from './state';
import { nanoid } from 'nanoid';
import {
  DefaultCommonStyle,
  DefaultElementAnimate,
  DefaultProjectInfo,
  DefaultProjectScene,
  MaxSceneDuration,
  MinSceneDuration
} from '@renderer/config/DataModel';
import { pluginManager } from '@renderer/plugins';
import { IMDCommonStyle, IMDElement, IMDProjectScene } from '@renderer/types';
import { cloneDeep, isFunction } from 'lodash';
import { ElMessage } from 'element-plus';
import { toRaw } from 'vue';
export const useEditorStore = defineStore('editor', {
  state(): IEditorState {
    return {
      ...DefaultState
    };
  },
  getters,
  actions: {
    createNewProject() {
      const info = cloneDeep(DefaultProjectInfo);
      const scene = cloneDeep(DefaultProjectScene);
      const uuid = nanoid();
      scene.uuid = uuid;
      this.id = '';
      this.projectUUID = nanoid();
      this.projectInfo = info;
      this.projectScenes = [scene];
      this.activeSceneUUID = uuid;
      this.isMarkdownSource = false;
      this.markdown = undefined;
    },
    addScene(scene?: IMDProjectScene) {
      if (!scene) {
        scene = cloneDeep(DefaultProjectScene);
      }
      const uuid = nanoid();
      scene.uuid = uuid;
      this.projectScenes.push(scene);
      this.activeSceneUUID = uuid;
    },
    addElement(elName: string, commonStyle: Partial<IMDCommonStyle> = {}, propsValue: any = {}) {
      const plugin = pluginManager.getPlugin(elName);
      if (!plugin) {
        console.error('插件' + elName + '未找到');
        return;
      }
      const { defaultCommonStyle, defaultProps = {} } = plugin;
      const uuid = nanoid();
      const element: IMDElement = {
        uuid,
        elName,
        animations: cloneDeep(DefaultElementAnimate),
        duration: 0,
        offset: this.curSceneDuration || 0,
        commonStyle: {
          ...DefaultCommonStyle,
          ...(isFunction(defaultCommonStyle)
            ? defaultCommonStyle(this.projectInfo)
            : defaultCommonStyle),
          ...commonStyle,
          zIndex: 50
        },

        propsValue: { ...defaultProps, ...propsValue }
      };
      const scene = this.projectScenes[this.getCurrentSceneIndex()];
      scene.elements.push(element);
      this.activeElementUUID = uuid;
      this.addHistoryCache();
    },
    setBackground() {
      const activeSceneIndex = this.getCurrentSceneIndex();
      if (activeSceneIndex !== -1 && this.activeElementUUID) {
        const element = this.getElementByUUID(this.activeElementUUID);
        if (element?.elName === 'md-image') {
          const src = element.propsValue.src;
          const scene = this.projectScenes[this.getCurrentSceneIndex()];
          scene.commonStyle.backgroundImage = src;
          this.deleteElementByUUID(this.activeElementUUID);
        }
      }

      console.log(activeSceneIndex, this.activeElementUUID);
    },
    updateElement(element: Partial<IMDElement>) {
      const activeElementIndex = this.getActiveElementIndex();
      const activeSceneIndex = this.getCurrentSceneIndex();
      if (activeElementIndex !== -1 && activeSceneIndex !== -1) {
        const temp = toRaw(this.projectScenes[activeSceneIndex].elements[activeElementIndex]);
        const payload = {
          ...temp,
          ...element
        };
        const { offset, duration } = payload;
        const sceneDuration = this.getActiveScene().data.duration;
        if (offset + duration > sceneDuration) {
          this.getActiveScene().data.duration =
            offset + duration > MaxSceneDuration ? MaxSceneDuration : offset + duration;
        }
        this.projectScenes[activeSceneIndex].elements[activeElementIndex] = payload;
      }
      this.addHistoryCache();
    },
    deleteElementByUUID(uuid: string) {
      const activeSceneIndex = this.getCurrentSceneIndex();
      if (uuid && activeSceneIndex !== -1) {
        const index = this.projectScenes[activeSceneIndex].elements.findIndex(
          (el) => el.uuid === uuid
        );
        if (index !== -1) {
          this.projectScenes[activeSceneIndex].elements.splice(index, 1);
        }
      }
      if (uuid === this.activeElementUUID) {
        this.activeElementUUID = '';
      }
      this.addHistoryCache();
    },
    deleteSceneByUUID(uuid: string) {
      const index = this.projectScenes.findIndex((scene) => scene.uuid === uuid);
      if (index !== -1) {
        const s = this.projectScenes.splice(index, 1);
        if (s[0]?.uuid === this.activeSceneUUID) {
          this.activeSceneUUID = this.projectScenes[0]?.uuid || '';
        }
      }
    },
    editorUndo() {
      const prevState = this.historyCache[this.currentHistoryIndex + 1];
      if (prevState) {
        this.projectUUID = prevState.projectUUID;
        this.projectInfo = prevState.projectInfo;
        this.projectScenes = prevState.projectScenes;
        this.activeSceneUUID = prevState.activeSceneUUID;
        this.activeElementUUID = prevState.activeElementUUID;
      }
      this.currentHistoryIndex += 1;
    },
    editorRedo() {
      const prevState = this.historyCache[this.currentHistoryIndex - 1];
      if (prevState) {
        this.projectUUID = prevState.projectUUID;
        this.projectInfo = prevState.projectInfo;
        this.projectScenes = prevState.projectScenes;
        this.activeSceneUUID = prevState.activeSceneUUID;
        this.activeElementUUID = prevState.activeElementUUID;
      }
      this.currentHistoryIndex -= 1;
    },
    addSceneDuration() {
      const scene = this.getActiveScene();

      if (scene.data.duration <= MaxSceneDuration) {
        scene.data.duration = Math.floor(scene.data.duration + 1);
      }
    },
    reduceSceneDuration() {
      const scene = this.getActiveScene();
      const maxOffset = Math.max.apply(
        {},
        scene.elements.map((el) => el.offset)
      );
      if (Math.ceil(maxOffset) + 1 > Math.floor(scene.data.duration - 1)) {
        ElMessage.warning('存在开始时间大于场景时长的元素，请删除之后再试！');
        return;
      }
      if (scene.data.duration > MinSceneDuration) {
        scene.data.duration = Math.floor(scene.data.duration - 1);
      }
    },
    addHistoryCache() {
      if (this.currentHistoryIndex + 1 < this.historyCache.length) {
        this.historyCache.splice(this.currentHistoryIndex + 1);
      }
      this.historyCache.push({
        id: this.id,
        projectUUID: this.projectUUID,
        projectInfo: cloneDeep(toRaw(this.projectInfo)),
        projectScenes: cloneDeep(toRaw(this.projectScenes)),
        activeSceneUUID: this.activeSceneUUID,
        activeElementUUID: this.activeElementUUID,
        curDupDuration: this.curDupDuration,
        curSceneDuration: this.curSceneDuration
      });
      // 限制undo 纪录步数，最多支持100步操作undo
      this.historyCache.splice(50);
      this.currentHistoryIndex++;
    },
    clearHistoryCache() {
      this.historyCache = [];
      this.currentHistoryIndex = -1;
    },
    resetElementZIndex(type: string, elementUUID?: string) {
      const uuid = elementUUID || this.activeElementUUID;
      const activePage = this.getActiveScene();
      const currentElement = this.getActiveElement();
      if (!currentElement || !activePage) return;
      const itemZIndex = currentElement.commonStyle.zIndex;
      const maxIndex = activePage.elements.length;
      const mminIndex = 1;
      const zIndexDirc = {
        layerUp: Math.min(itemZIndex + 1, maxIndex),
        layerDown: Math.max(itemZIndex - 1, mminIndex),
        layerTop: maxIndex,
        layerBottom: mminIndex,
        set0: 0
      };

      if (zIndexDirc[type] === undefined) return;
      const currentZIndex = zIndexDirc[type];
      currentElement.commonStyle.zIndex = currentZIndex;
      console.log(activePage.elements);
      activePage.elements.forEach((item) => {
        if (uuid === item.uuid) return;
        // 上面一位zIndex减一
        if (type === 'layerUp' && item.commonStyle.zIndex === currentZIndex) {
          item.commonStyle.zIndex--;
        }
        // 下面元素zIdex加一
        if (type === 'layerDown' && item.commonStyle.zIndex === currentZIndex) {
          item.commonStyle.zIndex++;
        }
        // 目标元素zIndex 以上的都减一
        if (type === 'layerTop' && item.commonStyle.zIndex > itemZIndex) {
          item.commonStyle.zIndex--;
        }

        // 目标元素zIndex以下的都加一
        if ((type === 'layerBottom' || type === 'set0') && item.commonStyle.zIndex < itemZIndex) {
          item.commonStyle.zIndex++;
        }
      });
    }
  }
});
