/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
  
declare module "react" {
  interface HTMLAttributes<T> {
    css?: any;
  }

  interface SVGAttributes<T> {
    css?: any;
  }
}

export {}