import React from "react"
import ReactDOM from "react-dom"

import styled from "@emotion/styled"

import { CTA } from "./components/Shared"

import magicWandEmoji from "./assets/magic-wand.png"

const Main = styled.main`
  width: 480px;
`

const TopSection = styled.section`
  height: 32px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
`

const TopSectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  text-align: center;
  font-family: "Roboto", sans-serif;
`

const Emoji = styled.img`
  width: 24px;
  height: 24px;
`

const TextareaContainer = styled.section`
  margin-bottom: 16px;
`

const Textarea = styled.textarea`
  width: 100%;
  margin-bottom: 4px;
  resize: none;
  box-sizing: border-box;
`

const Hint = styled.p`
  margin: 0;
  color: gray;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
`

const Error = styled(Hint)`
  color: red;
`

const Success = styled(Hint)`
  color: green;
`

const CTARow = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  > button {
    min-width: 160px;
  }
`

const SaveCTA = styled(CTA)`
  background-color: #1a73e8;

  &:hover {
    background-color: #1566d1;
  }
`

const ClearCTA = styled(CTA)`
  background-color: #999999;

  &:hover {
    background-color: #808080;
  }
`

const updateContextMenu = () => {
  chrome.runtime.sendMessage({ kind: "UpdateContextMenu" })
}

type MessageType = "Hint" | "Success" | "Error"

const View: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<string>()
  const [messageType, setMessageType] = React.useState<MessageType>("Hint")

  React.useEffect(() => {
    chrome.storage.sync.get("clipboard", ({ clipboard }) => {
      if (clipboard && typeof clipboard === "string") {
        setValue(clipboard)
      }
    })
  }, [])

  return (
    <Main>
      <TopSection>
        <TopSectionTitle>
          Your Magic Clipboard <Emoji src={magicWandEmoji} />
        </TopSectionTitle>
      </TopSection>

      <TextareaContainer>
        <Textarea
          rows={10}
          value={value}
          onChange={evt => {
            setValue(evt.target.value)
          }}
        />

        {messageType === "Hint" && (
          <Hint>Paste a valid JSON into the textarea above to get started</Hint>
        )}

        {messageType === "Success" && (
          <Success>Successfully updated your magic clipboard!</Success>
        )}

        {messageType === "Error" && (
          <Error>
            It seems like your JSON is not a valid one. Please try again with a
            valid JSON.
          </Error>
        )}
      </TextareaContainer>

      <CTARow>
        <ClearCTA
          onClick={() => {
            setValue("")
            chrome.storage.sync.remove("clipboard")
            updateContextMenu()
            setMessageType("Hint")
          }}
        >
          Clear
        </ClearCTA>

        <SaveCTA
          onClick={() => {
            if (value) {
              try {
                // Trying to parse it here in order to avoid any blowups on the other parts
                JSON.parse(value)
                chrome.storage.sync.set({ clipboard: value })
                updateContextMenu()
                setMessageType("Success")
              } catch (err) {
                setMessageType("Error")
              }
            }
          }}
        >
          Save
        </SaveCTA>
      </CTARow>
    </Main>
  )
}

ReactDOM.render(<View />, document.getElementById("root"))
