"use client"

import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxHeight?: string
  withShadows?: boolean
  hideScrollbar?: boolean
  autoHeight?: boolean
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ 
    children, 
    maxHeight = '300px', 
    withShadows = false, 
    hideScrollbar = false,
    autoHeight = false,
    className, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-auto relative',
          withShadows && 'scroll-shadow',
          hideScrollbar && 'hide-scrollbar',
          autoHeight ? 'max-h-full h-auto' : '',
          className
        )}
        style={{ 
          maxHeight: autoHeight ? 'none' : maxHeight,
          ...(props.style || {})
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }

// Usage example in components:
//
// <ScrollArea maxHeight="400px" withShadows={true}>
//   {/* Your scrollable content here */}
// </ScrollArea>
//
// Features:
// - Custom scrollbar styling that matches your design
// - Optional shadow indicators when content can be scrolled
// - Ability to hide scrollbar for cleaner designs
// - Configurable max height or auto-height
