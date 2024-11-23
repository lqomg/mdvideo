import { IMDCustomeAnimate } from '@api/types';

export const AnimateSpeed = [
  {
    label: '快',
    value: 1
  },
  {
    label: '一般',
    value: 1.5
  },
  {
    label: '慢',
    value: 2
  },
  {
    label: '超慢',
    value: 3
  },
  {
    label: '超级快',
    value: 0.5
  }
];

export const DefaultCustomeAnimate: IMDCustomeAnimate = {
  from: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    width: 100,
    height: 100
  },
  to: {
    x: 10,
    y: 10,
    rotate: 0,
    opacity: 1,
    scale: 1,
    width: 100,
    height: 100
  },
  time: 1,
  show: false,
  ease: ''
};

export const AnamiationEaseTypes = [
  'Linear.None',
  'Quadratic.In',
  'Quadratic.Out',
  'Quadratic.InOut',
  'Cubic.In',
  'Cubic.Out',
  'Cubic.InOut',
  'Quartic.In',
  'Quartic.Out',
  'Quartic.InOut',
  'Quintic.In',
  'Quintic.Out',
  'Quintic.InOut',
  'Sinusoidal.In',
  'Sinusoidal.Out',
  'Sinusoidal.InOut',
  'Exponential.In',
  'Exponential.Out',
  'Exponential.InOut',
  'Circular.In',
  'Circular.Out',
  'Circular.InOut',
  'Elastic.In',
  'Elastic.Out',
  'Elastic.InOut',
  'Back.In',
  'Back.Out',
  'Back.InOut',
  'Bounce.In',
  'Bounce.Out',
  'Bounce.InOut'
];
