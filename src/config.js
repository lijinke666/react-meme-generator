export const prefix = "react-meme"

//可选字体配置
export const fontFamily = [
    {
        label: "微软雅黑",
        value: "Microsoft YaHei"
    },
    {
        label: "海维提卡",
        value: "Helvetica"
    }, {
        label: "草书",
        value: "cursive"
    }, {
        label: "宋体",
        value: "SimSub"
    }, {
        label: "黑体",
        value: "SimHei"
    }, {
        label: "楷体",
        value: "KaiTi"
    }, {
        label: "华文黑体",
        value: "STKaiti"
    }, {
        label: "隶书",
        value: "LiSu"
    }, {
        label: "幼圆",
        value: "YouYuan"
    }
]

//图片处理类型 TODO
export const imageProcess = [
    {
        label: "系统默认",
        value: "default"
    },
    {
        label: "翻转",
        value: "reversal"
    },
    {
        label: "压缩",
        value: "compress"
    }
]

export const fontSize = Array.from({ length: 100 }).map((_, i) => i + 1).filter(v => v >= 12)

//默认 20 px
export const defaultFontSize = fontSize[4]

export const defaultFontColor = "#444"

export const defaultFontText = "示例文字"

//图片最大限制
export const img_max_size = 1024

//图片每次缩放的值
export const range = 0.05    

//文字每次缩放的值
export const textRange = 1        

export const whellScaleRange = [0.4, 3.0]

//文本缩放 最大最小值限制
export const textWhellScaleRange = [fontSize[0],fontSize[fontSize.length-1]]

//图片默认缩放比例
export const defaultScale = 1.0
export const defaultRotate = 0

export const defaultQuality = 0.50

//图片预览区域宽高
export const previewContentStyle = {
    width: 300,
    height: 300
}