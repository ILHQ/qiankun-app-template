import Vue from 'vue';
import AddressArea from '@/components/AddressArea';
import storage from '@/lib/storage';

export const baseForm = Vue.extend({
  components: {
    AddressArea,
  },
  model: {
    prop: 'form',
  },
  props: {
    rules: {
      type: Object,
      default: () => {},
    },
    labelWidth: {
      type: String,
      default: '',
    },
    formList: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      token: '',
      imgUpUrl: '',
      localRules: {},
    };
  },
  mounted() {
    this.imgUpUrl = `${process.env.VUE_APP_BASE_API}zd/media/`;
    this.token = storage.get('token');
    if (this.rules) {
      this.localRules = this.rules;
    } else {
      this.formList.map((t) => {
        if (t.rule) {
          t.ruleSelf
            ? this.$set(this.localRules, t.key, t.ruleSelf)
            : this.$set(this.localRules, t.key, [
                {
                  required: true,
                  message: `请${t.formType === 'input' ? '输入' : '选择'}${t.label}`,
                  trigger: ['blur', 'change'],
                },
              ]);
        }
      });
    }
  },
  render(h) {
    return h(
      'el-form',
      {
        attrs: {
          model: this.form,
          rules: this.localRules,
          'label-width': this.labelWidth,
        },
        ref: 'form',
      },
      this.formList.map((t) => {
        switch (t.formType) {
          case 'input':
            return h(
              'el-form-item',
              {
                style: {
                  display: t.hidden && 'none',
                },
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h('el-input', {
                  attrs: {
                    placeholder: t.placeholder || `请输入${t.label}`,
                    type: t.type || 'text',
                    maxlength: t.maxlength || '',
                    value: this.form[t.key],
                    disabled: t.disabled,
                  },
                  on: {
                    input: (e) => {
                      this.handleInput(e, t.key);
                    },
                  },
                }),
              ],
            );
          case 'select':
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h(
                  'el-select',
                  {
                    attrs: {
                      placeholder: t.placeholder || `请选择${t.label}`,
                      value: this.form[t.key],
                      ...(t.attrs || {}),
                    },
                    on: {
                      input: (e) => {
                        this.handleSelect(e, t.key, t.options);
                      },
                    },
                  },
                  t.options.map((opt) => {
                    return h('el-option', {
                      attrs: {
                        label: opt.label,
                        value: opt.value,
                      },
                    });
                  }),
                ),
              ],
            );
          case 'addressArea':
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h('address-area', {
                  attrs: {
                    value: [],
                  },
                  on: {
                    onChange: (e) => {
                      this.handleAddress(e, t.key);
                    },
                  },
                }),
              ],
            );
          case 'inputNumber':
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h('el-input-number', {
                  attrs: {
                    label: t.placeholder || `请输入${t.label}`,
                    value: this.form[t.key],
                    ...t.attrs,
                  },
                  on: {
                    change: (e) => {
                      this.handleInputNumber(e, t.key);
                    },
                  },
                }),
              ],
            );
          case 'autocomplete':
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h('el-autocomplete', {
                  attrs: {
                    placeholder: t.placeholder || `请输入${t.label}`,
                    'value-key': t.attrs['value-key'],
                    value: this.form[t.key],
                    'fetch-suggestions': (e, cb) => t.attrs['fetch-suggestions'](e, cb),
                  },
                  on: {
                    input: (e) => {
                      this.handleInput(e, t.key);
                    },
                    select: (e) => {
                      this.handleAutocompleteSelect(e, t.key);
                    },
                  },
                }),
              ],
            );
          case 'upload':
            t.fileList = this.form[t.key]
              ? this.form[t.key].split(',').map((t) => {
                  return {
                    url: this._filePrefix(t),
                    originUrl: t,
                  };
                })
              : [];
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [
                h(
                  'el-upload',
                  {
                    attrs: {
                      name: t.attrs.name,
                      accept: 'image/*',
                      'list-type': 'picture-card',
                      limit: t.attrs.limit,
                      headers: { Authorization: this.token },
                      action: this.imgUpUrl + t.attrs.actionType,
                      'file-list': t.fileList,
                      'on-success': (e) => this.uploadSuccessCb(e, t.key, t.fileList),
                      'on-remove': (e) => this.uploadRemoveCb(e, t.key, t.fileList),
                    },
                  },
                  [
                    h('i', {
                      class: ['el-icon-plus'],
                    }),
                  ],
                ),
              ],
            );
          case 'slot':
            return h(
              'el-form-item',
              {
                attrs: {
                  label: t.label,
                  prop: t.rule ? t.key : '',
                },
              },
              [h('div', this.$scopedSlots[t.slotName]({ form: this.form }))],
            );
          default:
            return null;
        }
      }),
    );
  },
  methods: {
    handleInput(e, key) {
      this.$emit('input', Object.assign(this.form, { [key]: e }));
    },
    handleSelect(e, key, options) {
      this.$emit('input', Object.assign(this.form, { [key]: e }));
      this.$emit(
        `${key}Change`,
        options.find((t) => t.value === e),
      );
    },
    handleAddress(e, key) {
      this.$emit('input', Object.assign(this.form, { [key]: e }));
    },
    handleInputNumber(e, key) {
      this.$emit('input', Object.assign(this.form, { [key]: e }));
    },
    handleAutocompleteSelect(e, key) {
      this.$emit(`${key}Change`, e);
    },
    uploadSuccessCb(e, key, fileList) {
      fileList.push({
        url: this._filePrefix(e.data[0]),
        originUrl: e.data[0],
      });
      const urlString = fileList.map((t) => t.originUrl).join(',');
      // this.form[key] = urlString;
      this.$emit('uploadSuccess', Object.assign(this.form, { [key]: urlString }));
    },
    uploadRemoveCb(e, key, fileList) {
      const index = fileList.findIndex((item) => item.url === e.url);
      if (index !== -1) {
        fileList.splice(index, 1);
      }
      const urlString = fileList.map((t) => t.originUrl).join(',');
      // this.form[key] = urlString;
      this.$emit('uploadRemove', Object.assign(this.form, { [key]: urlString }));
    },
    validate(callback) {
      this.$refs.form.validate((valid) => {
        callback(valid);
      });
    },
  },
});
// formList: [
//   {
//     label: '人员姓名',
//     formType: 'input',
//     rule: 1,
//     key: 'realName',
//   },
//   {
//     label: '人员性别',
//     formType: 'select',
//     options: [
//       {
//         label: '男',
//         value: 0,
//       },
//       {
//         label: '女',
//         value: 1,
//       },
//     ],
//     rule: 1,
//     key: 'b',
//   },
//   {
//     label: '手机号码',
//     formType: 'input',
//     type: 'number',
//     rule: 1, // 是否必填
//     ruleSelf: [ // 自定义规则
//       { required: true, message: '请输入电话号码', trigger: 'blur' },
//       { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '手机号码格式有误！', trigger: 'blur' },
//     ],
//     key: 'phoneNumber',
//   },
//   {
//     label: '是否管理',
//     formType: 'select',
//     options: [
//       {
//         label: '是',
//         value: 1,
//       },
//       {
//         label: '否',
//         value: 0,
//       },
//     ],
//     rule: 1,
//     key: 'superFlag',
//   },
// ],
