import React from 'react'
import Protected from './components/Protected'

type Props = {
  children: React.ReactNode
}
function layout({children}: Props) {
  return (
    <div>
      <Protected>
      {children}
      </Protected>
    </div>
  )
}

export default layout