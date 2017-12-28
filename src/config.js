export const prefix = "react-meme"
export const fontFamily = [
    {
        label: "微软雅黑",
        value: "Microsoft YaHei"
    },
    {
        label: "海维提卡",
        value: "Helvetica"
    },{
        label:"草书",
        value:"cursive"
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

export const defaultFontSize = fontSize[4]

export const defaultFontColor = "#444"

export const defaultFontText = "写点什么"

export const img_max_size = 1024

export const range = 0.05           //每次缩放的值

export const maxScale = 3.0         //最大缩放

export const previewContentStyle = {
    width:300,
    height:300
}