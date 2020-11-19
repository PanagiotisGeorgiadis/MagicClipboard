import React from "react"

import styled from "@emotion/styled"

import { IconCTA, TopRow, TopRowTitle } from "../components/Shared"

import magicWandEmoji from "../assets/magic-wand.png"
import { SaveIcon, TrashIcon } from "../components/Icons"

const Main = styled.main`
  width: 480px;
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
  max-width: 480px;
  max-height: 495px;
  margin-bottom: 4px;
  resize: vertical;
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
  display: flex;
  align-items: center;
`

const SaveCTA = styled(IconCTA)`
  margin-left: 16px;
`

const hintMsg =
  "Add a valid JSON into the textarea above and press save to get started"
const errorMsg =
  "It seems like your JSON is not a valid one. Please try again with a valid JSON."
const saveSuccessMsg = "Successfully updated your magic clipboard!"
const clearSuccessMsg = "Successfully cleared your magic clipboard!"

interface Message {
  kind: "Error" | "Hint" | "Success"
  msg: string
}

interface Props {
  clipboard?: JSON
  errorMessage?: string
  onClear: () => void
  onSave: (json: JSON) => void
}

const View: React.FunctionComponent<Props> = ({
  clipboard,
  errorMessage,
  onClear,
  onSave,
}) => {
  const [value, setValue] = React.useState<string>(
    clipboard ? JSON.stringify(clipboard, null, 2) : ""
  )
  const [message, setMessage] = React.useState<Message>(
    errorMessage
      ? {
          kind: "Error",
          msg: errorMessage,
        }
      : {
          kind: "Hint",
          msg: hintMsg,
        }
  )

  return (
    <Main>
      <TopRow>
        <TopRowTitle>
          Magic Clipboard <Emoji src={magicWandEmoji} />
        </TopRowTitle>

        <CTARow>
          <IconCTA
            title="Clear clipboard"
            onClick={() => {
              onClear()
              setValue("")
              setMessage({ kind: "Success", msg: clearSuccessMsg })
            }}
          >
            <TrashIcon width={20} height={20} color="#E62E00" />
          </IconCTA>

          <SaveCTA
            title="Save clipboard"
            onClick={() => {
              if (value) {
                try {
                  // Trying to parse it here in order to verify its validity
                  const json = JSON.parse(value)
                  if (json && typeof json === "object") {
                    onSave(json)
                    setMessage({ kind: "Success", msg: saveSuccessMsg })
                  } else {
                    setMessage({ kind: "Error", msg: errorMsg })
                  }
                } catch (err) {
                  setMessage({ kind: "Error", msg: errorMsg })
                }
              }
            }}
          >
            <SaveIcon width={20} height={20} color="#0066CC" />
          </SaveCTA>
        </CTARow>
      </TopRow>

      <TextareaContainer>
        <Textarea
          rows={10}
          value={value}
          onChange={evt => {
            setValue(evt.target.value)
          }}
        />
        {message.kind === "Hint" && <Hint>{message.msg}</Hint>}
        {message.kind === "Success" && <Success>{message.msg}</Success>}
        {message.kind === "Error" && <Error>{message.msg}</Error>}
      </TextareaContainer>
    </Main>
  )
}

export default View
