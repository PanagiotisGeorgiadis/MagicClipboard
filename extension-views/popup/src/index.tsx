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
  errorMessage?: string
}

type ViewType = Details | Edit

const View: React.FunctionComponent = () => {
  const [view, setView] = React.useState<ViewType>({ kind: "Edit" })

  React.useEffect(() => {
    chrome.storage.local.get("clipboard", ({ clipboard }) => {
      if (clipboard && typeof clipboard === "string") {
        try {
          const data = JSON.parse(clipboard)
          setView({ kind: "Details", clipboard: data })
        } catch (err) {
          setView({
            kind: "Edit",
            errorMessage:
              "Error while parsing the stored magic clipboard value. Please enter a valid JSON to continue",
          })
        }
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
          errorMessage={view.errorMessage}
          onClear={() => {
            chrome.storage.local.remove("clipboard")
            updateContextMenu()
          }}
          onSave={json => {
            chrome.storage.local.set({ clipboard: JSON.stringify(json) })
            updateContextMenu()
            setView({ kind: "Details", clipboard: json, didJustSave: true })
          }}
        />
      )
  }
}

ReactDOM.render(<View />, document.getElementById("root"))
