import { defineComponent } from 'vue';
import { prefix } from '@renderer/components/Markdown/MdEditor/config';

export default defineComponent({
  setup() {
    return () => <div class={`${prefix}-divider`}></div>;
  }
});
