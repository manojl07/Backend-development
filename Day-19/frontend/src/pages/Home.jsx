import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import useDebounce from '../hooks/useDebouncs';
import { getProducts } from '../services/product.service';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import SortDropdown from '../components/SortDropdown';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/productCard';
import Pagination from '../components/pagination';

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const debouncedSearch = useDebounce(search)

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, debouncedSearch, category, sortBy],
    queryFn: () => getProducts({ page, limit: 9, search: debouncedSearch, category, sortBy }),
    keepPreviousData: true,
  })


  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='flex gap-4 mb-6'>
        <SearchBar value={search} onChange={setSearch} />
        <Filters category={category} setCategory={setCategory} />
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} />
          ))
          : data?.products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      <Pagination page={page} totalPages={data?.pagination?.totalPages || 1} setPage={setPage} />
    </div>
  )
}

export default Home