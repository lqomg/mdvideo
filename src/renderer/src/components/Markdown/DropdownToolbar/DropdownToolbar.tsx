import { defineComponent, PropType, inject, SetupContext, ExtractPropTypes } from 'vue';
import { LooseRequired } from '@vue/shared';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';
import { getSlot } from '@renderer/components/Markdown/MdEditor/utils/vue-tsx';
import Dropdown from '@renderer/components/Markdown/MdEditor/components/Dropdown';

const props = {
  title: {
    type: String as PropType<string>,
    default: ''
  },
  visible: {
    type: Boolean as PropType<boolean>
  },
  // 展示在工具栏的内容，通常是个图标
  trigger: {
    type: [String, Object] as PropType<string | JSX.Element>
  },
  onChange: {
    type: Function as PropType<(visible: boolean) => void>
  },
  // 下拉框中的内容
  overlay: {
    type: [String, Object] as PropType<string | JSX.Element>
  }
};

type DropdownToolbarProps = Readonly<
  LooseRequired<Readonly<ExtractPropTypes<typeof props>>>
>;

export default defineComponent({
  name: 'DropdownToolbar',
  props,
  emits: ['onChange'],
  setup(props: DropdownToolbarProps, ctx: SetupContext<Array<'onChange'>>) {
    const editorId = inject('editorId');

    return () => {
      const Trigger = getSlot({ props, ctx }, 'trigger');
      const Overlay = getSlot({ props, ctx }, 'overlay');

      return (
        <Dropdown
          relative={`#${editorId}-toolbar-wrapper`}
          visible={props.visible}
          onChange={(v) => {
            if (props.onChange instanceof Function) {
              props.onChange(v);
            } else {
              ctx.emit('onChange', v);
            }
          }}
          overlay={Overlay}
        >
          <div class={`${prefix}-toolbar-item`} title={props.title || ''}>
            {Trigger}
          </div>
        </Dropdown>
      );
    };
  }
});
