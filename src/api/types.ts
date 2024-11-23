export interface RequestPayload<T> {
  [k: string]: any;
  payload: T;
}

export interface ResponsePayload<T> {
  code: number;
  message: string;
  data: T;
}

export interface ServiceType<T> {
  name: string;
  req: RequestPayload<T>;
  res: ResponsePayload<T>;
}

export interface IMDCommonStyle {
  position: string;
  width: number;
  height: number;
  top: number;
  left: number;
  rotate: number;
  paddingTop: number;
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
  marginTop: number;
  marginLeft: number;
  marginRight: number;
  marginBottom: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  textAlign: string;
  color: string;
  candidateColor?: string[]; //新增随机颜色候选列表
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: string;
  opacity: number;
  zIndex: number;
  dropShadow: boolean;
  dropShadowAlpha: number;
  dropShadowBlur: number;
  dropShadowDistance: number;
  dropShadowColor: string;
  dropShadowAngle: number;
  fontStyle?: string;
  textDecoration?: string;
  showFill?: boolean;
  fill?: string[];
}

export interface IMDAnimate {
  type: string;
  time: number;
  delay: number;
}

export interface IMDCustomeAnimate {
  from: {
    x: number;
    y: number;
    opacity: number;
    rotate: number;
    scale: number;
    width: number;
    height: number;
  };
  to: {
    x: number;
    y: number;
    opacity: number;
    rotate: number;
    scale: number;
    width: number;
    height: number;
  };
  time: number;
  ease: string;
  show: boolean;
}
export interface IMDElement {
  uuid: string;
  elName: string;
  animations: {
    in: IMDAnimate;
    out: IMDAnimate;
    custom?: IMDCustomeAnimate;
  };
  duration: number;
  offset: number;
  commonStyle: IMDCommonStyle;
  propsValue: {
    [k: string]: any;
  };
}

export interface PluginProps extends IMDElement {
  scale: number;
  projectInfo: IMDProjectInfo;
  isPlaying: boolean;
  playCurrentTime: number;
}
export interface IMDProjectSceneData {
  duration: number;
  transName: string;
  transDuration: number;
}
export interface IMDProjectScene {
  uuid: string;
  data: IMDProjectSceneData;
  elements: IMDElement[];
  commonStyle: {
    backgroundColor: string;
    backgroundImage: string;
    backgroundSize: string;
  };
}
export interface IMDProjectInfo {
  name: string;
  fps: number;
  width: number;
  height: number;
  title: string;
  author: string;
  cover: string;
  audio?: string;
  audioName?: string;
}

export const MainWinSendToMarkdownWin = 'MainWinSendToMarkdownWin';
export const MarkdownWinSendToMainWin = 'MarkdownWinSendToMainWin';
