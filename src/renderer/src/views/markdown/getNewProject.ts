import { useEditorStore } from "@renderer/store";
import { MarkdownProps } from "./core/MarkdownManager";
import { toRaw } from "vue";
import { getScenes } from "../editor/control/utils";
import { IMDProjectInfo } from "@api/types";

export const getNewProjectByMarkdown = async (props: {
  markdownScenes: MarkdownProps[],
  markdownDoc: string
  projectInfo: IMDProjectInfo
}) => {
  const { markdownScenes, markdownDoc, projectInfo } = props;
  const editorStore = useEditorStore();
  const scenes = markdownScenes.map((m) => m.scene);
  editorStore.createNewProject();
  editorStore.projectScenes = scenes;
  editorStore.projectInfo.width = projectInfo.width;
  editorStore.projectInfo.height = projectInfo.height;
  editorStore.activeSceneUUID = editorStore.projectScenes[0]?.uuid;
  editorStore.isMarkdownSource = true;
  editorStore.markdown = {
    doc: markdownDoc,
    scenes: toRaw(markdownScenes)
  };
  const nScenes = await getScenes(toRaw(editorStore.projectScenes));
  const payload = {
    _id: '',
    isSave: false,
    isMarkdownSource: true,
    markdown: {
      doc: markdownDoc,
      scenes: markdownScenes
    },
    projectInfo: toRaw(editorStore.projectInfo),
    scenes: nScenes
  };
  return payload;
};
