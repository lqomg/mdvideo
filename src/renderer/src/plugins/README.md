
##  plugins 插件需要满足一下接口

```javascript

const text: IMDPluginOptions = {
  name: 'md-text', // 唯一名称
  defaultCommonStyle: {}, // 默认样式
  defaultProps: { // 自定义属性
    text: '添加文本'
  },
  layer: { // 图层管理中显示
    icon: '', // 图标
    title: 'propsValue.text' | '这是个文本' // 取值 若没有显示原始值
  },
  Props, // 属性编辑器，回的IMDElement元素本身 可以调用     emits('changeElement' , { propsValue: {...}}) 修改值
  Sprite, // 拖拽区域展示的样式，自定蒂尼
  Tools // 自定义工具栏 
};


```