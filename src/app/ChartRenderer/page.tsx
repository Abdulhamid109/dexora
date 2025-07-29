"use client"
import Navbar from '@/components/navbar'
import Link from 'next/link'
import React, { Suspense } from 'react'

const ChartRenderer = () => {
  return (
    <Suspense fallback="Hold on loading">
      <Navbar />
      <section>
        <h2 className='font-bold text-4xl text-center p-10'>Data insight Modules represented in Visualization formats through charts</h2>
        <div className="p-10 space-y-10">
          <div>
            <strong className="underline text-2xl tracking-tight text-gray-500">Charts</strong>
            <ul className="flex justify-around mt-6">
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                <Link href={"/barChartRenderer"}>Bar Chart</Link>
              </li>
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                <Link href={"/pieChartRenderer"}>Pie Chart</Link>
              </li>
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                Line Chart
              </li>
            </ul>
          </div>

          <div>
            <strong className="underline text-2xl tracking-tight text-gray-500">Plot</strong>
            <ul className="flex justify-around mt-6">
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                BoxPlot
              </li>
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                Scatter Plot
              </li>
              <li className="px-6 py-3 rounded-md bg-red-700 text-white hover:bg-red-800 cursor-pointer text-center">
                Histogram Plot
              </li>
            </ul>
          </div>
        </div>

      </section>
    </Suspense>
  )
}

export default ChartRenderer