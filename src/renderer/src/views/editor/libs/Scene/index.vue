<template>
  <div class="lib-scene">
    <div class="lib-scene-header">
      <ElButton :icon="FolderAdd" type="primary" @click="editorStore.addScene()">新建场景</ElButton>
      &nbsp;
      <ElButton type="info" link
        >第 {{ editorStore.getCurrentSceneIndex() + 1 }}/{{ projectScenes.length }} 场景</ElButton
      >
    </div>
    <ElScrollbar class="lib-scene-list">
      <div
        v-for="(scene, index) in projectScenes"
        :key="scene.uuid"
        class="lib-scene-item"
        @click="changeActiveScene(scene.uuid)"
      >
        <div
          class="lib-scene-mask"
          :style="{ ...getCommonStyle(scene.commonStyle as any) }"
          :class="{ active: activeSceneUUID === scene.uuid }"
        >
          <div class="header">
            <span class="label" type="primary">
              <span>场景{{ index + 1 }} &nbsp;</span>
              <span>时长:{{ scene.data.duration }}s</span>
            </span>
            <span class="operations">
              <ElPopconfirm
                :disabled="projectScenes.length <= 1"
                title="确定删除该场景吗?"
                @confirm="editorStore.deleteSceneByUUID(scene.uuid)"
              >
                <template #reference>
                  <i class="iconfont icon-delete" @click.stop="() => {}"></i>
                </template>
              </ElPopconfirm>
            </span>
          </div>
          <div class="title">场 景 {{ index + 1 }}</div>
        </div>
        <div class="btn">
          <ElPopover :disabled="getTransName(scene.uuid) === 'none'" placement="right">
            <ElImage
              v-if="getTransName(scene.uuid) !== 'none'"
              :src="TransitionsImageSrcMap[getTransName(scene.uuid)]"
              style="width: 100%; height: 80px"
            ></ElImage>
            <template #reference>
              <ElButton size="small" :icon="Switch">{{
                getTransitionLabel(getTransName(scene.uuid))
              }}</ElButton>
            </template>
          </ElPopover>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>
<script lang="ts" setup>
import { FolderAdd, Switch } from '@element-plus/icons-vue';
import { getCommonStyle, getTransitionLabel } from '@renderer/config/DataModel';
import { useEditorStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { TransitionsImageSrcMap } from '../../attr/scene/constanst';

const editorStore = useEditorStore();
const { projectScenes, activeElementUUID, activeSceneUUID } = storeToRefs(editorStore);

const changeActiveScene = (uuid: string) => {
  activeSceneUUID.value = uuid;
  activeElementUUID.value = '';
};
const getTransName = (id: string) => editorStore.getSceneByUUID(id).data.transName;
</script>

<style lang="scss" scoped>
.lib-scene {
  height: 100%;
  .lib-scene-header {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid;
    border-color: var(--el-border-color);
    padding: 10px 0;
  }
  .lib-scene-list {
    display: flex;
    flex-direction: column;
    height: calc(100% - 50px);
    .lib-scene-item {
      margin: 10px auto;
      cursor: pointer;
      .lib-scene-mask {
        border-radius: 4px;
        width: 248px;
        height: 136px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: large;
        box-shadow: var(--el-box-shadow-lighter);
        background-color: var(--el-mask-color);
        color: var(--el-text-color-regular);
        margin: 0 auto;
        position: relative;
        .header {
          top: 0;
          position: absolute;
          left: -1px;
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          .label {
            padding: 2px;
            color: var(--el-color-white);
            background-color: var(--el-color-primary);
            font-size: 10px;
            letter-spacing: 2px;
            border-top-left-radius: 4px;
          }
        }
        .title {
          color: #fff;
          text-shadow: 1px 1px 1px var(--el-color-primary);
        }
        .operations {
          display: none;
        }
        &:hover {
          .operations {
            display: flex;
            i {
              cursor: pointer;
              color: var(--el-color-danger);
              padding-right: 2px;
            }
          }
        }
        &.active {
          border: 1px solid;
          border-color: var(--el-color-primary);
        }
      }
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
