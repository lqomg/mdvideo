/**
 * 转换base64为file对象
 * 方法来自网络
 *
 * @param base64 Base64
 * @param fileName 图片名称
 * @returns
 */
export const base642File = (base64: string, fileName = 'image.png') => {
  const arr = base64.split(',');
  const regResult = arr[0].match(/:(.*?);/);

  if (regResult) {
    const mime = regResult[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  return null;
};

/**
 * 对代码块添加行号
 *
 * @param code 代码html内容
 * @returns string
 */
export const generateCodeRowNumber = (code: string) => {
  if (!code) {
    return code;
  }

  const list = code.split('\n');
  // 行号html代码拼接列表
  const rowNumberList = ['<span rn-wrapper aria-hidden="true">'];
  list.forEach(() => {
    rowNumberList.push('<span></span>');
  });
  rowNumberList.push('</span>');
  return `<span class="code-block">${code}</span>${rowNumberList.join('')}`;
};

/**
 * 逻辑分离katex相关文本
 * 不再采用正确匹配，会导致性能问题
 *
 * @param str 待处理字符串
 * @param key 单行或多行标识符
 * @returns []
 */
export const splitKatexValue = (str: string, key = '$'): Array<string> => {
  const arr = str.split(key);
  let regText = key;
  let text = '';

  for (let i = 1; i < arr.length; i++) {
    // 以\结尾的添加到文本中
    if (/\\$/.test(arr[i])) {
      regText += arr[i] + '$';
      text += arr[i] + '$';
    } else {
      regText += arr[i] + key;
      text += arr[i];

      break;
    }
  }

  return [regText, text];
};

/**
 * 获取元素相对目标元素顶部位置
 * 代码来自antd
 *
 * @param element
 * @param container
 * @returns
 */
export const getRelativeTop = (element: HTMLElement, container: HTMLElement): number => {
  const eleRect = element?.getBoundingClientRect();

  if (container === document.documentElement) {
    return eleRect.top - container.clientTop;
  }

  const conRect = container?.getBoundingClientRect();

  return eleRect.top - conRect.top;
};

/**
 * 获取随机字符
 *
 * @returns string
 */
export const uuid = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`;
