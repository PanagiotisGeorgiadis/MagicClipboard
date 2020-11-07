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

const SearchButton = styled.button`
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

const JSONRow = styled.div`
  width: fit-content;
  margin-left: 8px;
  font-size: 14px;
  font-family: "Roboto", sans-serif;

  &.highlight {
    background-color: #ffcc00;
  }
`

const TopJSONRow = styled(JSONRow)`
  margin-left: 0;
`

interface ObjectRendererProps {
  obj: object
  searchVal: string
  hideKey?: boolean
}

const ObjectRenderer: React.FunctionComponent<ObjectRendererProps> = ({
  obj,
  searchVal = "",
  hideKey = false,
}) => (
  <>
    {Object.keys(obj).map(key => {
      const val = obj[key]
      const className =
        searchVal.length > 2 &&
        key.toLowerCase().includes(searchVal.toLowerCase())
          ? "highlight"
          : ""

      return (
        <JSONRow className={className}>
          {(() => {
            switch (typeof val) {
              case "string":
              case "number":
              case "boolean":
                return (
                  <>
                    <strong>{key}:</strong>&nbsp;"{val.toString()}",
                  </>
                )

              case "object":
                if (Array.isArray(val)) {
                  return (
                    <>
                      <div>{!hideKey && <strong>{key}:&nbsp;</strong>}[</div>

                      {val.map(item => {
                        switch (typeof item) {
                          case "string":
                          case "number":
                          case "boolean":
                            return <JSONRow>{item},</JSONRow>

                          case "object":
                            if (Array.isArray(item)) {
                              return (
                                <ObjectRenderer
                                  obj={[item]}
                                  searchVal={searchVal}
                                  hideKey={true}
                                />
                              )
                            } else {
                              return (
                                <ObjectRenderer
                                  obj={{ item }}
                                  searchVal={searchVal}
                                  hideKey={true}
                                />
                              )
                            }

                          default:
                            return null
                        }
                      })}

                      <div>{`],`}</div>
                    </>
                  )
                } else {
                  return (
                    <>
                      <div>
                        {!hideKey && <strong>{key}:&nbsp;</strong>}
                        {"{"}
                      </div>
                      <ObjectRenderer obj={val} searchVal={searchVal} />
                      <div>{"},"}</div>
                    </>
                  )
                }

              default:
                return null
            }
          })()}
        </JSONRow>
      )
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
  const [searchVal, setSearchVal] = React.useState<string>()

  const [openTag, closeTag] = (() => {
    switch (typeof clipboard) {
      case "object":
        if (Array.isArray(clipboard)) {
          return ["[", "]"]
        } else {
          return ["{", "}"]
        }
      default:
        return ""
    }
  })()

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
            placeholder="Search here"
          />
          <SearchButton>
            <SearchIcon width={18} height={18} color="gray" />
          </SearchButton>
        </RightSide>
      </TopRow>

      <Content>
        <TopJSONRow>
          {openTag}
          <ObjectRenderer obj={clipboard} searchVal={searchVal} />
          {closeTag}
        </TopJSONRow>
      </Content>
    </Main>
  )
}

export default View
