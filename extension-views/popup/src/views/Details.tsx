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
  padding: 0 8px;
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 16px;

  &:focus-within {
    box-shadow: 0px 0px 0px 2px rgba(0, 102, 204, 1);
  }
`

const Content = styled.div`
  max-height: 480px;
  overflow: auto;
`

const SearchInput = styled.input`
  height: 24px;
  font-size: 14px;
  border-right: 0;
  outline: 0;
  border: 0;
  box-sizing: border-box;
`

const SearchIconContainer = styled.div`
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  outline: 0;
  background-color: white;
  box-sizing: border-box;
`

const ObjectRendererContainer = styled.div<{ color: string }>`
  margin-left: 0;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  ${props => `color: ${props.color}`};
`

const JSONRow = styled.div`
  width: fit-content;
  margin-left: 8px;

  &.highlight {
    background-color: #ffcc00;
  }
`

interface ArrayRendererProps {
  array: Record<string, any>
  searchVal: string
}

const ArrayRenderer: React.FunctionComponent<ArrayRendererProps> = ({
  array,
  searchVal,
}) => (
  <>
    {array.map((item: any) => {
      switch (typeof item) {
        case "string":
          return <JSONRow>"{item}",</JSONRow>

        case "number":
        case "boolean":
          return <JSONRow>{item},</JSONRow>

        case "object":
          if (item === null) {
            return <JSONRow>null,</JSONRow>
          }

          if (Array.isArray(item)) {
            return (
              <JSONRow>
                <div>{"["}</div>
                <ArrayRenderer array={item} searchVal={searchVal} />
                <div>{"],"}</div>
              </JSONRow>
            )
          }

          return (
            <JSONRow>
              <div>{"{"}</div>
              <ObjectRenderer obj={item} searchVal={searchVal} />
              <div>{"},"}</div>
            </JSONRow>
          )

        default:
          return null
      }
    })}
  </>
)

interface ObjectRendererProps {
  obj: Record<string, any>
  searchVal: string
}

const ObjectRenderer: React.FunctionComponent<ObjectRendererProps> = ({
  obj,
  searchVal,
}) => (
  <>
    {Object.keys(obj).map(key => {
      const val = obj[key]
      const className =
        searchVal.length > 2 &&
        key.toLowerCase().includes(searchVal.toLowerCase())
          ? "highlight"
          : ""

      switch (typeof val) {
        case "string":
          return (
            <JSONRow className={className}>
              <strong>{key}:</strong>&nbsp;"{val.toString()}",
            </JSONRow>
          )

        case "number":
        case "boolean":
          return (
            <JSONRow className={className}>
              <strong>{key}:</strong>&nbsp;{val.toString()},
            </JSONRow>
          )

        case "object":
          if (val === null) {
            return (
              <JSONRow className={className}>
                <strong>{key}:</strong>&nbsp;null,
              </JSONRow>
            )
          }

          if (Array.isArray(val)) {
            return (
              <JSONRow className={className}>
                <div>
                  {<strong>{key}:&nbsp;</strong>}
                  {"["}
                </div>
                <ArrayRenderer array={val} searchVal={searchVal} />
                <div>{`],`}</div>
              </JSONRow>
            )
          }

          return (
            <JSONRow className={className}>
              <div>
                {<strong>{key}:&nbsp;</strong>}
                {"{"}
              </div>
              <ObjectRenderer obj={val} searchVal={searchVal} />
              <div>{"},"}</div>
            </JSONRow>
          )

        default:
          return null
      }
    })}
  </>
)

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
  const [searchVal, setSearchVal] = React.useState<string>("")

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
            placeholder="Search here"
          />

          <SearchIconContainer>
            <SearchIcon width={18} height={18} color="gray" />
          </SearchIconContainer>
        </RightSide>
      </TopRow>

      <Content>
        <ObjectRendererContainer color={didJustSave ? "#009933" : "#333333"}>
          {typeof clipboard === "object" && Array.isArray(clipboard) && (
            <>
              {"["}
              <ArrayRenderer array={clipboard} searchVal={searchVal} />
              {"]"}
            </>
          )}
          {typeof clipboard === "object" && clipboard !== null && (
            <>
              {"{"}
              <ObjectRenderer obj={clipboard} searchVal={searchVal} />
              {"}"}
            </>
          )}
        </ObjectRendererContainer>
      </Content>
    </Main>
  )
}

export default View
