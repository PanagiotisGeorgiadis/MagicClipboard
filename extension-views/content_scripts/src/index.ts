console.log("Hello from content scripts of Magic Clipboard!")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message listened on the contentScript")
  console.log(request)
  console.log(sender)

  // InsertValue is used to paste a value to the active element.
  if (request.kind === "InsertValue") {
    const element = document.activeElement as HTMLInputElement

    if (element && element.value !== undefined) {
      element.value = request.value
    }
  }
})
