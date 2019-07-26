import React from 'react'
import Text from 'react-texty'

import Layout from '../components/Layout'

const Page = () => (
  <Layout>
    <h1>react-texty</h1>
    <Text>I'm not truncated so there is no tooltip.</Text>
    <Text>I'm too long to show, so there is tooltip for the full content.</Text>
    <Text tagName="a" href="/">
      <b>tagName="a": </b>I'm too long to show, so there is tooltip for the full
      content.
    </Text>
    <Text tooltip="foo">
      <b>tooltip="foo": </b>I'm too long to show, so there is tooltip for the
      full content.
    </Text>
    <Text tooltipClassName="steelblue">
      <b>tooltipClassName: </b>I'm too long to show, so there is tooltip for the
      full content.
    </Text>
    <Text tooltipStyle={{ color: 'red' }}>
      <b>tooltipStyle={`{ color: 'red' }`}: </b>I'm too long to show, so there is
      tooltip for the full content.
    </Text>
    <Text showDelay={1000}>
      <b>showDelay=1000: </b>I'm too long to show, so there is tooltip for the
      full content.
    </Text>
    <Text hideDelay={1000}>
      <b>hideDelay=1000: </b>I'm too long to show, so there is tooltip for the
      full content.
    </Text>
    <Text hideArrow>
      <b>hideArrow: </b>I'm too long to show, so there is tooltip for the full
      content.
    </Text>
    <Text placement="bottom">
      <b>placement="bottom": </b>I'm too long to show, so there is tooltip for
      the full content.
    </Text>
    <Text placement="bottom-start">
      <b>placement="bottom-start": </b>I'm too long to show, so there is tooltip
      for the full content.
    </Text>
    <Text placement="bottom-end">
      <b>placement="bottom-end": </b>I'm too long to show, so there is tooltip
      for the full content.
    </Text>
  </Layout>
)

export default Page
