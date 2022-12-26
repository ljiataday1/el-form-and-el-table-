<template>
  <el-form
    :model="formData"
    class="app-form"
    ref="appForm"
    :rules="rules"
    @submit.native.prevent
    :labelWidth="getLabelWidth"
  >
    <el-row :gutter="gutter">
      <el-col v-for="item in formConfig" :key="item.prop" :span="item.span">
        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
          <!-- 自定义label -->
          <template #label>
            <slot
              v-if="$slots[item.prop + 'Label']"
              :name="item.prop + 'Label'"
            ></slot>
            <span v-else>{{ item.label }}</span
            >{{ item.labelSuffix || labelSuffix }}
          </template>
          <!-- 只读时展示的数据 -->
          <span v-if="item.attributes.readonly">
            {{ formData[item.prop] }}
          </span>
          <template v-else-if="item.type === 'slot'">
            <slot :name="item.prop"></slot>
          </template>
          <!-- 组件 -->
          <component
            v-else
            v-model="formData[item.prop]"
            :is="getComponentType(item.type)"
            v-bind="item.attributes"
            v-on="item.event"
          />
        </el-form-item>
      </el-col>
      <!-- 按钮 -->
      <div class="bttons">
        <el-button type="primary" size="small" @click="querySearch"
          >查询</el-button
        >
        <el-button @click="reset" size="small">重置</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script>
import customeCop from './custom'
export default {
  components: { ...customeCop },
  props: {
    // formData
    value: {
      type: Object,
      default: () => {}
    },
    // 配置
    formList: {
      type: Array,
      default: () => []
    },
    // 默认表单所占宽度
    defaultSpan: {
      type: Number,
      default: 6
    },
    // 表单间距
    gutter: {
      type: Number,
      default: 15
    },
    // 是否自动重置
    isAutoReset: {
      type: Boolean,
      default: true
    },
    // 是否查询前校验
    isCheck: {
      type: Boolean,
      default: true
    },
    // 是否全局只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否全局禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 全局rules
    rules: {
      type: Object,
      default: () => {}
    },
    // 全局设置label宽度
    labelWidth: {
      type: String,
      default: ''
    },
    // 全局设置label后缀
    labelSuffix: {
      type: String,
      default: ':'
    },
    // 是否取label最大宽度
    maxLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      customeCop: Object.freeze(customeCop),
      formConfig: [],
      widthArr: [],
      maxWidth: 0
    }
  },
  computed: {
    formData: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    // 获取labelWidth
    getLabelWidth () {
      if (!this.labelWidth) {
        return this.maxWidth + 'px'
      } else {
        return this.labelWidth
      }
    }
  },
  watch: {
    formList: {
      handler (val) {
        this.formConfig = this.setFormList(val)
      },
      immediate: true
    }
  },

  methods: {
    // 获取最大label宽度
    getMaxLabelWidth (item) {
      const span = document.createElement('span')
      let isRequire
      if (item.rules && item.rules.required) {
        isRequire = item.rules && item.rules.required ? '*' : ''
        span.style.paddingLeft = '4px'
      }
      span.innerText = item.label + (item.labelSuffix || this.labelSuffix) + (isRequire || '')
      span.className = 'el-form-item__label'
      document.body.append(span)
      const width = span.clientWidth
      this.widthArr.push(width)
      const maxWidth = Math.max(...this.widthArr)
      this.maxWidth = maxWidth + 1
      span.remove()
    },
    // 设置默认属性
    setFormList (formList) {
      const choose = ['select', 'date', 'time']

      this.widthArr = []
      formList.forEach(item => {
        // 设置默认 placeholder
        const text = choose.includes(item.type) ? '请选择' : '请输入'
        this.isEmpty(item.attributes) && (item.attributes = {})
        item.attributes.placeholder = text + item.label
        // 默认搜索框带清空
        item.attributes.clearable = true
        // 设置默认span
        item.span = item.span || this.defaultSpan
        // 设置全局只读
        item.attributes.readonly = item.attributes.readonly || this.readonly
        // 设置全局禁用
        item.attributes.disabled = item.attributes.disabled || this.disabled
        // 是否必填
        if (item.required === true) {
          item.rules = {required: true, message: '请输入' + item.label}
        }
        //  获取最大label宽度
        this.maxLabel && this.getMaxLabelWidth(item)
      })
      return formList
    },
    // 获取组件类型
    getComponentType (type) {
      switch (type) {
        case 'numberInput':
          return 'elInputNumber'
        case 'radio':
          return 'elRadio'
        case 'checkbox':
          return 'elCheckbox'
        case 'switch':
          return 'elSwitch'
        case 'date':
          return 'elDatePicker'
        case 'time':
          return 'elTimeSelect'
        case 'select':
        case 'dict':
          return 'AppSelect'
        default:
          return 'elInput'
      }
    },
    isEmpty (data) {
      return data === undefined || data === null
    },
    // 查询
    querySearch () {
      if (this.isCheck) {
        return new Promise((resolve, reject) => {
          this.$refs.appForm.validate(vail => {
            if (vail) {
              resolve()
              this.$emit('search')
            } else {
              reject(new Error())
            }
          })
        })
      } else {
        this.$emit('search')
      }
    },
    // 重置
    reset () {
      if (!this.isAutoReset) {
        this.$emit('reset')
      }
      this.$refs.appForm.resetFields()
    },
    // 校验全部
    validate (callback) {
      this.$refs.appForm.validate(callback)
    },
    // 对部分表单字段进行校验的方法，不传校验全部
    validateField (props, callback) {
      this.$refs.appForm.validateField(props, callback)
    },
    // 对整个表单进行重置
    resetFields () {
      this.$refs.appForm.resetFields()
    },
    // 移除表单项的校验结果
    clearValidate (props) {
      this.$refs.appForm.clearValidate(props)
    }
  }
}
</script>

<style lang="css" scoped>
.app-form {
  text-align: right;
}
.app-form .el-form-item {
  margin-bottom: 12px;
  text-align: left;
}
.app-form .bttons {
  margin-right: 7.5px;
}
.el-form-item__label,
.el-form-item__content {
  line-height: 35px;
}
.el-select{width: 100%;}
</style>
