import React, { useEffect } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from 'lucide-react'


function BreadcrumbCom() {
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
                      <Link className='' href={`${path.slice(0, index + 1).join('/')}`}>{item}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {
                    index < path.length - 1 && index !== 0 &&
                    <BreadcrumbSeparator key={index}>
                      <ChevronRightIcon size={28}/>
                    </BreadcrumbSeparator>
                  }
                  </>
                ))
              }
              </BreadcrumbList>
            </Breadcrumb>
  )
}

export default BreadcrumbCom