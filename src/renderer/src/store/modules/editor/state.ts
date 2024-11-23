import { DefaultProjectInfo } from '@renderer/config/DataModel';
import { IMDProjectInfo, IMDProjectScene } from '@renderer/types';
import { MarkdownProps } from '@renderer/views/markdown/core/MarkdownManager';

export interface IEditorState {
  id?: string; // 服务端的ID
  projectUUID: string; // 前端的ID
  projectInfo: IMDProjectInfo;
  projectScenes: IMDProjectScene[];
  isMarkdownSource?: boolean;
  markdown?: {
    doc: string;
    scenes: MarkdownProps[];
  };
  activeSceneUUID: string;
  activeElementUUID: string;
  historyCache: Omit<
    IEditorState,
    'scale' | 'currentHistoryIndex' | 'historyCache' | 'attrActiveName' | 'isPlaying'
  >[];
  currentHistoryIndex: number;
  scale: number;
  curSceneDuration: number;
  curDupDuration: number;
  isPlaying?: boolean;
  attrActiveName: string;
}

export const state: IEditorState = {
  id: '',
  projectUUID: '',
  isMarkdownSource: false,
  markdown: undefined,
  projectInfo: { ...DefaultProjectInfo },
  projectScenes: [],
  activeSceneUUID: '',
  activeElementUUID: '',
  historyCache: [],
  currentHistoryIndex: -1,
  scale: 0.35,
  curSceneDuration: 0,
  curDupDuration: 0,
  isPlaying: false,
  attrActiveName: 'attr-prop'
};
