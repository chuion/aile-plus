<template>
  <el-table-column
    v-bind="$attrs"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="calcShowOverflowTooltip"
    :align="calcAlignForCols"
    :header-align="calcHeaderAlignForCols"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
  >
    <template #header="slotProps">
      <aile-render
        v-if="column.renderHeader"
        :scope="slotProps"
        :render="column.renderHeader"
      />
      <span v-else>{{ slotProps.column.label }}</span>
    </template>

    <template #default="slotProps">
      <aile-render :scope="slotProps" :render="column.render" />
      <template v-if="column.children">
        <aile-column
          v-for="(col, index) in column.children"
          :key="index"
          :column="col"
        />
      </template>
    </template>
  </el-table-column>
</template>

<script lang="tsx">
import AileRender from "./Render.jsx";

const cellForced = {
  selection: {
    renderHeader: ({ store }) => {
      function isDisabled() {
        return store.states.data.value && store.states.data.value.length === 0;
      }
      return (
        <el-checkbox
          disabled={isDisabled()}
          indeterminate={
            store.states.selection.value.length > 0 &&
            !store.states.isAllSelected.value
          }
          onUpdate:modelValue={store.toggleAllSelection}
          modelValue={store.states.isAllSelected.value}
        />
      );
    },
    renderCell: ({ row, column, store, $index }) => {
      if (!store) return;
      return (
        <el-checkbox
          modelValue={store.isSelected(row)}
          disabled={
            column.selectable
              ? !column.selectable.call(null, row, $index)
              : false
          }
          onChange={() => {
            store.commit("rowSelectedChanged", row);
          }}
          onClick={(event) => event.stopPropagation()}
        />
      );
    },
    sortable: false,
    resizable: false,
  },
  index: {
    renderHeader: ({ column }) => column.label || "#",
    renderCell: function ({ column, $index }) {
      let i = $index + 1;
      const index = column.index;

      if (typeof index === "number") {
        i = $index + index;
      } else if (typeof index === "function") {
        i = index($index);
      }
      return <div>{i}</div>;
    },
    sortable: false,
    resizable: false,
  },
  expand: {
    renderHeader: ({ column }) => column.label || "",
    renderCell: ({ row, store }) => {
      if (!store) return;
      const classes = ["el-table__expand-icon"];
      if (store.states.expandRows.value.indexOf(row) > -1) {
        classes.push("el-table__expand-icon--expanded");
      }
      const callback = function (e) {
        e.stopPropagation();
        store.toggleRowExpansion(row);
      };
      return (
        <div class={classes} onClick={callback}>
          <i class="el-icon el-icon-arrow-right" />
        </div>
      );
    },
    sortable: false,
    resizable: false,
    className: "el-table__expand-column",
  },
};

export default {
  name: "AileColumn",

  components: { AileRender },
  inheritAttrs: false,
  props: {
    column: {
      type: Object,
      default: () => ({}),
    },
    colEmptyText: {
      type: String,
      default: "-",
    },
    colAlign: {
      type: String,
      default: "",
    },
    colHeaderAlign: {
      type: String,
      default: "",
    },
    colShowOverflowTooltip: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    calcAlignForCols() {
      return (
        this.column.align ||
        this.colAlign ||
        this.$aileTable.colAlign ||
        "center"
      );
    },
    calcHeaderAlignForCols() {
      return (
        this.column.headerAlign ||
        this.colHeaderAlign ||
        this.$aileTable.colHeaderAlign ||
        this.calcAlignForCols
      );
    },
    calcEmptyTextForCols() {
      return this.colEmptyText || this.$aileTable.colEmptyText;
    },
    calcShowOverflowTooltip() {
      return (
        this.column.showOverflowTooltip ||
        this.colShowOverflowTooltip ||
        this.$aileTable.colShowOverflowTooltip
      );
    },
  },
  watch: {
    column: {
      handler() {
        this.generateRender();
      },
      immediate: true,
    },
  },
  methods: {
    getPropByPath(obj, path, strict) {
      let tempObj = obj;
      path = path.replace(/\[(\w+)\]/g, ".$1");
      path = path.replace(/^\./, "");

      const keyArr = path.split(".");
      let i = 0;
      for (i; i < keyArr.length - 1; i++) {
        if (!tempObj && !strict) break;
        const key = keyArr[i];

        if (key in tempObj) {
          tempObj = tempObj[key];
        } else {
          if (strict) {
            throw new Error("please transfer a valid prop path to form item!");
          }
          break;
        }
      }
      return {
        o: tempObj,
        k: keyArr[i],
        v: (tempObj || {})[keyArr[i]],
      };
    },
    generateRender() {
      if (this.column.type) {
        this.column.renderHeader = cellForced[this.column.type].renderHeader;
        this.column.render =
          this.column.render || cellForced[this.column.type].renderCell;
        return;
      }
      if (this.column.formatter) {
        this.column.render = (scope) => {
          const { row, column, $index } = scope;
          const property = column.property;
          const cellValue =
            property && this.getPropByPath(row, property, false).v;
          let value = this.column.formatter(row, column, cellValue, $index);
          if (!value && value !== 0) {
            value = this.calcEmptyTextForCols;
          }
          return <span class="aile-table-cell__formatter">{value}</span>;
        };
        return;
      }
      if (!this.column.render) {
        this.column.render = (scope) => {
          let value = scope.row[scope.column.property];
          if (!value && value !== 0) {
            value = this.calcEmptyTextForCols;
          }
          return <span>{value}</span>;
        };
      }
    },
  },
};
</script>

<style>
.aile-table .el-table__body-wrapper .cell.el-tooltip span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  white-space: nowrap;
}
</style>
