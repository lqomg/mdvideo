/* eslint-disable @typescript-eslint/no-unused-vars */
import { sleep } from '@renderer/utils';
import html2canvas from 'html2canvas';
import { isEqual } from 'lodash';
import { getValue } from './parseCommStyle';

class HtmlToImageManager {
  private static instance: HtmlToImageManager;
  public htmlImageList: any[] = [];
  static getInstance() {
    if (!this.instance) {
      this.instance = new HtmlToImageManager();
    }
    return this.instance;
  }
  getImageByNode(node: HTMLElement, styleObj: any) {
    const data = this.htmlImageList.find(
      (h) => h.innerText === node.innerText && isEqual(h.styleObj, styleObj)
    );
    return data?.data || null;
  }
  async createImage(props: { element: any; styleObj?: any; videoInfo: any }) {
    const { element, styleObj, videoInfo } = props;
    const node = element.htmlNode;
    const data = this.getImageByNode(node, styleObj);
    if (data) {
      return data;
    } else {
      const data = await this.htmlToImage(props);
      if (data && data.data) {
        this.htmlImageList.push({
          innerText: node.innerText,
          data,
          styleObj
        });
      }
      return data;
    }
  }
  private async htmlToImage(props: { element: any; styleObj?: any; videoInfo: any }) {
    try {
      const { element, styleObj = {}, videoInfo } = props;
      const node = element.htmlNode as HTMLElement;
      const vHeight = videoInfo.height;
      const vWidth = videoInfo.width;
      if (element.type === 'table') {
        const padding = styleObj.padding;
        const color = styleObj.color || '#010101';
        let fontSize = styleObj.fontSize || vWidth * 0.02;
        fontSize = getValue(fontSize, vWidth);
        const fontFamily = styleObj.fontFamily || '微软雅黑';
        node.style.padding = padding + 'px';
        node.style.color = color;
        node.style.fontSize = fontSize + 'px';
        node.style.fontFamily = fontFamily;
        await sleep(200);
      }
      if (element.type === 'list') {
        const padding = styleObj.padding;
        const color = styleObj.color || '#010101';
        let fontSize = styleObj.fontSize || vWidth * 0.02;
        fontSize = getValue(fontSize, vWidth);
        const fontFamily = styleObj.fontFamily || '微软雅黑';
        node.style.padding = padding + 'px';
        node.style.color = color;
        node.style.fontSize = fontSize + 'px';
        node.style.fontFamily = fontFamily;
        node.style.margin = '10px';
        node.style.backgroundColor = styleObj.backgroundColor || 'transparent';
        // node.querySelectorAll('li').forEach(c => {
        //   if (c?.style) {
        //     c.style.margin = 0 + 'px';

        //   }
        // })
        await sleep(200);

      }


      const canvas = await html2canvas(node, {
        scale: 5,
        backgroundColor: null
      });
      const imageData = canvas.toDataURL('image/png', 1.0);
      return {
        data: imageData,
        info: {
          width: canvas.width,
          height: canvas.height
        }
      };
    } catch (error) {
      console.error(error);
      return {
        data: '',
        info: { width: 0, height: 0 }
      };
    }
  }
}

export const htmlToImageManager = HtmlToImageManager.getInstance();
