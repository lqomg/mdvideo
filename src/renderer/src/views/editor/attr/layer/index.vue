<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="layer-manager">
    <div
      v-for="item in elements"
      :key="item.uuid"
      class="layer"
      @click="editorStore.activeElementUUID = item.uuid"
    >
      <div
        v-if="
          item.elName === 'md-text' ||
          item.elName === 'md-subtitle' ||
          item.elName === 'md-video' ||
          item.elName === 'md-audio' ||
          item.elName === 'md-circle' ||
          item.elName === 'md-round-rect'
        "
        class="layer-props"
      >
        <span class="layer-icon">
          <i :class="['iconfont', pluginManager.getLayer(item.elName).icon]"></i>
        </span>
        <span class="title">{{
          item.propsValue.text ||
          pluginManager.getLayer(item.elName).title + ': ' + item.uuid ||
          '未知元素'
        }}</span>
      </div>
      <div v-else-if="item.elName === 'md-lottie'" class="layer-props">
        <span class="layer-icon">
          <ElImage
            :src="
              getLottieImage(item.propsValue.lottie?.id, item.propsValue.lottie?.actions?.[0]?.id)
            "
            style="width: 26px; height: 26px"
          />
        </span>
        <span class="title"
          >{{ item.propsValue.lottie?.title }}-{{
            item.propsValue.lottie?.actions?.[0]?.title
          }}</span
        >
      </div>
      <div v-else-if="item.elName === 'md-image'" class="layer-props">
        <span class="layer-icon">
          <ElImage :src="item.propsValue.src" style="width: 26px; height: 26px" />
        </span>
        <span class="title">{{ pluginManager.getLayer(item.elName).title || '未知元素' }}</span>
      </div>
      <div v-else-if="item.elName === 'md-chart'" class="layer-props">
        <span class="layer-icon">
          <i :class="['iconfont', getChartLayer(item)?.icon]"></i>
        </span>
        <span class="title">{{ getChartLayer(item)?.label || '图表' }}</span>
      </div>

      <div class="layer-operation">
        <ElIcon :size="20" title="删除" @click="editorStore.deleteElementByUUID(item.uuid)">
          <Delete />
        </ElIcon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from '@renderer/store';
import { Delete } from '@element-plus/icons-vue';
import { pluginManager } from '@renderer/plugins';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useAddChart } from '../../libs/Tools/useAddChart';
import { IMDElement } from '@api/types';
import { getLottieImage } from '../../libs/Lottie/utils';
const editorStore = useEditorStore();
const { activeSceneUUID } = storeToRefs(editorStore);
const elements = computed(() => {
  const scene = editorStore.getSceneByUUID(activeSceneUUID.value);
  return scene.elements;
});
const chartList = useAddChart();
const getChartLayer = (item: IMDElement) =>
  chartList.find((chart) => chart.name === item?.propsValue?.chartType);
</script>

<style lang="scss" scoped>
.layer-manager {
  .layer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    .layer-props {
      display: flex;
      align-items: center;
      width: 200px;
      overflow: hidden;
      cursor: pointer;
      .layer-icon {
        display: flex;
        background-color: var(--el-bg-color-page);
        border-radius: 2px;
        padding: 2px;
        width: 39px;
        height: 36px;
        align-items: center;
        line-height: 26px;
        text-align: center;
        justify-content: center;
        i {
          color: var(--el-color-primary);
          font-size: 22px;
        }
      }
      .title {
        display: inline-block;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        margin-left: 10px;
        color: var(--el-text-color-regular);
        white-space: pre;
      }
    }
    .layer-operation {
      cursor: pointer;
    }
  }
}
</style>
