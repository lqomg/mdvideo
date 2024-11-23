import { App } from 'vue';

import Editor from './Editor';
import NormalToolbar from '@renderer/components/Markdown/NormalToolbar';
import DropdownToolbar from '@renderer/components/Markdown/DropdownToolbar';
import MdCatalog from '@renderer/components/Markdown/MdCatalog';
import ModalToolbar from '@renderer/components/Markdown/ModalToolbar';
import MdPreview from '@renderer/components/Markdown/MdPreview';
import './styles/style.less';

Editor.install = (app: App) => {
  app.component(Editor.name, Editor);

  app.use(NormalToolbar).use(DropdownToolbar).use(ModalToolbar).use(MdCatalog).use(MdPreview);

  return app;
};

export default Editor as typeof Editor & {
  install: (app: App) => App;
};
