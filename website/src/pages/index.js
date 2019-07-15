import React from "react"
import styled from "styled-components"
import Text from "react-texty"
import "react-texty/styles.css"

import Layout from "../components/Layout"

const Container = styled.div`
  width: 100px;
  margin: 20% auto;
`

const Page = () => (
  <Layout>
    <Container>
      <Text>
        Text component with tooltip support powered by Popper
      </Text>
    </Container>
  </Layout>
)

export default Page
