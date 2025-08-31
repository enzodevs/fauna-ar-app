declare module '@ar-js-org/ar.js' {
  export interface ARToolkitContext {
    init: (callback: () => void) => void;
    getProjectionMatrix: () => any;
  }

  export interface ARToolkitSource {
    init: (callback: () => void, errorCallback: () => void) => void;
    onResize: () => void;
    domElement: HTMLElement;
  }

  export interface ARMarkerControls {
    addEventListener: (event: string, callback: () => void) => void;
  }

  const AR: {
    Context: {
      createDefaultCamera: (scene: any) => any;
    };
    Source: {
      init: (options: any) => ARToolkitSource;
    };
  };

  export default AR;
}