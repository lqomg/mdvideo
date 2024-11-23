import ffmpeg from 'fluent-ffmpeg';
import FFMPEG_PATH from '../../resources/ffmpeg/ffmpeg.exe?asset&asarUnpack';
import FFPROBE_PATH from '../../resources/ffmpeg/ffprobe.exe?asset&asarUnpack';
// if (process.env.NODE_ENV === "production") {
//   FFMPEG_PATH = FFMPEG_PATH.replace("app.asar", "app.asar.unpacked");
//   FFPROBE_PATH = FFPROBE_PATH.replace("app.asar", "app.asar.unpacked");
// }

ffmpeg.setFfmpegPath(FFMPEG_PATH);
ffmpeg.setFfprobePath(FFPROBE_PATH);
export { FFMPEG_PATH, FFPROBE_PATH };

export default ffmpeg;
