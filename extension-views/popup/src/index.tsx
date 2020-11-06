import React from "react"
import ReactDOM from "react-dom"

import DetailsView from "./views/Details"
import EditView from "./views/Edit"

/*
  Sends a message over to background.js in order to update
  the "contextMenus" based on the stored "clipboard value"
*/
const updateContextMenu = () => {
  chrome.runtime.sendMessage({ kind: "UpdateContextMenu" })
}

interface Details {
  kind: "Details"
  clipboard: JSON
  didJustSave?: boolean
}

interface Edit {
  kind: "Edit"
  clipboard?: JSON
}

type ViewType = Details | Edit

const View: React.FunctionComponent = () => {
  const [view, setView] = React.useState<ViewType>({ kind: "Edit" })

  React.useEffect(() => {
    chrome.storage.sync.get("clipboard", ({ clipboard }) => {
      if (clipboard && typeof clipboard === "string") {
        setView({ kind: "Details", clipboard: JSON.parse(clipboard) })
      } else {
        setView({ kind: "Edit" })
      }
    })
  }, [])

  switch (view.kind) {
    case "Details":
      return (
        <DetailsView
          clipboard={view.clipboard}
          didJustSave={view.didJustSave}
          goBack={() => {
            setView({ kind: "Edit", clipboard: view.clipboard })
          }}
        />
      )

    case "Edit":
      return (
        <EditView
          clipboard={view.clipboard}
          onClear={() => {
            chrome.storage.sync.remove("clipboard")
            updateContextMenu()
          }}
          onSave={json => {
            chrome.storage.sync.set({ clipboard: JSON.stringify(json) })
            updateContextMenu()
            setView({ kind: "Details", clipboard: json, didJustSave: true })
          }}
        />
      )
  }
}

ReactDOM.render(<View />, document.getElementById("root"))
