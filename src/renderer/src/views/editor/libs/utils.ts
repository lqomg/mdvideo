import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';

export const addSourceElement = (item: any) => {
  const editorStore = useEditorStore();
  const { projectInfo } = storeToRefs(editorStore);
  let mdType = '';
  let commonStyle = {};
  const propsValue: any = {
    src: item.filePath
  };
  if (item.type === 'bgs' || item.type === 'bg3d' || item.type === 'bgColors') {
    editorStore.getActiveScene().commonStyle.backgroundImage = item.filePath;
    return;
  } else {
    switch (item.type) {
      case 'images':
        mdType = 'md-image';
        break;
      case 'qbq':
        mdType = 'md-image';
        commonStyle = {
          width: projectInfo.value.width * 0.3,
          height: projectInfo.value.height * 0.3
        };
        break;
      case 'videos':
        mdType = 'md-video';
        propsValue.cover = item.cover;
        break;
      case 'audios':
        mdType = 'md-audio';
        propsValue.totalDuration = item.duration;
        break;
      default:
        break;
    }
    if (mdType) {
      editorStore.addElement(mdType, commonStyle, propsValue);
    }
  }
};
