import axios from 'axios';

export const downloadFile = (onlinepath: string) => {
  return axios.get(onlinepath).then();
};
