// Helpers

const rootContextMenuId = "Magic Clipboard"

// Used to separate Id's
const separator = "~"

const generateContextMenus = (
  rootId: string,
  obj: Record<string, any>,
  idSuffix: string = ""
) => {
  Object.keys(obj).map(key => {
    const newKey = idSuffix
      ? `${rootId}${separator}${idSuffix}${separator}${key}`
      : `${rootId}${separator}${key}`

    switch (typeof obj[key]) {
      case "bigint":
      case "number":
      case "string":
        // Normal key
        chrome.contextMenus.create({
          id: newKey,
          title: idSuffix ? `${key} - ${idSuffix}` : key,
          contexts: ["editable"],
          parentId: rootId,
        })
        break

      case "boolean":
        // Checkbox Key
        chrome.contextMenus.create({
          id: newKey,
          title: `${key} - ${obj[key]}`,
          contexts: ["editable"],
          parentId: rootId,
        })
        break

      case "object": {
        // Add the "parent node"
        chrome.contextMenus.create({
          id: newKey,
          title: key,
          contexts: ["editable"],
          parentId: rootId,
        })

        // Recursive Call
        if (Array.isArray(obj[key])) {
          // Its an array so you need some special sauce here
          obj[key].map((item, index) => {
            switch (typeof item) {
              case "bigint":
              case "number":
              case "string":
              case "boolean":
                chrome.contextMenus.update(newKey, {
                  title: `${key} - flattened`,
                })
                break

              case "object":
                // Add separators
                if (index > 0) {
                  chrome.contextMenus.create({
                    id: `${newKey}-separator-${index + 1}`,
                    contexts: ["editable"],
                    parentId: newKey,
                    type: "separator",
                  })
                }
                generateContextMenus(newKey, item, (index + 1).toString())
                break

              default:
              // Do nothing for now
            }
          })
        } else {
          // Its an object so think accordingly
          generateContextMenus(newKey, obj[key])
        }
        break
      }

      default:
      // Do nothing for now
    }
  })
}

const init = () => {
  chrome.contextMenus.removeAll()

  chrome.contextMenus.create({
    id: rootContextMenuId,
    title: "Magic Clipboard",
    contexts: ["editable"],
  })

  chrome.storage.sync.get("clipboard", ({ clipboard }) => {
    if (clipboard) {
      try {
        const obj = JSON.parse(clipboard)
        generateContextMenus(rootContextMenuId, obj)
      } catch (err) {
        // TODO: Add some proper error handling here
      }
    }
  })
}

// Chrome API listeners

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.kind) {
    case "UpdateContextMenu":
      init()
      break
  }
})

chrome.contextMenus.onClicked.addListener(itemData => {
  console.log("WOOHOOOOOOOOO")
  console.log(itemData)

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]

    chrome.storage.sync.get("clipboard", ({ clipboard }) => {
      if (tab && tab.id && clipboard) {
        try {
          let value = JSON.parse(clipboard)
          const menuItemKeys = itemData.menuItemId.split(separator)

          for (let i = 1; i < menuItemKeys.length; i++) {
            const newValue = value[menuItemKeys[i]]

            if (Array.isArray(newValue)) {
              const index = parseInt(menuItemKeys[i + 1]) - 1
              value = newValue[index]
              i++
            } else {
              value = newValue
            }

            // console.log(value)
            // console.log(typeof value)
          }

          chrome.tabs.sendMessage(tab.id, {
            kind: "InsertValue",
            value,
          })
        } catch (err) {
          // TODO: Add some proper error handling here
        }
      }
    })
  })
})

chrome.runtime.onInstalled.addListener(() => {
  // When the app gets installed, set up a mock Context menu.
})

// Initialization

init()
