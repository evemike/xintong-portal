// @ts-nocheck
import initUnocssRuntime from "@unocss/runtime";
import presetUno from "@unocss/preset-uno"
import presetAttributify from "@unocss/preset-attributify"
import presetIcons from "@unocss/preset-icons"


//
initUnocssRuntime({
  defaults: {
    presets: [presetUno(), presetAttributify(), presetIcons()],
    rules:[
      [/^bp-([\w%]+)-([\w%]+)$/,([,v1,v2]) => ({'background-position':`${v1} ${v2}`})],
    ]
  },
});
// const className = [
//   "font-700",
//   "text-32px"
// ]
