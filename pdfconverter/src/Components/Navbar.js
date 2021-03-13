import React from 'react'

export const Navbar = () => {
    return (
        <div>
            <div className="w-full container mx-auto">
                <div className="w-full flex items-center justify-between">
                    <a
                        className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                        href="#"
                    >
                        PDF
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                            Converter
                </span>
                    </a>

                    <div className="flex w-1/2 justify-end content-center">
                        <a
                            className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
                            href="https://github.com/Bhavik-Ardeshna/PDFConverter"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" className="fill-current h-6" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>

                    </div>
                </div>
            </div>
        </div>
    )
}
