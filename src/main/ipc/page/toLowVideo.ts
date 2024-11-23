import { IMDProjectInfo, IMDProjectScene } from '@api/types';
import { cloneDeep, forIn, isNumber } from 'lodash';

const needUnitStr: string[] = [
  'width',
  'height',
  'top',
  'left',
  'paddingTop',
  'paddingLeft',
  'paddingRight',
  'paddingBottom',
  'paddingBottom',
  'marginTop',
  'marginLeft',
  'marginRight',
  'marginBottom',
  'borderWidth',
  'fontSize',
  'borderRadius',
  'letterSpacing'
];

export const toLowVideo = (projectInfo: IMDProjectInfo, scenes: IMDProjectScene[], scale = 1) => {
  const nProjectInfo = cloneDeep(projectInfo);
  let nscenes = cloneDeep(scenes);
  const { width, height, fps } = projectInfo;
  nProjectInfo.width = width / scale;
  nProjectInfo.height = height / scale;
  nscenes = nscenes.map((scene) => {
    const { elements } = scene;
    const nEles = elements.map((ele) => {
      const commomStyle = ele.commonStyle;
      Object.keys(commomStyle).forEach((key) => {
        if (needUnitStr.includes(key) && isNumber(commomStyle[key])) {
          commomStyle[key] = commomStyle[key] / scale;
        }
      });
      ele.commonStyle = commomStyle;
      return ele;
    });
    scene.elements = nEles;
    return scene;
  });
  return {
    scenes: nscenes,
    projectInfo: nProjectInfo
  };
};
