import React, { useEffect } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {}

function BreadcrumbCom({}: Props) {
  const pathname = usePathname()
  const [path, setPath] = React.useState<string[]>([])
  useEffect(() => {
    setPath(pathname?.split('/'))
  },[pathname])
  return (
<Breadcrumb className="hidden md:flex ">
              <BreadcrumbList>
              {
                path?.map((item, index) => (
                  <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink asChild>
                      <Link className='' href={`/${item}`}>{item}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {
                    index < path.length - 1 && index !== 0 &&
                    <BreadcrumbSeparator key={index}>/</BreadcrumbSeparator>
                  }
                  </>
                ))
              }
              </BreadcrumbList>
            </Breadcrumb>
  )
}

export default BreadcrumbCom