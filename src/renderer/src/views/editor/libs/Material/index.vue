<template>
  <Material
    class="material-lib"
    :directory="path"
    :default-display-type="'partition'"
    @change-directory="(v) => (path = v)"
  />
</template>

<script setup lang="ts">
import Material from '@renderer/components/Material/index.vue';
import { useAppConfigStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const path = ref(resourcePath?.value);
</script>
<style lang="scss" scoped>
.material-lib {
  height: 100%;
}
</style>
