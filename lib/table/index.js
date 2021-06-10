import AileTable from './src/Table.vue';

/* istanbul ignore next */
AileTable.install = function(app, option = {}) {
  const defaultOption = {
    colAlign: null,
    colHeaderAlign: null,
    pagerOffset: 0,
    tablePadding: 0,
    colEmptyText: '',
    customClassName: '',
    colShowOverflowTooltip: false
  };
  app.config.globalProperties.$aileTable = {
    ...defaultOption,
    ...option
  };
  app.component(AileTable.name, AileTable);
};

export default AileTable;
