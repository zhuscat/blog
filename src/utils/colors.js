import gray from 'gray-percentage'

const colors = {
  a: [],
  b: [],
  c: [],
  // original palette by @SachaG
  // @see https://www.figma.com/file/J6IYJEtdRmwJQOrcZ2DfvxDD/Gatsby
  gatsby: `#663399`, // was #744c9e
  lilac: `#9D7CBF`,
  // accent color from the "bolder palette" by @ArchieHicklin
  // @see https://github.com/gatsbyjs/gatsby/issues/1173#issuecomment-309415650
  accent: `#ffb238`, // "Mustard",
  success: `#37b635`,
  warning: `#ec1818`,
  ui: {
    bright: `#e0d6eb`,
    light: `#f5f3f7`,
    whisper: `#fbfafc`,
  },
  gray: {
    dark: gray(8, 270),
    copy: gray(12, 270),
    calm: gray(46, 270),
  },
}

export default colors
