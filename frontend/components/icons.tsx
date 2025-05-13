"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  spinner: (props: IconProps) => <Loader2 className="animate-spin" {...props} />,
} 