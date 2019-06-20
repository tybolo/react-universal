// 全局变量
declare const TARGET_ENV: 'client' | 'server';
declare const NODE_ENV: 'production' | 'development';

interface MyWindow extends Window {
  __REDUX_DATA__: any;
}

declare module '*.scss'
declare module '*.svg'
declare var window: MyWindow;

// export default function (webpackEnv: 'production' | 'development') : any
