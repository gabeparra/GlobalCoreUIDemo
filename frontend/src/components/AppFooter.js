import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.ucf.edu" target="_blank" rel="noopener noreferrer">
          UCF Global
        </a>
        <span className="ms-1">&copy; {new Date().getFullYear()} University of Central Florida.</span>
      </div>
      <div className="ms-auto">
        <span>All rights reserved</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)