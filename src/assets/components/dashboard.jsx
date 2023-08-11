import arrow from '../static/arrow.png'

import { supabase } from "../../supabaseClient" 

import { useState, useEffect } from 'react'

export default function Dashboard({OnClick}) {

    const [Words, setWords] = useState([])

    const [Pageviews, setPageviews] = useState([])

    const [Dates, setDates] = useState([])

    const [CurrentPos, setCurrentPos] = useState(0)

    const [Percents, setPercents] = useState([[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],])

    useEffect(() => {
        const getWordData = async () => {
            let words = []
            const { data } = await supabase
                .from('daily_words')
                .select('word')
            
            for (let i=0;i<data.length;i++) {
                words.push(data[i].word)
            }
            setWords(words)
        }
        getWordData()
    }, [])

    useEffect(() => {
        const getPageviews = async () => {
            let views = []
            const { data } = await supabase
                .from('traffic_counter')
                .select('visitors')
                .order('id')
            
            for (let i=0;i<data.length;i++) {
                views.push(data[i].visitors)
            }
            setPageviews(views)
        }
        getPageviews()
    }, [])

    useEffect(() => {
        const getPercents = async () => {
            let percents = []
            const { data } = await supabase
                .from('guesses')
                .select('correct, incorrect')
                .order('id')
            
            for(let i=0;i<data.length;i++) {
                let percentRow=[]
                let total = 0
                let arr = JSON.parse(data[i].correct)
                console.log(arr)
                for(let j=0;j<arr.length;j++) {
                    total = total + arr[j]
                }
                total = total + data[i].incorrect
                for(let j=0;j<arr.length;j++){
                    if (arr[j] == 0) {
                        percentRow.push('0')
                    } else {
                        let percentDecimal = (arr[j]/total).toFixed(2)
                        console.log(percentDecimal)
                        let percent = (percentDecimal*100).toFixed(0)
                        percentRow.push(percent)
                    }
                }
                if (data[i].incorrect == 0) {
                    percentRow.push('0')
                } else {
                    percentRow.push(((data[i].incorrect/total).toFixed(2))*100)
                }
                percents.push(percentRow)
            }
            console.log(percents)
            setPercents(percents)
        }
        getPercents()
    }, [])

    useEffect(() => {
        const date = new Date()
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        const day =Number(date.getDate())
        let start = 9
        let dateArr = []

        while (day >= start) {
            let loopDate = `${date.getMonth() + 1}/${start}/${date.getFullYear()}`
            if (loopDate == formattedDate) {
                dateArr.push('Today')
            } else {
                dateArr.push(loopDate)
            }
            start++
        }

        setDates(dateArr)
        setCurrentPos((dateArr.length) - 1)
            
    }, [])

    const DateButtons = () =>
    <div className="flex items-center justify-center relative rounded-lg w-3/4 h-16 bg-[#1c1c1c]">
        <div onClick={() => setCurrentPos(prev => prev - 1)} className={`${CurrentPos == 0 ? 'hidden' : null} pr-1 hover:cursor-pointer active:bg-opacity-40 absolute left-2 h-10 w-10 rounded-full bg-opacity-20 flex justify-center items-center bg-[#ffffff]`}>
            <img src={arrow} className='rotate-180 h-1/2'/>
        </div>
        <div onClick={() => setCurrentPos(prev => prev + 1)} className={`${CurrentPos == ((Dates.length)-1) ? 'hidden' : null} pl-1 hover:cursor-pointer active:bg-opacity-40 absolute right-2 h-10 w-10 rounded-full bg-opacity-20 flex justify-center items-center bg-[#ffffff]`}>
            <img src={arrow} className='h-1/2'/>
        </div>
        <p className='w-full text-white text-2xl text-center font-semibold'>{Dates[CurrentPos]}</p>
    </div>

    const Stats = () =>
    <div className='h-full mt-[10rem] px-2 w-full'>
        <p className='text-white text-5xl mb-5 text-center w-full font-bold uppercase tracking-[.3rem]'>{Words[CurrentPos]}</p>
        <p className='mt-2 text-white text-2xl'>Average Score</p>
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>One Guess</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][0]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>Two Guesses</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][1]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>Three Guesses</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][2]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>Four Guesses</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][3]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>Five Guesses</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][4]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>Six Guesses</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][5]}%</p>
        </div>
        <div className='w-full h-[.05rem] bg-[#1c1c1c]' />
        <div className='flex flex-row w-full pr-2'>
            <p className='flex items-center text-white text-xl w-3/4 font-light'>DNF</p>
            <p className='py-2 w-1/4 text-white text-xl font-bold text-right'>{Percents[CurrentPos][6]}%</p>
        </div>
        <div className='flex flex-row w-full mt-6'>
            <p className='text-white text-2xl font-normal w-3/4'>Total Pageviews</p>
            <p className='w-1/4 text-white text-2xl font-bold text-right'>{Pageviews[CurrentPos]}</p>
        </div>
    </div>

    return(
        <div className="flex justify-center items-center relative w-screen rounded-lg border-t-4 border-[#6ccfd3] shadow-lg h-[37rem] bg-[#404040] max-w-[22.5rem] mt-4 p-2 mx-auto">
            <div className='absolute top-2 left-2 flex flex-row w-full'>
                <DateButtons />
                <div onClick={OnClick} className='hover:cursor-pointer h-16 w-1/4 flex pr-2 pb-2 justify-center items-center text-white text-3xl font-semibold'>x</div>
            </div>
            <Stats />
        </div>
    )
}