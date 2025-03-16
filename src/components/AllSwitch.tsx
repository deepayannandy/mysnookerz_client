import { useEffect, useState } from 'react'

const AllSwitch = ({ value: initialValue, onChange }: { value: boolean; onChange: (value: boolean) => void }) => {
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
      className='flex items-center relative cursor-pointer select-none w-40 h-10'
      style={{ containerType: 'inline-size' }}
    >
      <input
        type='checkbox'
        checked={value}
        onChange={handleChange}
        className='appearance-none transition-colors cursor-pointer size-full rounded-full bg-[#2e2e2e] checked:bg-[#ffcc00a5] peer checked:shadow-[2px_2px_14px_6px_#ffcc00a5]'
      />
      <div
        className={`w-full h-full rounded-full absolute grid place-items-center bg-[#2e2e2e] peer-checked:bg-[#ffcc00a5] text-white font-bold checked:shadow-[2px_2px_14px_6px_#ffcc00a5]`}
      >
        <span className='flex items-center gap-3'>
          <i className='ri-shut-down-line size-6'></i>
          {`All Switch ${value ? 'On' : 'Off'}`}
        </span>
      </div>
    </label>
  )
}

export default AllSwitch
