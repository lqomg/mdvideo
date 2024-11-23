import { IMDProjectScene } from '@api/types';
import getChartOptions from '@renderer/plugins/Chart/getChartOptions';
import { FontFamilyList } from '@renderer/plugins/Text/constant';
import { getFontList } from '@renderer/style/loadFont';
import { toRaw } from 'vue';

export const getScenes = async (scenes: IMDProjectScene[]) => {
  const objectKeys = ['fill', 'candidateColor'];
  for (let i = 0; i < scenes.length; i++) {
    const elements = scenes[i].elements;
    for (let j = 0; j < elements.length; j++) {
      const element = elements[j];
      if (element.elName === 'md-chart') {
        element.propsValue.option = getChartOptions(element.propsValue, true);
      }
      const commomStyle = element.commonStyle;
      const val = commomStyle['fontFamily'];
      if (val && !FontFamilyList.some((v) => v.value === val)) {
        const fontList = await getFontList();
        const f = fontList.find((v) => v.id === val);
        const fontPath = f?.fontFile;
        if (fontPath) {
          element.propsValue.fontPath = fontPath;
        }
      }
      for (let i = 0; i < objectKeys.length; i++) {
        const key = objectKeys[i];
        if (commomStyle[key]) {
          element.commonStyle[key] = toRaw(element.commonStyle[key]);
        }
      }
    }
  }
  return scenes;
};
