import React from 'react'

export const Page = () => {
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if
    }
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleLogin} className='bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-md'>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">Login</h2>

        </form>
    </section>
  )
}
