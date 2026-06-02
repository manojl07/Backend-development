import React from 'react'

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className='flex gap-3 justify-center mt-6'>
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className='border px-4 py-2 rounded'
      >Prev</button>
      <span>{page} / {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className='border px-4 py-2 rounded'
      >Next</button>
    </div>
  )
}

export default Pagination