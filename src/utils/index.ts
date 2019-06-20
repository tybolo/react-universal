interface CssModule {
  [key: string]: string;
}

export function parseStyles (cssModule: CssModule) {
  return (...className: string[]) => {
    // console.log(className[0])
    return className.map((name) => {
      return cssModule[name]
    }).join(' ')
  }
}
