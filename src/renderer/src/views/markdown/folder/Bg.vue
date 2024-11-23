<template>
  <div class="folder-bg">
    <div class="folder-title" @click="changeOpen">
      <div class="icon">
        <i :class="open ? 'icon-caret-bottom iconfont' : 'icon-caret-right iconfont'"></i>
      </div>
      <div class="title">
        <i class="icon-video-camera iconfont"></i>
        <span>背景</span>
      </div>
    </div>
    <div v-show="open" v-load="loading" class="content">
      <ElSpace class="bg-types">
        <ElTag
          v-for="item in bgTypes"
          :key="item.name"
          size="small"
          plain
          style="cursor: pointer"
          :type="bgType === item.name ? 'primary' : 'info'"
          @click="changeType(item.name)"
          >{{ item.label }}</ElTag
        >
      </ElSpace>
      <BgImageList
        v-if="resouceLists[0]?.children?.length"
        :list="resouceLists[0]?.children || []"
        :type="bgType"
        :add-element="addBg"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, toRaw, watch } from 'vue';
import { IGetSources } from '@api/resource';
import { bgTypes } from '../../editor/libs/contanst';
import BgImageList from './BgList.vue';
import { groupBy } from 'lodash';
const loading = ref(false);
const open = ref(false);
const bgType = ref('bgs');
const resouceLists = ref<{ className: string; children: any[] }[]>([]);

const changeOpen = async () => {
  open.value = !open.value;
  const list = await getBgResouces();
  getResouceList(list);
};
const changeType = async (name: string) => {
  bgType.value = name;
  const list = await getBgResouces();
  getResouceList(list);
};
const localValues = {};
const addBg = (item: any) => [console.log(item)];
const getResouceList = (data: any = {}) => {
  if (localValues[bgType.value]) {
    resouceLists.value = localValues[bgType.value];
    return;
  }
  if (bgType.value === 'bgs') {
    resouceLists.value = [
      {
        className: '',
        children: data
      }
    ];
  } else {
    const groups = groupBy(data, 'className');
    resouceLists.value = Object.keys(groups).map((key) => {
      return {
        className: key,
        children: groups[key]
      };
    });
  }
  localValues[bgType.value] = toRaw(resouceLists.value);
};
const getBgResouces = async () => {
  loading.value = true;
  const { data } = await window.invoke<IGetSources['req'], IGetSources['res']>('getSources', {
    payload: {
      vertical: undefined,
      keyword: '',
      type: bgType.value
    }
  });
  loading.value = false;
  return data.data;
};
</script>
<style lang="scss" scoped>
.folder-bg {
  margin: 10px 6px;
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
    height: 500px;
  }
}
</style>
