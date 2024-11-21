declare global {
  interface Window {
    J: {
      initAll: () => void;
      [key: string]: any;
    }
  }
}

export {};
