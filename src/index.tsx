import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  CSSProperties,
  Ref,
} from 'react'
import ReactDOM from 'react-dom'
import { Popper } from 'react-popper'

// Define types for the children props of Popper component
type PopperChildrenProps = {
  ref: Ref<HTMLElement>
  style: CSSProperties
  placement: string
  arrowProps: {
    ref: Ref<HTMLElement>
    style: CSSProperties
  }
  arrowClassName?: string
}

// Define the props for the Texty component with a generic type for tagName
interface TextyProps<T extends keyof JSX.IntrinsicElements> {
  /**
   * Get inner ref of the component
   */
  innerRef?: (e: HTMLDivElement | null) => void
  /**
   * Tag name for the component
   */
  tagName?: T
  /**
   * Should be string or inline element
   */
  children?: ReactNode
  /**
   * Tooltip for the truncated text if set, or the children will be used
   */
  tooltip?: ReactNode
  /**
   * Classname for the tooltip
   */
  tooltipClassName?: string
  /**
   * Custom style of the tooltip
   */
  tooltipStyle?: CSSProperties
  /**
   * Max width of the tooltip
   */
  tooltipMaxWidth?: number
  /**
   * Delay milliseconds to show when mouse enter
   */
  showDelay?: number
  /**
   * Delay milliseconds to hide when mouse leave
   */
  hideDelay?: number
  /**
   * Classname for the arrow
   */
  arrowClassName?: string
  /**
   * Whether to show the tooltip arrow
   */
  hideArrow?: boolean
  /**
   * The placement of the tooltip
   */
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
  /**
   * The HTML Element to append the tooltip **In most cases you don't need to set it manually**
   */
  container?: Element | null
}

// Define modifiers for the Popper component to prevent overflow
const modifiers = [
  {
    name: 'preventOverflow',
    options: {
      boundary: 'viewport',
      padding: 10,
    },
  },
]

// The Texty component definition
function Texty<T extends keyof JSX.IntrinsicElements = 'div'>({
  tagName: Tag = 'div' as T,
  children,
  placement = 'top',
  innerRef,
  showDelay = 150,
  hideDelay = 150,
  tooltip,
  tooltipClassName,
  tooltipStyle,
  tooltipMaxWidth,
  hideArrow = false,
  container,
  ...rest
}: TextyProps<T> & Omit<JSX.IntrinsicElements[T], 'ref'>) {
  // State to manage hover status
  const [isHovered, setIsHovered] = useState<boolean>(false)

  // Refs for the target element and timers
  const targetNodeRef = useRef<HTMLElement | null>(null)
  const showTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const listenTimerRef = useRef<number | null>(null)

  // Effect to handle scroll events and cleanup
  useEffect(() => {
    const handleScroll = () => setIsHovered(false)

    if (isHovered) {
      window.addEventListener('scroll', handleScroll, true)
      listenTimerRef.current = window.setTimeout(() => {
        window.addEventListener('scroll', handleScroll, true)
      }, 50)
    } else {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current)
      window.removeEventListener('scroll', handleScroll, true)
    }

    return () => {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current)
      if (showTimerRef.current) clearTimeout(showTimerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isHovered])

  // Handlers for mouse enter and leave events
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    innerRef?.(e.currentTarget)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    showTimerRef.current = window.setTimeout(
      () => setIsHovered(true),
      showDelay
    )
  }

  const handleMouseLeave = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    hideTimerRef.current = window.setTimeout(
      () => setIsHovered(false),
      hideDelay
    )
  }

  // Prevents event propagation for tooltip interactions
  const handleMouseEvent = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Renders the tooltip using ReactDOM.createPortal for better positioning
  const renderTooltip = (props: PopperChildrenProps) => {
    const { ref, style, placement, arrowProps, arrowClassName } = props
    const content = tooltip || children
    const extraStyle = tooltipMaxWidth
      ? { ...tooltipStyle, maxWidth: tooltipMaxWidth }
      : tooltipStyle

    return ReactDOM.createPortal(
      <div
        ref={ref as Ref<HTMLDivElement>}
        data-texty-tooltip={placement}
        className={tooltipClassName}
        style={extraStyle ? { ...style, ...extraStyle } : style}
        onClick={handleMouseEvent}
        onDoubleClick={handleMouseEvent}
        onContextMenu={handleMouseEvent}
        onMouseDown={handleMouseEvent}
        onMouseUp={handleMouseEvent}
      >
        {content}
        {!hideArrow && (
          <div
            ref={arrowProps.ref as Ref<HTMLDivElement>}
            data-texty-arrow={placement}
            className={arrowClassName}
            style={arrowProps.style}
          />
        )}
      </div>,
      container || document.body
    )
  }

  // Check if the target element is truncated to decide on showing the tooltip
  const target = targetNodeRef.current
  const isTruncated = !!target && target.scrollWidth > target.offsetWidth
  const showTooltip = isHovered && isTruncated

  // Prepare props for the Tag element
  const elementProps = {
    ...rest,
    'data-texty': showTooltip,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }

  // Render the Tag element with children and potentially a tooltip
  return React.createElement(
    Tag as React.ElementType,
    {
      ...elementProps,
      ref: targetNodeRef,
    },
    <>
      {children}
      {showTooltip && (
        <Popper
          referenceElement={target}
          placement={placement}
          modifiers={modifiers}
        >
          {({ ref, style, placement, arrowProps }) =>
            renderTooltip({ ref, style, placement, arrowProps })
          }
        </Popper>
      )}
    </>
  )
}

export default Texty
