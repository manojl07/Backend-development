import React from 'react'

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder='Search products...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='border p-2 rounded w-full'
    />
  )
}

export default SearchBar