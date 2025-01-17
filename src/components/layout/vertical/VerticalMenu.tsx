// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
  userDesignation?: string | null
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu, userDesignation }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label={dictionary['navigation'].staffInterface}>
          <MenuItem href={`/${locale}/staff/booking`}>{dictionary['navigation'].booking}</MenuItem>
          <MenuItem href={`/${locale}/staff/dues`}>{dictionary['navigation'].dues}</MenuItem>
          <MenuItem href={`/${locale}/staff/game-history`}>{dictionary['navigation'].gameHistory}</MenuItem>
          <MenuItem href={`/${locale}/staff/cafe-history`}>{dictionary['navigation'].cafeHistory}</MenuItem>
          <MenuItem href={`/${locale}/staff/customer`}>{dictionary['navigation'].customer}</MenuItem>
          <MenuItem href={`/${locale}/staff/customer/blacklisted`}>
            {dictionary['navigation'].blacklistedCustomer}
          </MenuItem>
        </MenuSection>

        {userDesignation !== 'Staff' ? (
          <MenuSection label={dictionary['navigation'].adminInterface}>
            <MenuItem href={`/${locale}/admin/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/admin/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
            <MenuItem href={`/${locale}/admin/expense`}>{dictionary['navigation'].expense}</MenuItem>
            <MenuItem href={`/${locale}/admin/staff`}>{dictionary['navigation'].staff}</MenuItem>

            <SubMenu label={dictionary['navigation'].cafeManagement} icon={<i className='ri-shopping-bag-3-line' />}>
              <MenuItem href={`/${locale}/admin/product-list`}>{dictionary['navigation'].productList}</MenuItem>
              <MenuItem href={`/${locale}/admin/new-product`}>{dictionary['navigation'].newProduct}</MenuItem>
            </SubMenu>

            {/* <SubMenu label={dictionary['navigation'].expense} icon={<i className='ri-bill-line' />}>
              <MenuItem href={`/${locale}/admin/expense/create-category`}>
                {dictionary['navigation'].createCategory}
              </MenuItem>
              <MenuItem href={`/${locale}/admin/expense/add`}>{dictionary['navigation'].addExpense}</MenuItem>
            </SubMenu> */}

            <SubMenu label={dictionary['navigation'].reports} icon={<i className='ri-file-chart-line' />}>
              <MenuItem href={`/${locale}/admin/reports/transaction`}>
                {dictionary['navigation'].transactionReport}
              </MenuItem>
              <MenuItem href={`/${locale}/admin/reports/collection`}>
                {dictionary['navigation'].collectionReport}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].storeSettings} icon={<i className='ri-shopping-bag-3-line' />}>
              <MenuItem href={`/${locale}/admin/store-settings/table`}>{dictionary['navigation'].table}</MenuItem>
              <MenuItem href={`/${locale}/admin/store-settings/master`}>{dictionary['navigation'].master}</MenuItem>
              <MenuItem href={`/${locale}/admin/store-settings/control`}>{dictionary['navigation'].control}</MenuItem>
              <MenuItem href={`/${locale}/admin/store-settings/devices`}>{dictionary['navigation'].devices}</MenuItem>
            </SubMenu>
            <MenuItem href={`/${locale}/admin/account-settings`}>{dictionary['navigation'].accountSettings}</MenuItem>
            {/* </MenuSection> */}
          </MenuSection>
        ) : (
          <></>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
