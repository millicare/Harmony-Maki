import React, { useState, useRef } from 'react'
import { Input } from 'uikit'
import styled from 'styled-components'


const Container = styled.div<{ toggled: boolean }>``

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <Container toggled={toggled}>
      
    </Container>
  )
}

export default SearchInput
