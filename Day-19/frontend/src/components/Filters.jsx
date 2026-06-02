import React from 'react'

const Filters = ({ category, setCategory }) => {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className='border p-2 rounded'
    >
      <option value="">All</option>
      <option value="Laptop">Laptop</option>
      <option value="Phone">Phone</option>
      <option value="Watch">Watch</option>
    </select>
  )
}

export default Filters