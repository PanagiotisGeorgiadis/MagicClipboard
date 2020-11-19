// Helpers

const rootContextMenuId = "Magic Clipboard"

const flattenObject = (
  obj: Record<string, any>,
  parent: string = "",
  res: Record<string, any> = {}
) => {
  for (let key in obj) {
    let propName = parent ? `${parent}${separator}${key}` : key
    if (typeof obj[key] === "object") {
      flattenObject(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

// Used to separate Id's
const separator = "~"

const generateContextMenus = (rootId: string, obj: Record<string, any>) => {
  Object.keys(obj).map(key => {
    const newKey = `${rootId}${separator}${key}`
    const val = obj[key]

    switch (typeof val) {
      case "bigint":
      case "number":
      case "string":
      case "boolean":
        // Normal key
        chrome.contextMenus.create({
          id: newKey,
          title: key,
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

        if (val !== null) {
          generateContextMenus(newKey, val)
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

  chrome.storage.local.get("clipboard", ({ clipboard }) => {
    if (clipboard) {
      try {
        const obj = JSON.parse(clipboard)
        generateContextMenus(rootContextMenuId, obj)
      } catch (err) {
        console.error(
          "Error while parsing clipboard from storage on init function"
        )
        console.error(err)
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
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]

    chrome.storage.local.get("clipboard", ({ clipboard }) => {
      if (tab && tab.id && clipboard) {
        try {
          const obj = JSON.parse(clipboard)
          // We've got this Magic Clipboard prefix on the menuItemId as well
          const value = flattenObject({ "Magic Clipboard": obj })[
            itemData.menuItemId
          ]

          chrome.tabs.sendMessage(tab.id, {
            kind: "InsertValue",
            value,
          })
        } catch (err) {
          console.error(
            "Error while parsing clipboard from storage on the contextMenus listener"
          )
          console.error(err)
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
