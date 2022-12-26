<template>
  <el-select v-model="selectValue" @change="handleChange" v-bind="$attrs">
    <el-option v-for="item in getOptions" :key="item.value" :label="item[valueKey]" :value="item[labelKey]"></el-option>
  </el-select>
</template>

<script>
import {dictOptions} from '@/utils/dict'
export default {
  name: 'AppSelect',
  props: {
    // 绑定值
    value: {
      type: [String, Number],
      default: ''
    },
    // 选项
    options: {
      type: Array,
      default: () => []
    },
    // dict code
    code: {
      type: String,
      default: ''
    },
    // 绑定value的属性
    valueKey: {
      type: String,
      default: 'value'
    },
    // 绑定label的属性
    labelKey: {
      type: String,
      default: 'label'
    },
    // 不展示的值
    excludes: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectValue: ''
    }
  },
  computed: {
    getOptions () {
      let options
      console.log('111')
      if (this.options.length) {
        options = this.excludes.length ? this.options.filter(item => !this.excludes.includes(item.value)) : this.options
        console.log(options)

        return options
      } else if (this.code) {
        options = this.excludes.length ? dictOptions[this.code].filter(item => !this.excludes.includes(item.value)) : dictOptions[this.code]
        console.log(options)
        console.log(this.excludes)
        return options
      } else {
        return []
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        this.selectValue = val
      }
    }
  },
  methods: {
    // 选中发生变化
    handleChange (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style></style>
