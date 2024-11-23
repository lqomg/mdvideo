import { FFNode } from 'ffcreator';
import { createCanvas, Sprite, Texture, Graphics } from 'inkpaint';
import { getHexColor } from '../utils';

export interface FFShape {
  borderColor: string;
  bgColor: string;
  lineSize: number;
  radius: number;
  [k: string]: any;
}

export class FFRoundedRect extends FFNode {
  [x: string]: any;
  constructor(options: FFShape) {
    super(options as any);
  }

  /**
   * Functions for drawing images
   * @private
   */
  createDisplay() {
    const [width, height] = this.getWH();
    if (!this.canvas) this.canvas = createCanvas(width, height);
    const { borderColor, bgColor, lineSize, radius } = this.conf as any;
    const lineColor = getHexColor(borderColor);
    const fillColor = getHexColor(bgColor);
    this.graphics = new Graphics();
    this.graphics.lineStyle(lineSize, lineColor.color, lineColor.opacity);
    this.graphics.beginFill(fillColor.color, fillColor.opacity);
    this.display = new Sprite(Texture.newEmpty());
    this.graphics.drawRoundedRect(0, 0, width, height, radius);
    this.display.addChild(this.graphics);
    this.setAnchor(0.5);
    this.setDisplaySize();
  }

  /**
   * Functions for setDisplaySize
   * @private
   */
  setDisplaySize() {
    const { display } = this;
    const [width, height] = this.getWH();

    if (width && height) {
      display.width = width;
      display.height = height;
      display.setScaleToInit();
    }
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setWH(width, height) {
    this.setSize(width, height);
    this.setDisplaySize();
  }
}
