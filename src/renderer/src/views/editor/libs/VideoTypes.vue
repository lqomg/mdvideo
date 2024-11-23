<template>
  <ElSpace class="v-types" :size="20">
    <ElText
      size="small"
      :type="props.vertical ? 'primary' : 'info'"
      @click="emit('update:vertical', true)"
      >竖 版</ElText
    >
    <ElText
      size="small"
      :type="!props.vertical ? 'primary' : 'info'"
      @click="emit('update:vertical', false)"
      >横 版</ElText
    >
  </ElSpace>
</template>

<script setup lang="ts">
const props = defineProps(['vertical']);
const emit = defineEmits(['update:vertical']);
</script>
<style lang="scss" scoped>
.v-types {
  :deep(.el-text) {
    cursor: pointer;
  }
}
</style>
