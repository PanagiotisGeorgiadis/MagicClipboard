import styled from "@emotion/styled"

export const IconCTA = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  outline: 0;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

export const TopRow = styled.section`
  height: 40px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
`

export const TopRowTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  text-align: center;
  font-family: "Roboto", sans-serif;
`
