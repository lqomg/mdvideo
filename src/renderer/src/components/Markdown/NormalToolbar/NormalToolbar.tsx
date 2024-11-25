import { defineComponent, PropType, SetupContext, ExtractPropTypes } from 'vue';
import { LooseRequired } from '@vue/shared';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';
import { getSlot } from '@renderer/components/Markdown/MdEditor/utils/vue-tsx';

const props = {
  title: {
    type: String as PropType<string>,
    default: ''
  },
  // 展示在工具栏的内容，通常是个图标
  trigger: {
    type: [String, Object] as PropType<string | JSX.Element>
  },
  onClick: {
    type: Function as PropType<(e: MouseEvent) => void>
  }
};

type NormalToolbarProps = Readonly<
  LooseRequired<Readonly<ExtractPropTypes<typeof props>>>
>;

export default defineComponent({
  name: 'NormalToolbar',
  props,
  emits: ['onClick'],
  setup(props: NormalToolbarProps, ctx: SetupContext<Array<'onClick'>>) {
    return () => {
      const Trigger = getSlot({ props, ctx }, 'trigger');

      return (
        <div
          class={`${prefix}-toolbar-item`}
          title={props.title}
          onClick={(e) => {
            if (props.onClick instanceof Function) {
              props.onClick(e);
            } else {
              ctx.emit('onClick', e);
            }
          }}
        >
          {Trigger}
        </div>
      );
    };
  }
});
