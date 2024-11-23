import { DefaultProjectScene } from '@renderer/config/DataModel';
import { cloneDeep } from 'lodash';
import { IEditorState } from './state';

export const getters = {
  getCurrentSceneIndex(state: IEditorState) {
    return () => {
      if (!state.projectScenes) {
        return -1;
      }
      return state.projectScenes.findIndex((v) => {
        return v.uuid === state.activeSceneUUID;
      });
    };
  },
  getActiveScene(state: IEditorState) {
    return () => {
      const scene = state.projectScenes.find((v) => {
        return v.uuid === state.activeSceneUUID;
      });
      return scene || cloneDeep(DefaultProjectScene);
    };
  },
  getSceneByUUID(state: IEditorState) {
    return (uuid: string) => {
      const scene = state.projectScenes.find((v) => {
        return v.uuid === uuid;
      });
      return scene || cloneDeep(DefaultProjectScene);
    };
  },
  getActiveElement(state: IEditorState) {
    return () => {
      if (!state.projectScenes) {
        return null;
      }
      const currentSceneIndex = state.projectScenes.findIndex((v) => {
        return v.uuid === state.activeSceneUUID;
      });
      if (currentSceneIndex === -1) {
        return null;
      }
      return state.projectScenes[currentSceneIndex].elements.find((v) => {
        return v.uuid === state.activeElementUUID;
      });
    };
  },
  getActiveElementIndex(state: IEditorState) {
    return () => {
      if (!state.projectScenes) {
        return -1;
      }
      const currentSceneIndex = state.projectScenes.findIndex((v) => {
        return v.uuid === state.activeSceneUUID;
      });
      if (currentSceneIndex === -1) {
        return -1;
      }
      return state.projectScenes[currentSceneIndex].elements.findIndex((v) => {
        return v.uuid === state.activeElementUUID;
      });
    };
  },
  getElementByUUID(state: IEditorState) {
    return (uuid: string) => {
      if (!state.projectScenes) {
        return null;
      }
      const currentSceneIndex = state.projectScenes.findIndex((v) => {
        return v.uuid === state.activeSceneUUID;
      });
      if (currentSceneIndex === -1) {
        return null;
      }
      return state.projectScenes[currentSceneIndex].elements.find((v) => {
        return v.uuid === uuid;
      });
    };
  },
  canUndo(state: IEditorState) {
    return () => {
      return state.currentHistoryIndex > 0;
    };
  },
  canRedo(state: IEditorState) {
    return () => state.historyCache.length > state.currentHistoryIndex + 1;
  }
};
