import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
     <section className="w-[100vw] bg-zinc-300">
        <nav className="flex shadow-lg shadow-amber-600">
          <h1 className="flex p-4 justify-start items-start text-2xl font-bold text-yellow-600">
            <Link href={"/"}>Dexora</Link>
          </h1>
          <ul className="w-[100vw] p-4 flex justify-end items-end gap-4">
            <li>
              About us
            </li>
            <li>
              Pricings
            </li>
            <li>
              Login
            </li>
          </ul>
        </nav>
      </section>
  )
}

export default Navbar