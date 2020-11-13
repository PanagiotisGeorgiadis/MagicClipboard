chrome.runtime.onMessage.addListener(request => {
  // InsertValue is used to paste a value to the active element.
  if (request.kind === "InsertValue") {
    const element = document.activeElement as HTMLInputElement

    if (element && element.value !== undefined) {
      element.value = request.value
    }
  }
})
