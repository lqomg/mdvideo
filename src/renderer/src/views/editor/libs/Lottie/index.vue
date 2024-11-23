<template>
  <div v-loading="loading" class="lottie-lib">
    <div v-if="commonStore.resourceBasePath" class="lib-list">
      <div v-for="(item, className) in lottieResource" :key="item.categoryName">
        <div class="title">
          <label>{{ item.categoryName }}</label>
        </div>
        <div class="list">
          <div v-for="action in item.children?.slice(0, 12)" :key="action.id" class="action">
            <ElImage
              :src="getLottieImage(action.id, action.actions?.[0]?.id)"
              :style="{ width: '50px', height: '50px' }"
              @click="
                editorStore.addElement(
                  'md-lottie',
                  {},
                  {
                    path: getLottiePath(action.id, action.actions?.[0]?.id),
                    lottie: action
                  }
                )
              "
            >
              {{ action.title }}
            </ElImage>
          </div>
        </div>
      </div>
    </div>
    <EmptySource v-else></EmptySource>
  </div>
</template>
<script lang="ts" setup name="liblottie">
import { IGetLottie } from '@api/lottie';
import { useCommonStore, useEditorStore } from '@renderer/store';
import { onMounted, ref, watch } from 'vue';
import { getLottiePath, getLottieImage } from './utils';
import axiosService from '@renderer/service/axiosService';
import EmptySource from '../EmptySource.vue';
const editorStore = useEditorStore();
const lottieResource = ref<any>({});
const commonStore = useCommonStore();
const loading = ref(false);
onMounted(async () => {
  const list = await getLottie();
  lottieResource.value = list;
});

const getLottie = async () => {
  loading.value = true;
  const json = await axiosService.get('/public/lottie/lottie.json');
  const { data } = await window.invoke<IGetLottie['req'], IGetLottie['res']>('getLottie', {
    payload: { json: json }
  });
  loading.value = false;
  if (data.basePath) {
    commonStore.resourceBasePath = data.basePath;
  } else {
    commonStore.resourceBasePath = '';
  }
  return data.list;
};
</script>
<style lang="scss" scoped>
.lottie-lib {
  position: relative;
  height: 100%;
  .bg-types {
    padding: 10px;
  }
  .v-types {
    padding: 10px;
  }
  .lib-list {
    margin-bottom: 10px;
    height: calc(100% - 10px);
    overflow-y: auto;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--el-text-color-secondary);
      border-bottom: var(--el-border);
      cursor: pointer;
      font-size: small;
      padding: 10px;
    }
    .list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      .action {
        margin: 4px;
        padding: 6px;
        background-color: var(--el-bg-color-page);
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
