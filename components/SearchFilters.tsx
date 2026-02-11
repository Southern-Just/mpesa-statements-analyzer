"use client"

import { FILTERS } from '@/lib/utils'
import { FilterType } from '@/types'
import { useState } from 'react'

const SearchFilters = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('name')

  const isDate = activeFilter === 'date'
  const isDateRange = activeFilter === 'dateRange'

  const dateInputClass =
    "flex-1 bg-transparent px-2 py-2 text-sm text-gray-600 focus:outline-none " +
    "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z'/%3E%3C/svg%3E\")] " +
    "bg-no-repeat bg-[length:14px] bg-[position:10px_center]"

  return (
    <div className="w-96 rounded-2xl bg-white p-6 shadow-lg">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
        Search & Filter Transactions BY:
      </p>

      <div className="mb-5 ml-12 flex w-65 flex-wrap justify-center gap-2">
        {FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeFilter === filter.value
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {(isDate || isDateRange) ? (
        <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-gray-600">
          <div className="flex flex-1 border-r border-gray-900">
            <input type="date" className={dateInputClass} />
            {isDateRange && (
              <input type="date" className={dateInputClass} />
            )}
          </div>
          <button className="bg-black px-4 text-xs font-medium text-white transition hover:bg-gray-800">
            Search
          </button>
        </div>
      ) : (
        <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-gray-600">
          <input
            type={activeFilter === 'amount' ? 'number' : 'text'}
            placeholder={`Search by ${FILTERS.find(f => f.value === activeFilter)?.label}`}
            className="flex-1 px-3 py-2 text-sm text-gray-600 focus:outline-none"
          />
          <button className="bg-black px-4 text-xs font-medium text-white transition hover:bg-gray-800">
            Search
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
