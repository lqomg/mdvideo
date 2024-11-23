<template>
  <ElCollapse v-model="activeName" class="animate-in-out">
    <ElCollapseItem name="in">
      <template #title>
        <span class="custom-tabs-label">
          <span>入场动画</span>
          <span class="animate-title">[{{ animateDataMap[animateInState.type] }}]</span>
        </span>
      </template>
      <el-scrollbar class="animate-choose-item">
        <div
          v-for="animate in animateInCssData"
          :key="animate.value"
          :class="[
              (animate as any).unclick ? 'animate-choose-item-inner unclick' : 'animate-choose-item-inner',
              animateInState.type == animate.value ?'active': '' ] "
          @mouseover="hoverPreviewAnimateIn.type = animate.value"
          @click="handleChooseAnimate('in', animate.value)"
        >
          <span
            class="animate-choose-image"
            :class="[
              'animate__animated animate__' +
                (hoverPreviewAnimateIn.type === animate.value && animate.value)
            ]"
            :style="{
              '--animate-duration': hoverPreviewAnimateIn.time + 's',
              '--animate-delay': hoverPreviewAnimateIn.delay + 's'
            }"
          ></span>
          <p>{{ animate.label }}</p>
        </div>
      </el-scrollbar>
      <div>
        <label>动画速度</label>
        <ElRadioGroup
          v-model="animateInState.time"
          @change="(v) => handleSelectAnimateTime('in', v as number)"
        >
          <ElRadio v-for="item in AnimateSpeed" :key="item.value" :label="item.value">{{
            item.label
          }}</ElRadio>
        </ElRadioGroup>
      </div>
    </ElCollapseItem>

    <ElCollapseItem name="out">
      <template #title>
        <span class="custom-tabs-label">
          <span>出场动画</span>
          <span class="animate-title">[{{ animateDataMap[animateOutState.type] }}]</span>
        </span>
      </template>
      <el-scrollbar class="animate-choose-item">
        <div
          v-for="animate in animateOutCssData"
          :key="animate.value"
          :class="[
              (animate as any).unclick ? 'animate-choose-item-inner unclick' : 'animate-choose-item-inner',
              animateOutState.type == animate.value ?'active': '' ] "
          @mouseover="hoverPreviewAnimateOut.type = animate.value"
          @click="handleChooseAnimate('out', animate.value)"
        >
          <span
            class="animate-choose-image"
            :class="[
              'animate__animated animate__' +
                (hoverPreviewAnimateOut.type === animate.value && animate.value)
            ]"
            :style="{
              '--animate-duration': hoverPreviewAnimateOut.time + 's',
              '--animate-delay': hoverPreviewAnimateOut.delay + 's'
            }"
          ></span>
          <p>{{ animate.label }}</p>
        </div>
      </el-scrollbar>
      <div>
        <label>动画速度</label>
        <ElRadioGroup
          v-model="animateOutState.time"
          @change="(v) => handleSelectAnimateTime('out', v as number)"
        >
          <ElRadio v-for="item in AnimateSpeed" :key="item.value" :label="item.value">{{
            item.label
          }}</ElRadio>
        </ElRadioGroup>
      </div>
    </ElCollapseItem>
  </ElCollapse>
</template>
<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { AnimateSpeed } from './constant';
import {
  animateDataMap,
  animateInCssData,
  animateOutCssData
} from '@renderer/config/animateCssData';
const hoverPreviewAnimateIn = reactive({
  type: '',
  time: 0.5,
  delay: 0
});
const hoverPreviewAnimateOut = reactive({
  type: '',
  time: 0.5,
  delay: 0
});
const activeName = ref('');
const editStore = useEditorStore();
const { activeElementUUID } = storeToRefs(editStore);
const handleChooseAnimate = (type: string, value: string) => {
  const ele = editStore.getElementByUUID(activeElementUUID.value);
  if (ele) {
    ele.animations[type].type = value;
  }
};
const handleSelectAnimateTime = (type: string, value: number) => {
  const ele = editStore.getElementByUUID(activeElementUUID.value);
  if (type === 'in') {
    hoverPreviewAnimateIn.time = value;
  } else {
    hoverPreviewAnimateOut.time = value;
  }
  if (ele) {
    ele.animations[type].time = value;
  }
};
const animateInState = reactive({
  type: 'fadeIn',
  time: 0.5,
  delay: 0
});
const animateOutState = reactive({
  type: 'fadeOut',
  time: 0.5,
  delay: 0
});

watch(
  () => editStore.getActiveElement()?.animations,
  () => {
    const ele = editStore.getActiveElement();
    if (ele) {
      const { animations } = ele;
      animateInState.type = animations.in.type;
      animateInState.time = animations.in.time;
      animateOutState.type = animations.out.type;
      animateOutState.time = animations.out.time;
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.animate-in-out {
  :deep(.el-scrollbar__view) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .animate-title {
    padding-left: 10px;
    font-size: smaller;
    font-weight: bold;
  }
  .animate-choose-item {
    height: 240px;

    .animate-choose-item-inner {
      display: inline-block;
      width: 78px;
      height: 64px;
      color: rgb(21, 147, 255);
      text-align: center;
      cursor: pointer;
      border-radius: 2px;
      position: relative;
      margin-bottom: 10px;
      &.active {
        border: 1px solid var(--el-color-primary);
        &::after {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          position: absolute;
          left: 0;
          top: 0;
          background-color: var(--el-color-primary);
        }
      }
      & > .animate-choose-image {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-image: url('./images/use-beb469.png');
        background-position: 0 -480px;
      }
      p {
        font-size: 12px;
        line-height: 0.6;
        margin: 0;
      }
    }
  }
  .animate-choose-item .unclick {
    // border: #666 solid 1px;
    border-radius: 20%;
    color: rgb(147, 142, 142);
    & > .animate-choose-image {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-image: url('./images/use-beb469.png');
      background-position: 0 0;
    }
  }
  :deep(.el-radio__label) {
    width: 40px;
  }
}
</style>
