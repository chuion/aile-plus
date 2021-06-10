
/**
 * @param {Array} tooltipTheme
 * @description 注册tooltip皮肤
 * 规则：
 * [
 *  // effect: 'custom' 采用的样式
      {
        name: 'custom',
        styles: {
          padding: '5px',
          background: '#eee',
          borderColor: 'red',
          color: 'skyblue',
          fontSize: '14px'
        }
      }
    ]
 */
export function registerTheme(tooltipTheme) {
  if (tooltipTheme && tooltipTheme.length > 0) {
    // 添加css变量与样式
    let cssText = '';
    const styleElement = document.createElement('style');
    const head = document.getElementsByTagName('head')[0];
    tooltipTheme.forEach(theme => {
      let bodyStyle = 'transform-style: preserve-3d;'
      if (theme.style) {
        Object.keys(theme.style).forEach(key => {
          bodyStyle += `${parseCamel2KebbaCase(key)}:${theme.style[key]};`
        })
        cssText += `body .aile-tooltip__popper.is-${theme.name} {${bodyStyle}}`
      }
      if (theme.style.background || theme.style.backgroundColor) {
        cssText += `
          .aile-tooltip__popper .el-popper__arrow::before {
            background: ${theme.style.background || theme.style.backgroundColor};
          }
        `
      }
    });
    const textNode = document.createTextNode(cssText);
    styleElement.appendChild(textNode);
    head.appendChild(styleElement);
  }
}

function parseCamel2KebbaCase(str){
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}