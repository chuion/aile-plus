<template>
  <el-dialog
    v-bind="mergeDialogAttrs"
    :custom-class="calcCustomClass"
    @closed="handleClosed"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot />
    <template
      v-if="!mergeConfig.hideFooter"
      #footer
    >
      <div
        class="aile-dialog__footer"
        :class="[`is-align-${mergeConfig.footerAlign}`]"
      >
        <slot name="footer">
          <el-button
            v-if="mergeConfig.showConfirm"
            :type="mergeConfig.confirmType"
            size="small"
            :loading="mergeConfig.confirmLoading"
            :disabled="mergeConfig.confirmDisabled"
            @click="handleConfirm"
          >
            {{ mergeConfig.confirmText }}
          </el-button>
          <el-button
            v-if="mergeConfig.showCancel"
            :type="mergeConfig.cancelType"
            size="small"
            @click="handleCancel"
          >
            {{ mergeConfig.cancelText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mergeAttrs, mergeClass } from '../../../utils'
import { DefaultConfig, DefaultDialogAttrs } from './config'

export default {
  name: 'AileDialog',

  inheritAttrs: false,
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    class: {
      type: [String, Array, Object],
      default: ''
    }
  },
  emits: ['cancel', 'confirm', 'update:modelValue', 'closed'],
  computed: {
    mergeConfig () {
      return {
        ...DefaultConfig,
        ...this.$aileDialog.config,
        ...this.config
      }
    },
    mergeDialogAttrs () {
      return mergeAttrs(DefaultDialogAttrs, this.$aileDialog.attrs, this.$attrs)
    },
    calcCustomClass () {
      return mergeClass(
        ['aile-dialog', this.mergeConfig.hideFooter && 'is-hide-footer'],
        this.class
      )
    }
  },
  methods: {
    async handleCancel () {
      if (this.mergeDialogAttrs.onCancel) {
        await this.$emit('cancel', this.done);
      } else if (this.mergeDialogAttrs.beforeClose) {
        this.mergeDialogAttrs.beforeClose(this.done);
      } else {
        this.done();
      }
    },
    handleClosed () {
      this.$emit('update:modelValue', false)
      if (this.$attrs.onClosed) {
        this.$emit('closed')
      }
    },
    handleConfirm() {
      this.$emit('confirm', this.done);
    },
    done() {
      this.$emit('update:modelValue', false);
    }
  }
}
</script>

<style scoped>
.aile-dialog :deep(.el-dialog__body) {
  padding: 20px 20px 0;
}

.aile-dialog.is-hide-footer :deep(.el-dialog__body) {
  padding: 20px;
}

.aile-dialog__footer {
  width: 100%;
  display: flex;
}

.aile-dialog__footer.is-align-right {
  justify-content: flex-end;
}

.aile-dialog__footer.is-align-center {
  justify-content: center;
}

.aile-dialog__footer.is-align-left {
  justify-content: flex-start;
}
</style>
