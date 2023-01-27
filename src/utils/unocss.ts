// @ts-nocheck
import initUnocssRuntime from "@unocss/runtime";
import presetUno from "@unocss/preset-uno"
import presetAttributify from "@unocss/preset-attributify"
import presetIcons from "@unocss/preset-icons"


//
initUnocssRuntime({
  defaults: {
    presets: [presetUno(), presetAttributify(), presetIcons()],
  },
});
// const className = [
//   "font-700",
//   "text-32px"
// ]
