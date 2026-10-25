// Tiny scripts inlined in <head> so they run before first paint (no theme flash, no preloader flash).
// Kept in a plain module: exporting strings from a "use client" file would hand the server a client reference.

/** Adds `html.js`, and `html.dark` from the saved choice or the OS setting. */
export const themeScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

/** Adds `html.preload` on the first visit of a session on desktop (not with reduced motion), which shows the preloader. */
export const preloaderScript = `(function(){try{if(!sessionStorage.getItem('av:intro')&&matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('preload')}catch(e){}})()`;
