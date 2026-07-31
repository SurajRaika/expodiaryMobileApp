import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function InteractionIcon({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="M12 2C6.477 2 2 5.922 2 10.75c0 2.593 1.303 4.908 3.391 6.516a.75.75 0 0 1 .253.642c-.22 1.341-.832 2.766-1.571 3.733a.75.75 0 0 0 .976 1.096c2.091-1.121 4.183-2.14 5.214-2.585.253-.11.536-.1.737.048C11.332 20.352 11.664 20.375 12 20.375c5.523 0 10-3.922 10-8.75S17.523 2 12 2Z"
        fill={color}
      />
    </Svg>
  );
}
