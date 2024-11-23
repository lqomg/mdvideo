<template>
  <div class="animate-set">
    <Move />
    <ElDivider />
    <InOut />
  </div>
</template>
<script setup lang="ts">
import InOut from './InOut.vue';
import Move from './Move.vue';
</script>
<style lang="scss" scoped>
.animate-set {
  display: flex;
  flex-direction: column;
}
</style>
