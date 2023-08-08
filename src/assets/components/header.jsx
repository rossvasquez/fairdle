import headerBackground from '../static/headerBackground.png'

import '../styles/header.css'

export default function Header() {

    return(
        <div className="relative h-20 w-screen bg-[#1c1c1c] flex justify-center items-center">
            <p className="textShadow relative z-20 text-[#ffffff] font-bold text-3xl">State Fair<span className="font-light">dle</span></p>
            <img src={headerBackground} className='max-w-xl border-b border-[#ffffff] w-screen mx-auto opacity-70 bottom-0 absolute left-0 right-0 z-10' />
        </div>
    )
}