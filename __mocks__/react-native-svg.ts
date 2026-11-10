import React from 'react';

export const Svg = (props: any) => React.createElement('svg', props, props.children);
export const Path = (props: any) => React.createElement('path', props);
export const Rect = (props: any) => React.createElement('rect', props);
export const Circle = (props: any) => React.createElement('circle', props);
export const Line = (props: any) => React.createElement('line', props);
export const Text = (props: any) => React.createElement('text', props, props.children);
export const G = (props: any) => React.createElement('g', props, props.children);

export default {
  Svg,
  Path,
  Rect,
  Circle,
  Line,
  Text,
  G,
};
