import {raw} from "utils/bulma"

export default class Roll {
  static animate (ctrl, ele) {
    setTimeout( 
        Roll.addClass(ele)
      , Roll.timers.scalar(ele) 
    )
  }

  static addClass (ele) {
    return () => ele.classList.add(Roll.ranClass)
  }
}

Roll.timing = {
    x       : 100
  , scalar  : .5
  , initial : 500
  , fuzz    : 7500
}

Roll.timers = {
  scalar (ele) {
    const baseX = parseInt(ele.dataset.x)
    const baseY = parseInt(ele.dataset.y)

    return Roll.timing.initial + (baseX * Roll.timing.x) + (Roll.timing.x * Roll.timing.scalar * baseY)
  }
}

Roll.ranClass = raw.pale