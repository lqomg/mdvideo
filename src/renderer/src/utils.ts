export const fileToBase64 = (file: File | Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // 将File对象读取为Data URL

    reader.onload = () => resolve(reader.result); // 监听读取完成事件，并解决Promise对象
    reader.onerror = (err) => reject(err); // 监听错误事件，并拒绝Promise对象
  });
};

export const getRandomRange = (n: number, m: number) => Math.round(Math.random() * (m - n) + n);

export const getRandomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

export const isOnlineAddr = (src: string) => /^(https?):/.test(src);

export const sleep = (wait: number) =>
  new Promise((res, rej) => {
    setTimeout(() => res(true), wait);
  });
export const getVideoFirstFrame = (videoUrl: string): Promise<string> => {
  // 创建video元素
  let video = document.createElement('video');
  video.src = videoUrl;
  video.setAttribute('crossOrigin', 'Anonymous'); // 处理跨域
  video.setAttribute('preload', 'auto'); // auto|metadata|none
  // 等待视频加载完成
  return new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', () => {
      // 创建canvas元素
      const timer = setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 将视频第一帧绘制到canvas上
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 将canvas图像转换为base64格式的数据URI
        const dataUrl = canvas.toDataURL('image/jpeg');
        clearTimeout(timer);
        // 返回base64格式的数据URI
        resolve(dataUrl);
        video = null;
      }, 200);
    });

    // 如果视频加载出错，则返回错误信息
    video.addEventListener('error', () => {
      reject(`Failed to load video: ${videoUrl}`);
    });
  });
};
