import React from 'react'

export const Buttons = () => {
    return (
        <>
            <div className="mx-6  items-center justify-between pt-4">

                <a href='/rotate'>
                    <button className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                        type="button">
                        Rotate
  </button>
                </a>
            </div>

            <div className="mx-6  items-center justify-between pt-4">
                <a href='/split'>
                    <button
                        className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                        type="button"
                    >
                        Split
  </button>
                </a>
            </div>
            <div className="mx-6  items-center justify-between pt-4">
                <a href='/crop'>

                    <button
                        className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                        type="button"
                    >
                        Crop
                </button>
                </a>
            </div>
            <div className="mx-6  items-center justify-between pt-4">
                <a href='/merge'>
                    <button
                        className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                        type="button"
                    >
                        Merge
                    </button>
                </a>
            </div>
            <div className="mx-6  items-center justify-between pt-4">
                <a href='/convert'>
                    <button
                        className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                        type="button"
                    >
                        Convert
  </button>
                </a>
            </div>

        </>
    )
}
