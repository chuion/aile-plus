<template>
  <el-tooltip
    ref="aileTooltip"
    v-bind="$attrs"
    class="aile-tooltip"
    :placement="calcPlacement"
    :open-delay="calcShowAfter"
    :effect="calcEffect"
    :popper-class="'aile-tooltip__popper' + ' ' + popperClass"
  >
    <template #content>
      <slot name="content" />
    </template>
    <slot />
  </el-tooltip>
</template>

<script>

const DefaultConfig = {}

export default {
  name: 'AileTooltip',

  inheritAttrs: false,
  props: {
    config: {
      // maxWidth 最大宽度
      type: Object,
      default: () => ({})
    },
    placement: {
      type: String,
      default: undefined
    },
    showAfter: {
      type: Number,
      default: 0
    },
    effect: {
      type: String,
      default: undefined
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    mergeConfig() {
      return {
        ...DefaultConfig,
        ...this.$aileTooltip.config,
        ...this.config
      };
    },
    calcPlacement() {
      if (this.placement === undefined) {
        return this.$aileTooltip.placement;
      }
      return this.placement;
    },
    calcShowAfter() {
      return this.showAfter || this.$aileTooltip.showAfter;
    },
    calcEffect() {
      if (this.effect === undefined) {
        return this.$aileTooltip.effect;
      }
      return this.effect;
    }
  }
};
</script>
