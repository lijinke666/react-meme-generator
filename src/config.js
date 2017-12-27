export const prefix = "react-meme"
export const fontFamily = [
    {
        label: "微软雅黑",
        value: "Microsoft YaHei"
    },
    {
        label: "海维提卡",
        value: "Helvetica"
    }
]

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

export const fontSize = Array.from({ length: 60 }).map((_, i) => i+1).filter(v => v > 15)

export const defaultFontSize = fontSize[0]

export const defaultFontText = "测试默认文字"

export const img_max_size = 10