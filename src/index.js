import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { Popper } from 'react-popper'

const modifiers = {
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 10,
  },
}

/**
 * Text component with tooltip support powered by Popper
 */
class Texty extends React.Component {
  state = {
    isHovered: false,
  }

  componentDidUpdate() {
    if (this.state.isHovered) {
      window.addEventListener('scroll', this.handleScroll, true)
      // react-virtualized-auto-sizer would trigger scroll events after tooltip shown in some case, we have to skip those scroll events
      this.listenTimer = setTimeout(() => {
        window.addEventListener('scroll', this.handleScroll, true)
        delete this.listenTimer
      }, 50)
    } else {
      this._clearListenTimer()
      window.removeEventListener('scroll', this.handleScroll, true)
    }
  }

  componentWillUnmount() {
    this._clearListenTimer()
    window.removeEventListener('scroll', this.handleScroll, true)
    this._clearShowTimer()
    this._clearHideTimer()
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      tagName: Tag,
      children,
      placement,
      // omit the following from rest
      innerRef,
      showDelay,
      hideDelay,
      tooltip,
      tooltipClassName,
      tooltipStyle,
      hideArrow,
      container,
      ...rest
    } = this.props
    /* eslint-enable no-unused-vars */

    if (!children) {
      return <Tag {...rest} ref={this.setTargetRef} data-texty={false} />
    }

    const target = this.targetNode
    const isTruncated = !!target && target.scrollWidth > target.offsetWidth
    const showTooltip = this.state.isHovered && isTruncated
    return (
      <Tag
        {...rest}
        ref={this.setTargetRef}
        data-texty={showTooltip}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
        {showTooltip && (
          <Popper
            referenceElement={target}
            placement={placement}
            modifiers={modifiers}
          >
            {this.renderTooltip}
          </Popper>
        )}
      </Tag>
    )
  }

  renderTooltip = ({ ref, style, placement, arrowProps }) => {
    const {
      children,
      container,
      tooltip,
      tooltipClassName,
      tooltipStyle,
      arrowClassName,
      hideArrow,
    } = this.props

    const content = tooltip || children

    return ReactDom.createPortal(
      <div
        ref={ref}
        data-texty-tooltip={placement}
        className={tooltipClassName}
        style={tooltipStyle ? { ...style, ...tooltipStyle } : style}
        onClick={this.handleMouseEvent}
        onDoubleClick={this.handleMouseEvent}
        onContextMenu={this.handleMouseEvent}
        onMouseDown={this.handleMouseEvent}
        onMouseUp={this.handleMouseEvent}
      >
        {content}
        {!hideArrow && (
          <div
            ref={arrowProps.ref}
            data-texty-arrow={placement}
            className={arrowClassName}
            style={arrowProps.style}
          />
        )}
      </div>,
      container || this.targetNode.ownerDocument.body
    )
  }

  setTargetRef = ref => {
    this.props.innerRef && this.props.innerRef(ref)
    this.targetNode = ref
  }

  handleMouseEvent = e => {
    e.stopPropagation()
  }

  handleScroll = e => {
    this.setState({ isHovered: false })
  }

  _clearListenTimer() {
    if (this.listenTimer) {
      clearTimeout(this.listenTimer)
      delete this.listenTimer
    }
  }

  _clearShowTimer() {
    if (this.showTimer) {
      clearTimeout(this.showTimer)
      delete this.showTimer
    }
  }

  _clearHideTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      delete this.hideTimer
    }
  }

  handleMouseEnter = e => {
    // eslint-disable-next-line react/prop-types
    const { showDelay, onMouseEnter } = this.props
    onMouseEnter && onMouseEnter(e)

    this._clearHideTimer()

    if (!showDelay) {
      this.setState({ isHovered: true })
      return
    }

    this.showTimer = setTimeout(() => {
      this.setState({ isHovered: true })
      delete this.showTimer
    }, showDelay)
  }

  handleMouseLeave = e => {
    // eslint-disable-next-line react/prop-types
    const { hideDelay, onMouseLeave } = this.props
    onMouseLeave && onMouseLeave(e)

    this._clearShowTimer()

    const { isHovered } = this.state
    if (!isHovered) return

    if (!hideDelay) {
      this.setState({ isHovered: false })
      return
    }

    this.hideTimer = setTimeout(() => {
      this.setState({ isHovered: false })
      delete this.hideTimer
    }, hideDelay)
  }
}

Texty.defaultProps = {
  tagName: 'div',
  showDelay: 150,
  hideDelay: 150,
  hideArrow: false,
  placement: 'top',
}

Texty.propTypes = {
  /**
   * Get inner ref of the component
   */
  innerRef: PropTypes.func,
  /**
   * Tag name for the component
   */
  tagName: PropTypes.string,
  /**
   * Should be string or inline element
   */
  children: PropTypes.node,
  /**
   * Tooltip for the truncated text if set, or the children will be used
   */
  tooltip: PropTypes.node,
  /**
   * Classname for the tooltip
   */
  tooltipClassName: PropTypes.string,
  /**
   * Custom style of the tooltip
   */
  tooltipStyle: PropTypes.object,
  /**
   * Delay milliseconds to show when mouse enter
   */
  showDelay: PropTypes.number,
  /**
   * Delay milliseconds to hide when mouse leave
   */
  hideDelay: PropTypes.number,
  /**
   * Classname for the arrow
   */
  arrowClassName: PropTypes.string,
  /**
   * Whether to show the tooltip arrow
   */
  hideArrow: PropTypes.bool,
  /**
   * The placement of the tooltip
   */
  placement: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
  ]),
  /**
   * The HTML Element to append the tooltip **In most cases you don't need to set it manually**
   */
  container: PropTypes.instanceOf(
    typeof Element !== 'undefined' ? Element : Object
  ),
}

export default Texty
