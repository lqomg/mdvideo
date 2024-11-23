import { getFontList } from '@renderer/style/loadFont';
import { completionLists, sceneConfigCompletionLists } from './completions';
/* eslint-disable prefer-const */
const numberWTip = `当值介于 “0” 至 “1” 之间时表示占视频宽度的比例，
如0.5表示占视频“宽度”的50%`;
const numberHTip = `当值介于 “0” 至 “1” 之间时表示占视频宽度的比例，
如0.5表示占视频“高度”的50%`;

export const getElementComletions = () => {
  const list: any[] = [];
  for (let i = 0; i < completionLists.length; i++) {
    let { label, detail, info, display, tip, children } = completionLists[i];
    if (tip === 'w') {
      info = info + numberWTip;
    }
    if (tip === 'h') {
      info = info + numberHTip;
    }
    list.push({
      label: label,
      detail,
      info,
      display,
      tip,
      children
      // apply: label + (children?.length ? '' : '=')
    });
  }
  return list;
};

export const getSceneConfigCompletionList = () => {
  const list: any[] = [];
  for (let i = 0; i < sceneConfigCompletionLists.length; i++) {
    let { label, detail, info, tip, display, children } = sceneConfigCompletionLists[i];

    list.push({
      label: label,
      detail,
      info,
      display,
      tip,
      children
      // apply: label + (children?.length ? '' : '=')
    });
  }
  return list;
};

export const getComletions = async () => {
  const elementComletions = getElementComletions();
  let comletions = [];
  comletions.push((context: any) => {
    const word = context.matchBefore(/@.{0,}/);
    if (word === null || (word.from == word.to && context.explicit)) {
      return null;
    }
    return {
      from: word.from,
      options: elementComletions
    };
  });
  const eleChildren = elementComletions.filter((c) => c.children?.length > 0);
  for (let i = 0; i < eleChildren.length; i++) {
    const { label, detail, tip } = eleChildren[i];
    let children = eleChildren[i].children;
    if (label === '@fontFamily') {
      children = (await getFontList()).map((v) => {
        return {
          label: v.fontName,
          value: v.id
        };
      });
    }
    comletions.push((context: any) => {
      const reg = new RegExp(label + '.{0,}');
      const word = context.matchBefore(reg);
      if (word === null || (word.from == word.to && context.explicit)) {
        return null;
      }
      const list = children.map((v) => {
        let vdetail = v.label;
        let info = '设置' + detail + '为 ' + v.label;
        if (tip === 'color') {
          vdetail = `<span style="color:${v.value}">${vdetail}</span>`
        }
        if (tip === 'font') {
          vdetail = `<span style="font-family:${v.value}">${vdetail}</span>`;
        }
        if (tip === 'fillColor') {
          const fill = v.value;
          const backgroundImage = `linear-gradient( ${fill[0]}, ${fill[1]},${fill[2]})`;
          vdetail = `<span style="background-image:${backgroundImage};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${vdetail}</span>`;
        }
        if (tip === 'animate') {
          info = `<span style="display:flex;align-items: center;justify-content: center; height:50px;width:120px;"><span class="animate__animated animate__${v.value}" style="-animate-duration:2s;display:block;color:red;font-weight:bold;" >${v.label}</span>`
        }
        return {
          type: 'variable',
          label: label + '=' + v.value,
          info,
          detail: vdetail,
          display: v.label
        };
      });

      return {
        from: word.from,
        options: list
      };
    });
  }

  const sceneCompletionLists = getSceneConfigCompletionList();
  const sceneChildren = sceneCompletionLists.filter((c) => c.children?.length > 0);
  for (let i = 0; i < sceneChildren.length; i++) {
    const { label, detail, children, tip } = sceneChildren[i];
    comletions.push((context: any) => {
      const reg = new RegExp(label + '.{0,}');
      const word = context.matchBefore(reg);
      if (word === null || (word.from == word.to && context.explicit)) {
        return null;
      }
      const list = children.map((v) => {
        let vdetail = v.label;
        let info = '设置' + detail + '为 ' + v.label;
        if (tip === 'color') {
          vdetail = `<span style="background-color:${v.value};display:inline-block;width:40px;height:20px;"></span>`
        }
        if (tip === 'font') {
          vdetail = `<span style="font-family:${v.value}">${vdetail}</span>`;
        }
        if (tip === 'fillColor') {
          const fill = v.value;
          const backgroundImage = `linear-gradient( ${fill[0]}, ${fill[1]},${fill[2]})`;
          vdetail = `<span style="background-image:${backgroundImage};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${vdetail}</span>`;
        }
        if (tip === 'animate') {
          info = `<span style="display:flex;align-items: center;justify-content: center; height:50px;width:120px;"><span class="animate__animated animate__${v.value}" style="-animate-duration:2s;display:block;color:red;font-weight:bold;" >${v.label}</span>`
        }
        return {
          type: 'variable',
          label: label + '=' + v.value,
          info,
          detail: vdetail,
          display: v.label
        };
      });
      return {
        from: word.from,
        options: list
      };
    });
  }
  comletions.push((context: any) => {
    const word = context.matchBefore(/&.{0,}/);
    if (word === null || (word.from == word.to && context.explicit)) {
      return null;
    }
    return {
      from: word.from,
      options: sceneCompletionLists
    };
  });
  return comletions;
};
