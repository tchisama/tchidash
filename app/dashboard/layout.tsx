import React from 'react'
import DashboardUiProvider from './components/DashboardUiProvider'

type Props = {
  children: React.ReactNode
}

function layout({children}: Props) {
  return (
    <body>
      <DashboardUiProvider>
        {children}
      </DashboardUiProvider>
    </body>
  )
}

export default layout