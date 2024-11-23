<template>
  <MarkDownEditor
    v-model="text"
    style="height: 100%"
    :preview="true"
    :completions="completions"
    @on-upload-img="onUploadImg"
    @change="(v) => emits('onChange', v)"
  ></MarkDownEditor>
</template>

<script setup lang="ts">
import { onBeforeMount, defineProps, ref, watch, onMounted } from 'vue';
import { MdEditor as MarkDownEditor, config } from '@renderer/components/Markdown';
import { CompletionSource } from '@codemirror/autocomplete';
import MarkdownItAttrs from 'markdown-it-attrs';
import { uploadImage } from '@renderer/api/upload';
import { IUploadImageType } from '@api/resource';
import { getComletions } from './utils';

// import mermaidPath from '@resources/lib/mermaid.min.js?url';
// import screenfullPath from '@resources/lib/screenfull.min.js?url';
// import hightlightPath from '@resources/lib/highlight.min.js?url';
// import katexPath from '@resources/lib/katex.min.js?url';
// import katexCssPath from '@resources/lib/katex.min.css?url';
// import cropPath from '@resources/lib/cropper.min.js?url';
// import cropCssPath from '@resources/lib/cropper.min.css?url';
// import standaloneJs from '@resources/lib/standalone.js?url';
// import parserMarkdownJs from '@resources/lib/parser-markdown.js?url';
onBeforeMount(() => {
  config({
    markdownItConfig(mdit) {
      mdit.use(MarkdownItAttrs, {
        leftDelimiter: '{',
        rightDelimiter: '}'
      });
    }
    // editorExtensions: {
    //   mermaid: {
    //     js: mermaidPath
    //   },
    //   screenfull: {
    //     js: screenfullPath
    //   },
    //   highlight: {
    //     js: hightlightPath
    //   },
    //   katex: {
    //     js: katexPath,
    //     css: katexCssPath
    //   },
    //   cropper: {
    //     js: cropPath,
    //     css: cropCssPath
    //   },
    //   prettier: {
    //     standaloneJs: standaloneJs,
    //     parserMarkdownJs: parserMarkdownJs
    //   }
    // }
  });
});
const completions = ref<Array<CompletionSource>>([]);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['onChange']);
const text = ref(props.modelValue);
onMounted(() => {
  getComletions().then((list) => {
    completions.value = list;
  });
});
watch(
  () => props.modelValue,
  (v) => {
    text.value = v;
  }
);

const onUploadImg = async (files: any[], callback: any) => {
  const rawFile = files[0];
  if (rawFile?.localPath) {
    // 本地文件
    callback([rawFile?.localPath.replace(/\\/gi, '/')]);
  } else {
    try {
      const data = await uploadImage(rawFile as any, IUploadImageType.Markdwon);
      if (data && data.path) {
        callback([data.path.replace(/\\/gi, '/')?.replace?.(/\s/g, '%20')]);
      }
    } catch (error) {
      console.error(error);
      callback([]);
    }
  }
};
</script>
