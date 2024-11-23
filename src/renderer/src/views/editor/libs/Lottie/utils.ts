import { useCommonStore } from '@renderer/store';

export const getLottiePath = (id: string, lottieId: string) => {
  const commonStore = useCommonStore();
  const baseURL = commonStore.resourceBasePath + '\\target\\lottie';
  return `${baseURL}/data/${id}/${lottieId}.json`;
};

export const getLottieImage = (id: string, lottieId: any) => {
  const commonStore = useCommonStore();
  const baseURL = commonStore.resourceBasePath + '\\target\\lottie';
  return `${baseURL}/images/${id}/${lottieId}.png`;
};
