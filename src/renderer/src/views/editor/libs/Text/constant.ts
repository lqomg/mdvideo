/* eslint-disable @typescript-eslint/no-unused-vars */
import { CriclrPluginName } from '@renderer/plugins/Circle';
import { RoundedRectPluginName } from '@renderer/plugins/RoundedRect';
import { IMDCommonStyle } from '@renderer/types';

interface IFontFamilyList {
  value: string;
  style: any;
  commonStyle: Partial<IMDCommonStyle>;
}

export const Shapes = [
  {
    style: {
      border: '1px solid #008cff',
      height: '40px',
      width: '60px'
    },

    commonStyle: { backgroundColor: 'rgba(0,0,0,0)', borderColor: '#4d9d51' },
    elName: RoundedRectPluginName,
    name: '矩形'
  },
  {
    style: { border: '1px solid #008cff', height: '40px', width: '60px', borderRadius: '10px' },
    commonStyle: { borderRadius: 80, backgroundColor: 'rgba(0,0,0,0)' },
    elName: RoundedRectPluginName,
    name: '圆角矩形'
  },
  {
    style: {
      border: '1px solid #4d9d51',
      height: '40px',
      width: '60px',
      backgroundColor: '#008cff'
    },
    commonStyle: { backgroundColor: '#008cff', borderColor: '#4d9d51' },
    elName: RoundedRectPluginName,
    name: '矩形'
  },
  {
    style: {
      border: '1px solid #4d9d51',
      height: '40px',
      width: '60px',
      borderRadius: '10px',
      backgroundColor: '#008cff'
    },
    commonStyle: { borderRadius: 80, backgroundColor: '#008cff', borderColor: '#4d9d51' },
    elName: RoundedRectPluginName,
    name: '圆角矩形'
  },
  {
    style: { border: '1px solid #008cff', height: '60px', width: '60px', borderRadius: '30px' },
    commonStyle: { width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(0,0,0,0)' },
    elName: CriclrPluginName,
    name: '圆形'
  },
  {
    style: {
      border: '1px solid #4d9d51',
      height: '60px',
      width: '60px',
      borderRadius: '30px',
      backgroundColor: '#008cff'
    },
    commonStyle: {
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: '#008cff',
      borderColor: '#4d9d51'
    },
    elName: CriclrPluginName,
    name: '圆形'
  },
  {
    style: { border: '1px solid #008cff', height: '40px', width: '60px', borderRadius: '25px' },
    commonStyle: { width: 400, height: 300, borderRadius: 200, backgroundColor: 'rgba(0,0,0,0)' },
    elName: RoundedRectPluginName,
    name: '椭圆形'
  },

  {
    style: {
      border: '1px solid #4d9d51',
      height: '60px',
      width: '50px',
      borderRadius: '25px',
      backgroundColor: '#008cff'
    },
    commonStyle: {
      width: 400,
      height: 300,
      borderRadius: 200,
      backgroundColor: '#008cff',
      borderColor: '#4d9d51'
    },
    elName: RoundedRectPluginName,
    name: '椭圆形'
  }
];

export const getFontantList = (width: number, height: number): IFontFamilyList[] => {
  return [
    {
      value: '艺术字',
      style: {},
      commonStyle: {
        letterSpacing: 4,
        paddingTop: 10,
        height: (width / 20) * 1.4,
        fontSize: width / 20,
        fontFamily: 'KaiTi',
        fontWeight: 'bold',
        dropShadow: true
      }
    },
    {
      value: '艺术字',
      style: {},
      commonStyle: {
        letterSpacing: 4,
        height: (width / 20) * 1.4,
        fontSize: width / 20,
        fontFamily: 'KaiTi',
        fontWeight: 'bold',
        color: '#BFa1z1',
        showFill: true,
        fill: ['#ffcc00', '#ffaacc', '#00ff99']
      }
    }
  ];
};
