import { useEffect, useState } from 'react'

const OnOffSwitch = ({ value: initialValue, onChange }: { value: boolean; onChange: (value: boolean) => void }) => {
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
      className='flex items-center relative cursor-pointer select-none w-20 h-10'
      style={{ containerType: 'inline-size' }}
    >
      <input
        type='checkbox'
        checked={value}
        onChange={handleChange}
        className='appearance-none transition-colors cursor-pointer size-full rounded-full bg-gray-500 checked:bg-[#ffff0044] peer'
      />

      <div
        className={`w-8 h-8 absolute rounded-full transform transition-transform duration-500 peer-checked:bg-[#ffcc00c4] bg-[#f44336] grid place-items-center peer-checked:translate-x-[calc(100cqw-100%-8px)] p-px ml-1 `}
      >
        <span className={`absolute text-[12px] font-bold ${value ? 'text-black' : 'text-white'}`}>
          {value ? 'ON' : 'OFF'}
        </span>
      </div>
    </label>
    // <label className='relative inline-block w-16 h-8'>
    //   <input type='checkbox' checked={value} onChange={handleChange} className='appearance-none peer hidden' />
    //   <div className='w-full h-full bg-gray-500 rounded-full transition-colors peer-checked:bg-[#ffff0044] relative flex items-center'>
    //     <span className='absolute left-2 text-white text-xs peer-checked:hidden'>OFF</span>
    //     <span className='absolute right-2 text-white text-xs hidden peer-checked:block'>ON</span>
    //     <div className='w-8 h-8 bg-[#f44336] peer-checked:bg-[#ffcc00c4] rounded-full transition-transform peer-checked:translate-x-8'></div>
    //   </div>
    // </label>
  )
}

export default OnOffSwitch
