import React from 'react'

const Skeleton = () => {
  return (
    <div className='animate-pulse border rounded p-4 h-32'>
      <div className='bg-gray-300 h-4 mb-4 rounded'></div>
      <div className='bg-gray-300 h-4 mb-4 rounded'></div>
      <div className='bg-gray-300 h-4 rounded'></div>
    </div>
  )
}

export default Skeleton