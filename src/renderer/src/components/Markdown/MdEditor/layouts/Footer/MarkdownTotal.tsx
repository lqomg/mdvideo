import { defineComponent, inject, ComputedRef, PropType } from 'vue';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';
import { StaticTextDefaultValue } from '@renderer/components/Markdown/MdEditor/type';

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const ult = inject('usedLanguageText') as ComputedRef<StaticTextDefaultValue>;

    return () => (
      <div class={`${prefix}-footer-item`}>
        <label
          class={`${prefix}-footer-label`}
        >{`${ult.value.footer?.markdownTotal}:`}</label>
        <span>{props.modelValue?.length || 0}</span>
      </div>
    );
  }
});
