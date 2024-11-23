import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/:pathMatch(.*)*', component: () => import('@renderer/views/404.vue') },
  {
    path: '/',
    name: 'layout',
    component: () => import('@renderer/views/Layout.vue'),
    redirect: { name: 'pageList' },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@renderer/views/home/index.vue'),
        children: [
          {
            path: 'page-list',
            name: 'pageList',
            meta: {
              label: '我的作品'
            },
            component: () => import('@renderer/views/home/pageList/index.vue')
          },
          {
            path: 'template',
            name: 'template',
            meta: {
              label: '模板市场'
            },
            component: () => import('@renderer/views/home/template/index.vue')
          },
          {
            path: 'setting',
            name: 'setting',
            meta: {
              label: '设置'
            },
            component: () => import('@renderer/views/setting/index.vue')
          }
        ]
      },
      {
        path: 'editor/:id',
        name: 'editor',
        meta: {
          label: '工作台'
        },
        component: () => import('@renderer/views/editor/index.vue')
      },
      {
        path: 'editor/:id',
        name: 'markdown',
        meta: {
          label: 'Markdwon转视频'
        },
        component: () => import('@renderer/views/markdown/index.vue')
      },
      {
        path: 'login',
        name: 'login',
        meta: {
          label: '登录注册'
        },
        component: () => import('@renderer/views/login/index.vue')
      }
    ]
  },
  {
    path: '/markdownCore',
    name: 'markdownCore',
    meta: {
      label: 'Markdwon转预览'
    },
    component: () => import('@renderer/views/markdown-core/index.vue')
  }
];

export default routes;
