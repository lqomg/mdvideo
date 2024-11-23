import { ISetStoreConfig, IStoreConfigStete } from '@api/store';

export const updateStoreConfig = async (payload: Partial<IStoreConfigStete>) => {
  const res = await window.invoke<ISetStoreConfig['req'], ISetStoreConfig['res']>(
    'setStoreConfig',
    {
      payload: { ...payload }
    }
  );
  return res.data;
};
