import React from "react"

import styled from "@emotion/styled"

import { PenIcon, SearchIcon } from "../components/Icons"
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

const EditCTA = styled(IconCTA)`
  margin-right: 4px;
`

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`

const RightSide = styled.div`
  display: flex;
  align-items: center;

  &:focus-within {
    outline: 1px solid black;
  }
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

const SearchInput = styled.input`
  height: 24px;
  font-size: 14px;
  border-right: 0;
  outline: 0;
  border: 1px solid lightgray;
  border-right: 0;
  box-sizing: border-box;
`

const SearchButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgray;
  border-left: 0;
  outline: 0;
  background-color: white;
  box-sizing: border-box;
  cursor: pointer;
`

const flattenObject = (
  obj: Record<string, any>,
  parent: string = "",
  res: Record<string, any> = {}
) => {
  for (let key in obj) {
    let propName = parent ? `${parent}_${key}` : key
    if (typeof obj[key] === "object") {
      flattenObject(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

interface Props {
  clipboard: JSON
  didJustSave?: boolean
  goBack: () => void
}

const View: React.FunctionComponent<Props> = ({
  clipboard,
  didJustSave = false,
  goBack,
}) => {
  const [searchVal, setSearchVal] = React.useState<string>()

  return (
    <Main>
      <TopRow>
        <LeftSide>
          <EditCTA onClick={goBack} title="Edit your clipboard">
            <PenIcon width={18} height={18} color="#FFAA00" />
          </EditCTA>

          <TopRowTitle>Saved clipboard details</TopRowTitle>
        </LeftSide>

        <RightSide>
          <SearchInput
            type="text"
            value={searchVal}
            onChange={evt => setSearchVal(evt.target.value)}
            onKeyDown={evt => {
              if (evt.key === "Enter") {
                // TODO: Search
              }
            }}
          />
          <SearchButton>
            <SearchIcon width={18} height={18} color="gray" />
          </SearchButton>
        </RightSide>
      </TopRow>

      <Content>
        <Pre id="content" didJustSave={didJustSave}>
          {JSON.stringify(clipboard, null, 2)}
        </Pre>
      </Content>
    </Main>
  )
}

export default View
