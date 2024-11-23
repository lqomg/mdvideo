import { ref } from 'vue';

export const useSideBar = () => {
  const sideOpen = ref(true);
  const attrOpen =ref(true);
  const setSideOpen = (visible: boolean) => {
    sideOpen.value = visible;
  };
  const setAttrOpen = (visible: boolean) => {
    attrOpen.value = visible;
  };
  return {
    sideOpen,
    attrOpen,
    setSideOpen,
    setAttrOpen
  };
};
