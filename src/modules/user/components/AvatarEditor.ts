declare module 'react-avatar-editor' {
  import {Component} from 'react';

  interface AvatarEditorProps {
    image: string;
    width?: number;
    height?: number;
    border?: number | [number, number];
    borderRadius?: number;
    color?: [number, number, number, number]; // RGBA
    scale?: number;
    rotate?: number;
    className?: string;
    style?: React.CSSProperties;
  }

  class AvatarEditor extends Component<AvatarEditorProps> {
    getImage(): HTMLCanvasElement;
    getImageScaledToCanvas(): HTMLCanvasElement;
    getCroppingRect(): { x: number; y: number; width: number; height: number };
  }

  export default AvatarEditor;
}