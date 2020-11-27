/**
 * Return the active element of a page, regardless of shadow root or iframe window.
 * @returns {HTMLElement}
 */
function getActiveElement(element: any = document.activeElement) {
  if (element) {
    const shadowRoot = element.shadowRoot
    const contentDocument = element.contentDocument

    if (shadowRoot && shadowRoot.activeElement) {
      return getActiveElement(shadowRoot.activeElement)
    }

    if (contentDocument && contentDocument.activeElement) {
      return getActiveElement(contentDocument.activeElement)
    }

    return element
  }
}

chrome.runtime.onMessage.addListener(request => {
  // InsertValue is used to paste a value to the active element.
  if (request.kind === "InsertValue") {
    const activeElement = getActiveElement()
    if (activeElement && activeElement.value !== undefined) {
      activeElement.value = request.value
      // Firing these events here just in case there are SPAs that depend on event listeners instead of reading the values of the inputs.
      const options = { bubbles: true, cancelable: true }
      activeElement.dispatchEvent(new KeyboardEvent("change", options))
      activeElement.dispatchEvent(new KeyboardEvent("keydown", options))
      activeElement.dispatchEvent(new KeyboardEvent("keyup", options))
    } else {
      console.error(
        "Magic Clipboard failed to detect the active element on the current window."
      )
    }
  }
})
