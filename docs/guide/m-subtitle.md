
## AI字幕

MD Video会自动解析文档中的普通文本，生成AI语音并添加字幕

可以通过**元素配置** @speaker配置发音人信息

目前仅接入部分腾讯AI的部分语音可前往[https://curl.qcloud.com/UvsYBNSF](https://curl.qcloud.com/UvsYBNSF)试听'


| 全称             | 含义                             | 默认                     | 其他                                            |
| ---------------- | -------------------------------- | ------------------------ | ----------------------------------------------- |
| `@duration`      | 持续时长                         | 根据语音字幕，不建议填写 |                                                 |
| `@delay`         | 延迟出现时间                     | 0s                       |                                                 |
| `@speaker`       | 配置发音人信息                   |                          | 根据提示选择                                    |
| `@color`         | 文字颜色                         | #000 ,黑色               |                                                 |
| `@fontFamily`    | 字体                             | 微软雅黑                 |                                                 |
| `@fontSize`      | 字体大小                         | 缺省                     | 当值介于0-1时，表示占比视频宽度                 |
| `@fontWeight`    | 字体加粗,                        | normal                   | 可选值为bold                                    |
| `@fontStyle`     | 字体样式（斜体）                 | normal                   | 可选值为italic                                  |
| `@letterSpacing` | 字体间距，表示每个文字之间的距离 | 6                        |                                                 |
| `@shadowColor`   | 文字阴影颜色                     | 缺省                     |                                                 |
| `@fill`          | 文字渐变色                       | 缺省                     | 值为三个色组，当shadowColor存在时此配置不会生效 |