import React from "react"

import styled from "@emotion/styled"
import { IconCTA, TopRow, TopRowTitle } from "../components/Shared"
import { PenIcon } from "../components/Icons"

const Main = styled.main`
  width: 480px;
`

const Content = styled.div`
  max-height: 480px;
  overflow: auto;
`

const Pre = styled.pre`
  font-size: 14px;
  font-family: "Roboto", sans-serif;
`

interface Props {
  clipboard: JSON
  goBack: () => void
}

const View: React.FunctionComponent<Props> = ({ clipboard, goBack }) => (
  <Main>
    <TopRow>
      <TopRowTitle>Clipboard Details</TopRowTitle>

      <IconCTA onClick={goBack} title="Edit your clipboard">
        <PenIcon width={18} height={18} color="gray" />
      </IconCTA>
    </TopRow>

    <Content>
      <Pre>{JSON.stringify(clipboard, null, 2)}</Pre>
    </Content>
  </Main>
)

export default View
