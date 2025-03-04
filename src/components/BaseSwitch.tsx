import { useEffect, useState } from 'react'

const BaseSwitch = ({ value: initialValue, onChange }: { value: boolean; onChange: (value: boolean) => void }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = () => {
    const newValue = !value
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <label
      className='flex items-center relative cursor-pointer select-none w-[70px] h-5'
      style={{ containerType: 'inline-size' }}
    >
      <input
        type='checkbox'
        checked={value}
        onChange={handleChange}
        className='appearance-none transition-colors cursor-pointer size-full rounded-full bg-red-500 checked:bg-green-500 peer'
      />
      <span className='absolute font-medium text-[9px] uppercase right-0 text-white peer-checked:hidden mr-1'>
        DISABLED
      </span>
      <span className='absolute font-medium text-[9px] uppercase left-0 text-white peer-checked:block hidden ml-1'>
        ENABLED
      </span>
      <div
        className={`w-5 h-5 absolute rounded-full transform transition-transform bg-gray-950/60 grid place-items-center peer-checked:translate-x-[calc(100cqw-100%)] peer-checked:text-green-500 text-red-500 p-1`}
      >
        <i className='ri-shut-down-line size-full'></i>
      </div>
    </label>
  )
}

export default BaseSwitch
