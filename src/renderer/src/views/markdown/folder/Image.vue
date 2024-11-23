<template>
  <div class="folder-bg">
    <div class="folder-title" @click="changeOpen">
      <div class="icon">
        <i :class="open ? 'icon-caret-bottom iconfont' : 'icon-caret-right iconfont'"></i>
      </div>
      <div class="title">
        <i class="icon-video-camera iconfont"></i>
        <span>图片</span>
      </div>
    </div>
    <div v-show="open" v-load="loading" class="content">
      <ElCollapse accordion style="height: 100%; overflow: hidden">
        <ElCollapseItem v-for="item in resouceLists" :key="item.className">
          <template #title>
            {{ item.className }}
          </template>
          <div style="height: 420px">
            <BgImageList
              v-if="item?.children?.length"
              :list="item?.children || []"
              :type="'images'"
              :add-element="addBg"
            />
          </div>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, toRaw, watch } from 'vue';
import { IGetSources } from '@api/resource';
import BgImageList from './BgList.vue';
import { groupBy } from 'lodash';
import { ElCollapse, ElCollapseItem } from 'element-plus';
const loading = ref(false);
const open = ref(false);
const resouceLists = ref<{ className: string; children: any[] }[]>([]);

const changeOpen = async () => {
  open.value = !open.value;
  const list = await getImageResource();
  getResouceList(list);
};

const addBg = (item: any) => [console.log(item)];
const getResouceList = (data: any = {}) => {
  const groups = groupBy(data, 'className');
  resouceLists.value = Object.keys(groups).map((key) => {
    return {
      className: key,
      children: groups[key]
    };
  });
  console.log(resouceLists.value);
};
const getImageResource = async () => {
  loading.value = true;
  const { data } = await window.invoke<IGetSources['req'], IGetSources['res']>('getSources', {
    payload: {
      vertical: undefined,
      keyword: '',
      type: 'images'
    }
  });
  loading.value = false;
  return data.data;
};
</script>
<style lang="scss" scoped>
.folder-bg {
  margin: 10px 6px;
  height: 100%;
  .folder-title {
    display: flex;
    align-items: center;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    cursor: pointer;
    .title {
      display: flex;
      align-items: center;
      margin-left: 6px;
      font-size: 16px;
      i {
        margin-right: 4px;
      }
    }
  }
  .content {
    margin-left: 12px;
    margin-top: 12px;
    height: calc(100% - 200px);
    overflow: hidden;
  }
}
</style>
