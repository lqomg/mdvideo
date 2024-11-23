## MD Video支持的转场效果如下

:::warning
以下效果均有提示哦
:::

<div :class="$style.trans">

<div v-for="item in TransitionsName" :key="item.value" :class="$style.item">
<img :src="'/../../public/images/'+item.value+'.gif'" />
{{item.label}}
</div>
</div>

<script setup>
import { ref } from 'vue'
const TransitionsName = ref([
  { label: 'Fat', value: 'Fat' },
  { label: '聚焦破碎', value: 'Lens' },
  { label: '摇晃进入', value: 'Shake' },
  { label: '双影淡出', value: 'Slice' },
  { label: '逐渐淡入', value: 'Stretch' },
  { label: '滑动翻篇', value: 'Fluidly' },
  { label: 'BackOff', value: 'BackOff' },
  { label: 'Oblique', value: 'Oblique' },
  { label: '向右划出', value: 'MoveLeft' },
  { label: 'Windows4', value: 'Windows4' },
  { label: '丰富多彩', value: 'Colorful' },
  { label: '渐进放大', value: 'Magnifier' },
  { label: '渐散划出', value: 'Tetrapod' },
  { label: '向右缩放', value: 'ZoomRight' },
  { label: 'Radiation', value: 'Radiation' },
  { label: '水波滑动', value: 'WaterWave' },
  { label: 'FastSwitch', value: 'FastSwitch' },
  { label: '窗帘闪开', value: 'WindowShades' },
  { label: '圆形裁剪', value: 'CircleCrop' },
  // { label: '三色圆环', value: 'TricolorCircle' },
  { label: '流沙效果', value: 'Quicksand' }
]);
</script>

<style module>
  .trans{
    display:flex;
   flex-wrap: wrap;

  }
.trans .item{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 6px;
    width: 20%;
}
.trans .item img{
  border-radius:6px;
}
  </style>