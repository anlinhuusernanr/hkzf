import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//导入字体图标库
import './assets/fonts/iconfont.css';

//导入react-virtualized
import 'react-virtualized/styles.css';
//自己写的全局需要放在组件库后面导入,这样样式才会生效
import 'antd-mobile/dist/antd-mobile.css';
import './index.css';
ReactDOM.render(
  <App />,
  document.getElementById('root')
);