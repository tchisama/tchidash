import React from 'react'
import DashboardUiProvider from '../components/DashboardUiProvider'

type Props = {
  children: React.ReactNode
}

function layout({children}: Props) {
  return (
    <div>
      <DashboardUiProvider>
        {children}
      </DashboardUiProvider>
    </div>
  )
}

export default layout