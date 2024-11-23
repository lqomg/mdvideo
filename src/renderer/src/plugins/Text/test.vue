<template>
  <div ref="textRef" class="text"></div>
</template>
<script setup lang="ts">
import { PluginProps } from '@renderer/types';
import { ref, watch, onMounted } from 'vue';

const textRef = ref<HTMLElement>();
const PIXI = window.PIXI;
const utils = PIXI.utils;

const props = defineProps<PluginProps>();
const appPixi = ref(new PIXI.Application({}));
onMounted(() => {
  textRef.value?.appendChild(appPixi.value.view);
});
watch(
  props,
  (v) => {
    const app = appPixi.value;
    if (!app) return;
    app.stage.removeChildren();
    const scale = props.scale || 1;
    const commonStyle = props.commonStyle;
    const {
      backgroundColor = 0x000000,
      fontSize,
      fontStyle,
      fontFamily,
      fontWeight,
      textAlign,
      color
    } = commonStyle;
    const width = commonStyle.width * scale,
      height = commonStyle.height * scale;
    app.renderer.transparent = true;
    app.renderer.background.color = backgroundColor
      ? utils.string2hex(backgroundColor)
      : utils.string2hex('#ffffff');
    app.renderer.resize(width, height);
    const style = new PIXI.TextStyle({
      fontFamily,
      fontWeight,
      fontStyle,
      fontSize: fontSize * scale,
      fill: utils.string2hex(color)
    });
    const text = new PIXI.Text(props.propsValue.text, style);
    text.y = app.renderer.height / 2 - text.height / 2;
    if (textAlign === 'center') {
      text.x = app.renderer.width / 2 - text.width / 2;
    } else if (textAlign === 'right') {
      text.x = app.renderer.width - text.width;
    } else {
      text.x = 0;
    }

    app.stage.addChild(text);
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.text {
  padding: 1px;
}
</style>
