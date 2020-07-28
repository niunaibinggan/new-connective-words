import AssetsFectory from '~/components/game/asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'
import PanelImage from '~/components/game/panelImage'

export default async function init (questions) {
  // const  // 接入hilo动画引擎
  const Assets = AssetsFectory()

  const assets = new Assets()
  await assets.load()

  // 初始化舞台
  const gameMain = StageFectory()

  const { stage, ticker } = gameMain

  const { bg, titleBg } = assets

  // 准备场景
  const exportScence = new ExportScence({
    x: 0,
    y: 0,
    questions,
    images: { bg, titleBg },
    title: questions.title,
  })

  const { errorIcon, rightIcon, chooseIcon, bgIcon, fillIcon } = assets
  // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
  const panel = new PanelImage({
    id: 'panel',
    x: 0,
    y: 0,
    errorIcon,
    rightIcon,
    questions: questions.content,
    answerError: [],
    type: 'panel',
    stage: stage,
    setAnswer: [],
    chooseIcon,
    bgIcon,
    fillIcon,
  })
  stage.addChild(exportScence)

  stage.addChild(panel)

  return new Promise((re) => {
    ticker.nextTick(() => {
      re(stage.canvas.toDataURL('image/png'))
    })
  })
}
