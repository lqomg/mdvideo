import { IGetLocalFont } from '@api/font';

let fontLists: any[] = [];
export const getFontList = async () => {
  if (fontLists?.length > 1) {
    return fontLists;
  }
  const { data } = await window.invoke<IGetLocalFont['req'], IGetLocalFont['res']>('getLocalFont', {
    payload: undefined
  });
  fontLists = data.list;
  return data?.list || [];
};

const loadFonts = async () => {
  const list = await getFontList();

  for (let i = 0; i < list.length; i++) {
    const { fontName, fontFile,id } = list[i];
    const css = document.createElement('style');
    css.type = 'text/css';
    let h =
      '@font-face { font-display: swap; font-family: "' +
      id +
      '"; src: url("' +
      `${fontFile?.startsWith('http') ? '' : 'file:///'}` +
      fontFile.replace(/\\/g, '//') +
      '"); }';
    css.innerHTML = h;
    document.body.appendChild(css);
  }
};

loadFonts();
