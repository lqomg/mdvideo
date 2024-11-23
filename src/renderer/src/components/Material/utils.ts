import { useEditorStore } from '@renderer/store';
import { isTemplate } from 'element-plus/es/utils';
import { storeToRefs } from 'pinia';
import { toRaw } from 'vue';
const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
const videoTypes = ['mp4', 'avi', 'mov'];
const audioTypes = ['mp3', 'ogg', 'wav'];
const fontTypes = ['ttf', 'otf'];
export const isImage = (ext: string) => imageTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isVideo = (ext: string) => videoTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isGif = (ext: string) => ext === 'gif';
export const isAudio = (ext: string) => audioTypes.find((s) => ext.toLocaleLowerCase() === s);
export const isFont = (ext: string) => fontTypes.find((s) => ext.toLocaleLowerCase() === s);

export const getIconByExt = (ext: string) => {
  if (isGif(ext)) return 'GIF';
  if (isImage(ext)) return 'tupian5';
  if (isVideo(ext)) return 'shipin5';
  if (isAudio(ext)) return 'yinpinwenjian';
  if (isFont(ext)) return 'fonts';
  return 'wenjian';
};

export const addMaterialElement = (
  item: { name: string; path: string; ext: string },
  currentDir: string
) => {
  const { name, path, ext } = toRaw(item);

  const editorStore = useEditorStore();
  const { projectInfo } = storeToRefs(editorStore);
  let mdType = '';
  let commonStyle = {};
  const propsValue: any = {
    src: item.path
  };
  const isBackground = currentDir.includes('背景');
  const isQAQ = currentDir.includes('表情包');
  if (isImage(ext) || isGif(ext)) {
    if (isBackground) {
      editorStore.getActiveScene().commonStyle.backgroundImage = path;
      return;
    } else {
      mdType = 'md-image';
      if (isQAQ) {
        commonStyle = {
          width: projectInfo.value.width * 0.3,
          height: projectInfo.value.height * 0.3
        };
      }
    }
  } else if (isVideo(ext)) {
    mdType = 'md-video';
  } else if (isAudio(ext)) {
    mdType = 'md-audio';
  } else if (isFont(ext)) {
    mdType = 'md-text';
    commonStyle = {
      fontSize: projectInfo.value.width / 30,
      height: (projectInfo.value.width / 30) * 2,
      fontFamily: name
    };
    propsValue.text = name || '字体文件';
  }
  if (mdType) {
    editorStore.addElement(mdType, commonStyle, propsValue);
  }
};
