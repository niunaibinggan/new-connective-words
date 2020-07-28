import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.stage = properties.stage

    this.questions = properties.questions

    if (properties.type === 'panel') this.setAnswer = Array.apply(null, { length: properties.questions.length })
    else this.setAnswer = properties.setAnswer

    this.answerError = properties.answerError
    this.rightIcon = properties.rightIcon

    // properties.type  'panel' |'resutl' 两种种类型
    this.panelType = properties.type

    this.errorIcon = properties.errorIcon

    this.creatContainer()
    this.bgIcon = properties.bgIcon || require('~/static/bg_button.png')
    this.chooseIcon = properties.chooseIcon || require('~/static/choose_button.png')

    this.initBlock(properties)

  }
  questions = []
  answerError = []
  rect = [0, 0, 200, 86]
  bgIcon = ''
  chooseIcon = ''
  fillIcon = ''
  errorIcon = ''
  rightIcon = ''
  stage = null
  temporaryQuestionsContainer = null
  temporarySelectedContainer = null

  setAnswer = []
  includeArr = []
  panelType = ''
  questionDistanceBase = 5
  selectedDistanceBase = 110
  questionTargetNumber = 0
  selectedTargetNumber = 0
  questionsOffsetValue = {}
  selectedOffsetValue = {}


  creatContainer () {
    this.temporaryQuestionsContainer = new Hilo.Container({
      id: 'questions',
      x: 220,
      y: 320,
    }).addTo(this)

    this.temporarySelectedContainer = new Hilo.Container({
      id: 'select',
      x: 220,
      y: 660,
    }).addTo(this)
  }

  initBlock (properties) {
    properties.questions.forEach((item, index) => {

      this.questionsOffsetValue = this.getOffsetValue({
        type: 'questions',
        index,
        base: this.questionDistanceBase
      })

      let answerText
      if (this.panelType === 'result') {
        answerText = properties.questions.filter(item => this.setAnswer[index].questionId === item.id)[0].text
      }

      this.commonBlock({
        target: this.temporaryQuestionsContainer,
        image: this.bgIcon,
        id: item.id,
        text: item.text,
        index,
        type: this.panelType,
        textVisible: this.panelType !== 'panel',
        offsetValue: this.questionsOffsetValue,
        isAllow: false
      })

      if (this.panelType === 'panel') {

        this.selectedOffsetValue = this.getOffsetValue({
          type: 'selected',
          index,
          base: this.selectedDistanceBase
        })
        this.commonBlock({
          target: this.temporarySelectedContainer,
          image: this.chooseIcon,
          id: item.id,
          text: item.text,
          index,
          type: this.panelType,
          textVisible: this.panelType === 'panel',
          offsetValue: this.selectedOffsetValue,
          isAllow: true
        })
      }
    })
  }
  commonBlock (data) {

    const id = { realId: data.index, questionId: data.id }

    const blockCon = this.creatBlockContainer(data.target, data.image, id, data.offsetValue.x, data.offsetValue.y)

    if (data.textVisible) this.creatText(blockCon, data.text, id)
  }

  onloadImage (image, target, _this) {
    const img = new Image()
    img.src = image
    img.onload = () => {
      img.onload = null
      const pattern = _this.stage.renderer.context.createPattern(img, 'no-repeat')
      target.background = pattern
    }
  }

  getOffsetValue (data) {
    const isLineBreak = (1920 - 220 * 2) - (this.rect[2] + data.base) * data.index < 220

    let targetNumber = data.type === 'questions' ? this.questionTargetNumber : this.selectedTargetNumber

    if (!targetNumber && isLineBreak) data.type === 'questions' ? this.questionTargetNumber = data.index : this.selectedTargetNumber = data.index

    const number = data.type === 'questions' ? this.questionTargetNumber : this.selectedTargetNumber

    const initX = (this.rect[2] + data.base) * Math.abs(data.index - number)
    const initY = isLineBreak ? this.rect[3] + 20 : 0

    return { x: initX, y: initY }
  }

  creatBlockContainer (target, image, id, x, y) {
    const blockCon = new Hilo.Container({
      id,
      x,
      y,
    }).addTo(target)

    new Hilo.Bitmap({
      id,
      image: image,
      rect: this.rect,
    }).addTo(blockCon)

    return blockCon
  }
  creatText (blockCon, text, id) {
    new Text({
      id,
      text,
      fontSize: text.length < 4 ? 34 : 34 - Math.round(text.length / 3) * 5,
      bold: true,
      textAlign: 'center',
      visible: true,
      alpha: 1,
      reTextWidth: this.rect[2],
      height: this.rect[3] - 27,
      x: 0,
      y: Math.floor(text.length / 5) ? 27 + (34 - (34 - Math.round(text.length / 3) * 5)) / 2 : 27,
      color: '#fff',
    }).addTo(blockCon)
  }
}
