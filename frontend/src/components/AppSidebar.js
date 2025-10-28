import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')
  return (
    <CSidebar
      className="border-end"
      colorScheme={colorMode}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="sidebar-header-custom">
        <div className="sidebar-header-content">
          <CSidebarBrand to="/" className="sidebar-brand-custom">
            <div className="sidebar-brand-full">
              <strong>UCF Global</strong>
            </div>
          </CSidebarBrand>
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </div>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter style={{ minHeight: 'auto' }}>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)