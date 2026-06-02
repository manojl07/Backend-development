import React from 'react'

const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className='border p-2 rounded'
    >
      <option value="createdAt">Newest</option>
      <option value="price">Price</option>
      <option value="rating">Rating</option>
    </select>
  )
}

export default SortDropdown