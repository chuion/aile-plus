/*
 * @Author: songhc
 * @Date: 2021-06-04 18:37:03
 * @LastEditTime: 2021-06-04 18:47:50
 * @LastEditors: songhc
 * @FilePath: /vite-project/src/components/aile-ui/lib/tooltip/index.js
 */
import AileTooltip from './src/Tooltip.vue';
import { registerTheme } from './src/theme.js';

AileTooltip.install = function(app, option = {}) {
  const defaultOption = { placement: 'bottom', showAfter: 0, config: {} };
  if ({}.toString.call(option.config) !== '[object Object]') {
    option.config = {};
  }
  if ({}.hasOwnProperty.call(option.config, 'themes')) {
    const themeList = JSON.parse(JSON.stringify(option.config.themes || []));
    registerTheme(themeList || []);
    delete option.config.themes;
  }
  app.config.globalProperties.$aileTooltip = { ...defaultOption, ...option };
  app.component(AileTooltip.name, AileTooltip);


};

export default AileTooltip;
