import { fonts } from "./properties";

// const _setFonts = () => {
//   // Font Setup - Noto
//   wx.loadFontFace({
//     family: 'noto',
//     source: `url('${ folders.assets }fonts/NotoSans-Regular.ttf?s0kbi6')`,
//     desc: {
//       weight: '400'
//     },
//   })

//   wx.loadFontFace({
//     family: 'noto',
//     source: `url('${ folders.assets }fonts/NotoSans-SemiBold.ttf?s0kbi6')`,
//     desc: {
//       weight: '600'
//     },
//   })

//   wx.loadFontFace({
//     family: 'noto',
//     source: `url('${ folders.assets }fonts/NotoSans-Bold.ttf?s0kbi6')`,
//     desc: {
//       weight: '700'
//     },
//   })

//   wx.loadFontFace({
//     family: 'noto',
//     source: `url('${ folders.assets }fonts/NotoSans-Black.ttf?s0kbi6')`,
//     desc: {
//       weight: '900'
//     },
//   })

//   // Font Setup - Noto SC
//   wx.loadFontFace({
//     family: 'notosc',
//     source: `url('${ folders.assets }fonts/NotoSansSC-Light.otf?s0kbi6')`,
//     desc: {
//       weight: '300'
//     },
//   })

//   wx.loadFontFace({
//     family: 'notosc',
//     source: `url('${ folders.assets }fonts/NotoSansSC-Regular.otf?s0kbi6')`,
//     desc: {
//       weight: '400'
//     },
//   })

//   wx.loadFontFace({
//     family: 'notosc',
//     source: `url('${ folders.assets }fonts/NotoSansSC-Bold.otf?s0kbi6')`,
//     desc: {
//       weight: '700'
//     },
//   })
// }

// Font loader wrapper
function loadFont(font) {
  const promise = new Promise( (resolve, reject) => {
    try {
      wx.loadFontFace({
        family: font.family,
        source: `url('${ font.source }')`,
        desc: {
          weight: font.weight
        },
      })
      resolve();
    } catch {
      reject();
    }
  })

  return promise;
}

export async function loadFonts() {
  await fonts.forEach( font => {
    return loadFont(font);
  })
  return;
}