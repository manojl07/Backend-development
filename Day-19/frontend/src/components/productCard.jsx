import React from 'react'

const ProductCard = ({ product }) => {
  return (
    <div className='border rounded p-4'>
      <h2 className='font-bold text-lg'>{product.title}</h2>
      <p>{product.brand}</p>
      <p>{product.category}</p>
      <p>{product.price}</p>
      <p>⭐ {product.rating}</p>
    </div>
  )
}

export default ProductCard