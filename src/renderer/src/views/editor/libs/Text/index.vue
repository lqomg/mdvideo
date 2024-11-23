<template>
  <div class="text-lib">
    <div class="lib subtitle" @click="editorStore.addElement('md-subtitle')">
      <i class="iconfont icon-05xiabiao"></i>
      <span>添加AI字幕</span>
    </div>

    <div
      class="lib"
      @click="
        editorStore.addElement(
          'md-text',
          {
            fontSize: projectInfo.width / 30,
            height: (projectInfo.width / 30) * 2
          },
          { text: '添加正文' }
        )
      "
    >
      添加正文
    </div>
    <div
      class="lib hh1"
      @click="
        editorStore.addElement(
          'md-text',
          {
            fontSize: projectInfo.width / 15,
            height: (projectInfo.width / 15) * 2,
            fontWeight: 'bold'
          },
          { text: '添加标题' }
        )
      "
    >
      添加标题
    </div>
    <Material
      class="material-wrap"
      :directory="path"
      :default-display-type="'appstore'"
      @change-directory="(v) => (path = v)"
    />
    <div class="libs">
      <div class="label">艺 术 字</div>
      <div class="font-list">
        <div
          v-for="(item, index) in FontFamilyList"
          :key="index"
          class="item"
          :style="{
            backgroundColor: item.style.backgroundColor
          }"
          @click="
            editorStore.addElement('md-text', { ...item.commonStyle }, { text: '右侧可编辑字体哦' })
          "
        >
          <span
            :style="{
              ...item.style,
              ...(item.style.fillObj || {}),
              filter: item.style.filter,
              // textIndent: item.style.letterSpacing,
              letterSpacing: item.style.letterSpacing,
              textShadow: item.style.textShadow,
              whiteSpace: 'pre',
              fontSize: 26 + 'px',
              backgroundColor: undefined,
              padding: '4px',
              paddingTop: '4px'
            }"
          >
            {{ item.value?.slice(0, 3) }}
          </span>
        </div>
      </div>
    </div>
    <div class="shapes">
      <div class="label">形状</div>
      <div class="shape-list">
        <div
          v-for="(item, index) in Shapes"
          :key="index"
          :style="item.style"
          class="item"
          :title="item.name"
          @click="editorStore.addElement(item.elName, { ...item.commonStyle })"
        >
          <!-- {{ item.name }} -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEditorStore, useAppConfigStore } from '@renderer/store';
import { getFontantList, Shapes } from './constant';
import { getCommonStyle } from '@renderer/config/DataModel';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
const editorStore = useEditorStore();
const { projectInfo } = storeToRefs(editorStore);
import Material from '@renderer/components/Material/index.vue';
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const path = ref(resourcePath?.value + '/字体');
const FontFamilyList = computed(() => {
  return getFontantList(projectInfo.value.width, projectInfo.value.height).map((v) => {
    v.style = getCommonStyle(v.commonStyle);
    return v;
  });
});
</script>
<style lang="scss" scoped>
.text-lib {
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
  .lib {
    margin-top: 10px;
    width: 100%;
    background-color: var(--el-bg-color-page);
    text-align: center;
    padding: 6px 0;
    letter-spacing: 2px;
    cursor: pointer;
    &.subtitle {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
      .iconfont {
        font-size: 20px;
      }
    }
    &.hh1 {
      font-size: 26px;
      font-weight: 600;
    }
    &.hh4 {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .shapes {
    margin-top: 20px;
    .label {
      color: var(--el-text-color-secondary);
      margin: 8px 0;
    }
    .shape-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-around;
      .item {
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
  .material-wrap {
    border-top: var(--el-border);
    height: calc(100% - 530px);
    min-height: 400px;
    margin-top: 12px;
  }
  .libs {
    border-top: var(--el-border);
    margin-top: 20px;
    .label {
      color: var(--el-text-color-secondary);
      margin: 8px 0;
    }
    .font-list {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .item {
        border: var(--el-border);
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
