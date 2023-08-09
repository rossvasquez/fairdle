import headerBackground from '../static/headerBackground.png'

import { useState } from 'react'

import '../styles/header.css'

export default function Header() {

    const [ShowAbout, setShowAbout] = useState(false)

    const About = () =>
    <div className="absolute bg-[#404040] w-[22.5rem] pb-[130%] max-h-[10rem] top-24 bottom-10 mx-auto left-0 right-0 rounded-lg shadow-lg z-30 px-6 py-4">
        <div onClick={() => setShowAbout(false)} className='absolute right-6 top-1.5 text-white text-3xl font-semibold'>x</div>
        <p className="text-white text-3xl font-bold mt-4">How To Play</p>
        <p className="text-white text-md mt-1 font-normal">Guess the State Fair related word in 6 tries.</p>
        <p className="text-white text-xl mt-8 font-semibold">Upon Guessing...</p>
        <p>If a letter is green, it is in the correct spot.</p>
        <p>If a letter is yellow, it is not in the correct spot, but exists in the word.</p>
        <p>If a letter is grey, it does not exist in the word.</p>
        <p>A new word will be available for each day of the State Fair.</p>
        <a href="https://rossvasquez.netlify.app" target='_blank'>Created By</a>
    </div>

    return(
        <div className="relative h-20 w-screen bg-[#1c1c1c] flex items-center max-w-xl mx-auto">
            <p className="textShadow relative z-20 text-[#ffffff] font-bold text-3xl pb-1 pl-4">State Fair<span className="font-light">dle</span></p>
            {ShowAbout ? null : <div onClick={() => setShowAbout(true)} className='hover:cursor-pointer active:bg-opacity-90 absolute flex items-center justify-center text-3xl font-extrabold text-[#ffffff] bg-opacity-70 pb-1 right-4 shadow-lg h-12 w-12 rounded-full bg-[#404040] z-20'>?</div> }
            <img src={headerBackground} className='shadow-lg w-screen mx-auto opacity-80 bottom-0 absolute left-0 right-0 z-10' />
            {ShowAbout ? <About /> : null}
        </div>
    )
}