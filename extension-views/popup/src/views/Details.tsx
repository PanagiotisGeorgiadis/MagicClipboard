import React from "react"

import styled from "@emotion/styled"

import { PenIcon } from "../components/Icons"
import {
  IconCTA,
  TopRow as DefaultTopRow,
  TopRowTitle,
} from "../components/Shared"

const Main = styled.main`
  width: 480px;
`

const TopRow = styled(DefaultTopRow)`
  margin-bottom: 0;
`

const Content = styled.div`
  max-height: 480px;
  overflow: auto;
`

const Pre = styled.pre<{ didJustSave: boolean }>`
  ${props => (props.didJustSave ? "color: #009933" : "")};
  font-size: 14px;
  font-family: "Roboto", sans-serif;
`

interface Props {
  clipboard: JSON
  didJustSave?: boolean
  goBack: () => void
}

const View: React.FunctionComponent<Props> = ({
  clipboard,
  didJustSave = false,
  goBack,
}) => (
  <Main>
    <TopRow>
      <TopRowTitle>Clipboard Details</TopRowTitle>

      <IconCTA onClick={goBack} title="Edit your clipboard">
        <PenIcon width={18} height={18} color="gray" />
      </IconCTA>
    </TopRow>

    <Content>
      <Pre didJustSave={didJustSave}>{JSON.stringify(clipboard, null, 2)}</Pre>
    </Content>
  </Main>
)

export default View
