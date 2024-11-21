// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const defaultSuggestions = [
  {
    sectionLabel: 'Popular Searches',
    items: [
      {
        label: 'Booking',
        href: '/staff/booking',
        icon: 'ri-book-open-line'
      },
      {
        label: 'Customer',
        href: '/staff/customer',
        icon: 'ri-pie-chart-2-line'
      },
      {
        label: 'Game History',
        href: '/staff/game-history',
        icon: 'ri-list-unordered'
      },
      {
        label: 'Account Settings',
        href: '/admin/account-settings',
        icon: 'ri-file-user-line'
      }
    ]
  },
  {
    sectionLabel: 'Staff Interface',
    items: [
      {
        label: 'Booking',
        href: '/staff/booking',
        icon: 'ri-book-open-line'
      },
      {
        label: 'Customer',
        href: '/staff/customer',
        icon: 'ri-pie-chart-2-line'
      },
      {
        label: 'Game History',
        href: '/staff/game-history',
        icon: 'ri-list-unordered'
      },
      {
        label: 'Cafe History',
        href: '/staff/cafe-history',
        icon: 'ri-bar-chart-line'
      }
    ]
  },
  {
    sectionLabel: 'Admin Interface',
    items: [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: 'ri-bar-chart-line'
      },
      {
        label: 'Staff',
        href: '/admin/staff',
        icon: 'ri-user-line'
      },
      {
        label: 'Account Settings',
        href: '/admin/account-settings',
        icon: 'ri-file-user-line'
      },
      {
        label: 'Table',
        href: '/admin/store-settings/table',
        icon: 'ri-file-list-line'
      }
    ]
  },
  {
    sectionLabel: 'Store Settings',
    items: [
      {
        label: 'Table',
        href: '/admin/store-settings/table',
        icon: 'ri-file-list-line'
      },
      {
        label: 'Master',
        href: '/admin/store-settings/master',
        icon: 'ri-settings-2-line'
      },
      {
        label: 'Control',
        href: '/admin/store-settings/control',
        icon: 'ri-user-settings-line'
      },
      {
        label: 'Devices',
        href: '/admin/store-settings/devices',
        icon: 'ri-device-line'
      }
    ]
  }
]

const DefaultSuggestions = ({ setOpen }) => {
  // Hooks
  const { lang: locale } = useParams()
  const userDesignation = localStorage.getItem('userDesignation')

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => {
        if (userDesignation === 'Staff' && ['Admin Interface', 'Store Settings'].includes(section.sectionLabel)) {
          return <></>
        } else {
          return (
            <div
              key={index}
              className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
            >
              <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
                {section.sectionLabel}
              </p>
              <ul className='flex flex-col gap-4'>
                {section.items.map((item, i) => {
                  if (userDesignation === 'Staff' && !item.href.startsWith('/staff/')) {
                    return <></>
                  } else {
                    return (
                      <li key={i} className='flex'>
                        <Link
                          href={getLocalizedUrl(item.href, locale)}
                          className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                          onClick={() => setOpen(false)}
                        >
                          {item.icon && <i className={classnames(item.icon, 'flex text-xl')} />}
                          <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                        </Link>
                      </li>
                    )
                  }
                })}
              </ul>
            </div>
          )
        }
      })}
    </div>
  )
}

export default DefaultSuggestions
