/**
 * 绘制图片，矩形
 * @param canvasId
 * @param imageUrl
 * @param coordinates 矩形点信息（采用向右水平Y轴，垂直向下X轴的坐标系(反人类坐标系！！！，数据如此)， 左上右下对角点坐标）如：
 * [
 * [[0, 0], [10, 10]],
 * [[15, 15], [20, 20]],
 * ]
 * @param config 配置参数 ：
 * width canvas 宽 ，默认 675
 * height canvas 高 ，默认 875，优先 根据 高度进行缩放
 * offsetX 画图 x 轴偏移，默认 0
 * offsetY 画图 y 轴偏移，默认 0
 * rectBorderColor 矩形表框颜色， 默认 'red'
 * rectBackgroundColor 矩形背景色, 默认 'rgba(252,180,180,.2)'
 * center 是否图片居中， 默认居中
 */

export class CanvasBox {
  // canvas 使用的元素
  canvas
  img
  ctx
  ratio
  imageRealWidth
  imgRealHeight
  // 缩放比例
  zoom = 1

  constructor(canvasId, imageUrl, coordinates, groupFieldLocation, config, useWidth) {
    console.log(imageUrl, coordinates, groupFieldLocation, '======')
    this.canvasId = canvasId
    this.imageUrl = imageUrl
    this.coordinates = coordinates
    this.groupFieldLocation = groupFieldLocation
    this.config = handleConfig(config)
    // 使用宽度缩放
    this.useWidth = useWidth
    // this.renderImg()
  }

  renderImg() {
    return new Promise((resolve, reject) => {
      // 检查坐标数据是否正确
      if (this.coordinates) {
        this.coordinates = this.checkCoordinates(this.coordinates)
      }
      this.canvas = document.querySelector(this.canvasId)
      if (this.canvas && this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d')

        this.ratio = getPixelRatio(this.ctx)
        if (this.imageUrl === 'loading') {
          this.dramMsg('加载中...')
          return
        }
        if (!this.imageUrl) {
          // 图片url为空
          this.dramMsg('抱歉，暂时无法确认图片内容')
          return
        }

        this.img = new Image()
        this.img.src = this.imageUrl
        this.img.setAttribute('crossOrigin', 'anonymous')
        this.img.onerror = () => {
          console.log('load img fail...')
          // 图片url为空
          this.dramMsg('图片加载失败...')
        }
        this.dramMsg('加载中...')
        this.img.onload = () => {
          // 实际宽高，以及 宽高比
          this.imageRealWidth = this.img.width
          this.imgRealHeight = this.img.height

          // 如果设置了显示高度，优先 根据 高度进行缩放,
          let showHeight
          let showWidth
          if (!this.useWidth) {
            // 显示高度
            showHeight = this.config.height
            // 显示/实际 缩放比
            this.zoom = showHeight / this.imgRealHeight
            // 显示宽度
            showWidth = this.imageRealWidth * this.zoom
            // 显示宽度 大于设定宽度， 再次按宽度缩放
            if (showWidth > this.config.width) {
              showWidth = this.config.width
              // 宽度缩放
              this.zoom = showWidth / this.imageRealWidth
              // 显示高度
              showHeight = this.imgRealHeight * this.zoom
            }
          } else {
            // 显示高度
            showWidth = this.config.width
            this.zoom = showWidth / this.imageRealWidth
            showHeight = this.imgRealHeight * this.zoom
            if (showHeight > this.config.height) {
              showHeight = this.config.height
              this.zoom = showHeight / this.imgRealHeight
              showWidth = this.imageRealWidth * this.zoom
            }
          }

          // 1. 锁定显示宽高， 标准化画布宽高
          this.canvas.style.width = `${showWidth}px`
          this.canvas.style.height = `${showHeight}px`

          // 画布 宽 高
          this.canvas.width = showWidth * 2
          this.canvas.height = showHeight * 2

          // 清空画布
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

          // 绘画图片
          this.ctx.drawImage(this.img, this.config.offsetX, this.config.offsetY, this.canvas.width, this.canvas.height)
          // 绘制矩形
          // if (this.coordinates) {
          //   this.drawRect(this.coordinates)
          // }

          if (this.groupFieldLocation && this.groupFieldLocation.length) {
            this.groupFieldLocation.forEach((item) => {
              const checkCoordinates1 = this.checkCoordinates(item.locations)
              if (checkCoordinates1) {
                this.drawRect(checkCoordinates1, item.current, item.index)
              }
            })
          }

          resolve('finished')
        }
      } else {
        reject('error')
        console.error('cannot find dom with id=', this.canvasId)
      }
    })

  }

  dramMsg(msg) {
    const showWidth = 300
    const showHeight = 150
    this.ctx.save()
    this.canvas.width = showWidth * this.ratio
    this.canvas.height = showHeight * this.ratio
    this.canvas.style.width = `${showWidth}px`
    this.canvas.style.height = `${showHeight}px`
    this.ctx.textBaseline = 'middle'
    this.ctx.font = '18px bold 黑体'
    this.ctx.fillStyle = '#AAAAAA'
    this.ctx.scale(this.ratio, this.ratio)
    this.ctx.fillText(msg, 50, 75)
    this.ctx.restore()
  }

  checkCoordinates(customCoordinates) {
    return customCoordinates.map(coordinate => {
      console.log(coordinate, coordinate.length)
      // 存在 coordinate 为null的情况
      if (coordinate === null) {
        return null
      }
      if (coordinate && coordinate.length !== 2) {
        console.error('坐标数据格式不正确，每个矩形点，有两个点坐标')
        return null
      }
      for (let j = 0; j < coordinate.length; j++) {
        const point = coordinate[j];
        if (point.length !== 2) {
          console.error('每个点坐标必须为：x,y两个数字')
          return null
        }
        if (typeof point[0] !== 'number' || typeof point[1] !== 'number') {
          try {
            point[0] = Number(point[0])
            point[1] = Number(point[1])
          } catch (e) {
            console.error(e)
            return null
          }
        }
      }
      return coordinate
    }).filter(s => !!s)
  }
  getRgbStr(hexColor) {
    hexColor = hexColor.substr(1)
    let str
    const a = []
    for (let i = 0; i < 3; i++) {
      str = hexColor.substr(i * 2, 2)
      a[i] = parseInt(str, 16)
    }
    return a.join(',')
  }
  drawRect(coordinates, current = false, index = 1) {
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i]
      if (!coordinate) {
        continue
      }
      const {
        x,
        y,
        recH,
        recW
      } = this.extracted(coordinate)
      this.ctx.save()
      this.ctx.scale(2, 2)
      this.ctx.strokeStyle = this.config.rectBorderColor
      this.ctx.strokeRect(x, y, recW, recH)
      if (current) {
        this.ctx.fillStyle = this.config.rectBackgroundColor
      } else {
        this.ctx.fillStyle = 'rgba(255,255,255,0)'
      }
      this.ctx.fillRect(x, y, recW, recH)
      // 绘制圆圈
      this.drawCircle(coordinate, current, index)
      this.ctx.restore()
    }
  }

  drawCircle(coordinate, current = false, index = 1) {
    let {
      x,
      y,
      recW
    } = this.extracted(coordinate)
    if (y < 10) {
      y += 24
    }
    // 绘制 左上角 圆圈
    this.ctx.beginPath()
    this.ctx.arc(x + recW - 10, y - 12, 10, 0, Math.PI * 2, true)
    this.ctx.closePath()
    if (current) {
      this.ctx.fillStyle = this.config.rectBorderColor
    } else {
      this.ctx.fillStyle = 'rgba(255,255,255,0)'
    }
    this.ctx.fill()

    // 左上角 圆圈中的数字
    if (current) {
      this.ctx.fillStyle = '#ffffff'
      this.ctx.textBaseline = 'middle'
    } else {
      this.ctx.fillStyle = this.config.rectBorderColor
      this.ctx.textBaseline = 'middle'
    }
    this.ctx.font = '12px bold 黑体'
    // 序号超过两位数字，x偏移调整
    let offsetX = 13
    if (index > 9) {
      offsetX = 17
    }
    this.ctx.fillText(String(index), x + recW - offsetX, y - 10)
    this.ctx.stroke()
  }

  extracted(coordinate) {
    const pos = {
      leftTopX: coordinate[0][0],
      leftTopY: coordinate[0][1],
      rightBottomX: coordinate[1][0],
      rightBottomY: coordinate[1][1]
    }
    const x = (pos.leftTopY + this.config.offsetX) * this.zoom
    const y = (pos.leftTopX + this.config.offsetY) * this.zoom
    let recH = (pos.rightBottomX - pos.leftTopX) * this.zoom
    let recW = (pos.rightBottomY - pos.leftTopY) * this.zoom
    // 防止矩形越出绘图边界
    if (x + recW >= (this.imageRealWidth * this.zoom)) {
      recW = this.imageRealWidth * this.zoom - x - 1
    } else if (x <= 0) {
      recW -= 10
    }
    if (y + recH >= this.imgRealHeight * this.zoom) {
      recH = this.imgRealHeight * this.zoom - y - 1
    } else if (y <= 0) {
      recH -= 10
    }
    return {
      x,
      y,
      recH,
      recW
    }
  }
}

/**
 * 获取 设备物理像素分辨率比 / 渲染canvas之前会用几个像素来存储画布
 * @param ctx
 * @returns {number}
 */
const getPixelRatio = (ctx) => {
  const backingStore =
    ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio || 1
  return (window.devicePixelRatio || 1) / backingStore
}

// 处理配置参数
const handleConfig = (config) => {
  console.log(config, 'config')
  if (!config) {
    return {
      width: 766,
      height: 458,
      offsetX: 0,
      offsetY: 0,
      rectBorderColor: '#D90909',
      rectBackgroundColor: 'rgba(217,9,9,0.2)',
      // 默认居中
      center: true
    }
  }
  const width = config.width && typeof config.width === 'number' ? config.width : 675
  const height = config.height && typeof config.height === 'number' ? config.height : 875
  const offsetX = config.offsetX && typeof config.offsetX === 'number' ? config.offsetX : 0
  const offsetY = config.offsetY && typeof config.offsetY === 'number' ? config.offsetY : 0
  const rectBorderColor = config.color && typeof config.color === 'string' ? config.color : '#D90909'
  const rectBackgroundColor = config.rectBackgroundColor
  // ? 'rgba(' + this.getRgbStr(config.rectBackgroundColor) + ',0.2)'
  //   : rectBorderColor.startsWith('#') ? 'rgba(' + this.getRgbStr(rectBorderColor) + ',0.2)' : 'rgba(28,165,255,0.2)'
  const center = typeof config.center === 'boolean' ? config.center : true
  return {
    width,
    height,
    offsetX,
    offsetY,
    rectBorderColor,
    rectBackgroundColor,
    center
  }
}
