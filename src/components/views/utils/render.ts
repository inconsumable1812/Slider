function render(html: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html.trim()
  return wrapper.firstChild as HTMLElement
}

export default render
