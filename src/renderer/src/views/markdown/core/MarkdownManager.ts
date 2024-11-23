import { IMDElement, IMDProjectScene } from '@api/types';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';
export enum EStatus {
  ADD = 0,
  DOING = 1,
  CHANGE = 2,
  SUCCESS = 3,
  UPDATE = 4
}

export const DefaultProjectScene: IMDProjectScene = {
  elements: [],
  uuid: 'ajsdihanxxjajx_kasdaq',
  commonStyle: {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundSize: 'cover'
  },
  data: {
    duration: 6,
    transName: 'none',
    transDuration: 0.5
  }
};
export interface MarkdownProps {
  [x: string]: any;
  id: string;
  markdownDoc: string;
  status: EStatus;
  errorMsgs: string[];
  isNeedPlay?: boolean;
  scene: IMDProjectScene;
}
export class MarkdownManager {
  private static instance: MarkdownManager;
  public id: string;
  public markdwon: string;
  public markdwons: MarkdownProps[];
  public elements: IMDElement[];
  public sceneList: any[];
  public history: MarkdownProps[];
  constructor() {
    this.markdwon = '';
    this.id = '';
    this.markdwons = [];
    this.elements = [];
    this.sceneList = [];
    this.history = [];
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new MarkdownManager();
    }
    return this.instance;
  }
  setMarkdown(v: string) {
    this.markdwon = v;
    const textScens = v.split(/\n[-]{3,}\n/g).filter((c) => c.trim() !== '');
    const markdowns: MarkdownProps[] = [];
    const preMarkdowns = cloneDeep(this.markdwons);
    for (let i = 0; i < textScens.length; i++) {
      const text = textScens[i];
      const oldMarkdown = this.history.find((m) => m.markdownDoc.trim() === text.trim());
      if (oldMarkdown) {
        markdowns.push(oldMarkdown);
      } else {
        const id = nanoid();
        const oldScene = preMarkdowns[i]?.scene;
        const nM = {
          id,
          markdownDoc: text,
          status: oldScene ? EStatus.UPDATE : EStatus.ADD,
          scene: oldScene || ({ ...DefaultProjectScene } as any),
          errorMsgs: []
        };
        markdowns.push(nM);
        this.history.push(nM);
      }
    }
    this.markdwons = markdowns;
  }
  changeMarkdownById(id: string, args: Partial<MarkdownProps>) {
    const nMarkdowns = this.markdwons.map((markdwon) => {
      if (markdwon.id === id) {
        return {
          ...markdwon,
          ...args
        };
      }
      return markdwon;
    });
    this.history = this.history.map((markdwon) => {
      if (markdwon.id === id) {
        return {
          ...markdwon,
          ...args
        };
      }
      return markdwon;
    });
    this.markdwons = nMarkdowns;
  }
  getAddMarkdown() {
    return this.markdwons.filter((m) => m.status === EStatus.ADD || m.status === EStatus.UPDATE);
  }
}

export const markdownManager = MarkdownManager.getInstance();
