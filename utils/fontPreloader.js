import { fonts } from "./properties";

// Font loader wrapper
function loadFont(font) {
  const promise = new Promise( (resolve, reject) => {
    wx.loadFontFace({
      global: true,
      family: font.family,
      source: `url('${ font.source }')`,
      desc: {
        weight: font.weight
      },
      success: resolve,
      fail: reject
    })
  })

  return promise;
}

export async function loadFonts() {
  for await (let font of fonts) {
    await loadFont(font)
  }
}