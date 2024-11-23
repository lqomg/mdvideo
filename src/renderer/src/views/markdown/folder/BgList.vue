<template>
  <div class="search-lib">
    <VirtualScroll class="lib-list" :list="bgList" :height="80">
      <template #default="{ item }">
        <div class="image-list">
          <ElImage
            v-for="(itemK, key) in item"
            :key="key"
            :src="itemK.cover || itemK.filePath"
            :style="{ width: '90px', height: 60 + 'px' }"
            fit="cover"
            @click="props.addElement(itemK)"
          />
        </div>
      </template>
    </VirtualScroll>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { VirtualScroll } from 'vue3-virtual-scroll';
import 'vue3-virtual-scroll/dist/style.css';
const props = defineProps<{ type: string; list: any[]; addElement: (item: any) => void }>();
const bgList = computed(() => {
  const list: any[] = [];
  let t: any[] = [];
  props.list.forEach((item, i) => {
    const j = i + 1;
    t.push(item);
    if (j % 3 === 0) {
      list.push(t);
      t = [];
    }
  });
  return list;
});
</script>
<style lang="scss" scoped>
.search-lib {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color);
  .image-list {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin: 10px 0;
  }
  :deep(.scroll-container__list) {
    list-style: none;
    padding-inline-start: 0;
  }
  .list {
    margin-top: 10px;
    :deep(.el-scrollbar__view) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
    // .item {
    //   flex: 1;
    //   margin: 10px 6px;
    //   // box-shadow: var(--el-box-shadow);
    // }
  }
}
</style>
