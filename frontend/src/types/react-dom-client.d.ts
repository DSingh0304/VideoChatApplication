// Minimal declarations for react-dom/client used by the app
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): any;
  export function hydrateRoot(container: Element, vdom: any): any;
}
