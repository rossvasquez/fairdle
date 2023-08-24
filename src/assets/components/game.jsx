import { useState, useEffect } from "react"

import { supabase } from "../../supabaseClient"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import Dashboard from "./dashboard"

import "../styles/game.css"

export default function Game() {

    // State for Game Mechanics

    const [CurrentRow, setCurrentRow] = useState(0)

    const [CurrentPosition, setCurrentPosition] = useState(0)

    const [Answer, setAnswer] = useState([])

    const [Guesses, setGuesses] = useState([
        ['','','','',''],
        ['','','','',''],
        ['','','','',''],
        ['','','','',''],
        ['','','','',''],
        ['','','','',''],
    ])

    const [Results, setResults] = useState([
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ])

    // State for Keyboard

    const [ Keys ] = useState([
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M']
    ])

    const [GrayOut, setGrayOut] = useState([])

    const [YellowOut, setYellowOut] = useState([])

    const [GreenOut, setGreenOut] = useState([])

    // State to Show Messages Based On Guess Result

    const [ShowMessage, setShowMessage] = useState(false)

    const [Message, setMessage] = useState('')

    const [Failed, setFailed] = useState(false)

    // State for Post Game Box

    const [ShowGame, setShowGame] = useState(2)

    const [ShowThanks, setShowThanks] = useState(1)

    const [Tip, setTip] = useState(0)

    const [Finished, setFinished] = useState(false)

    const [Copied, setCopied] = useState(false)

    // UseEffect to add pageview to Supabase Table

    // useEffect(() => {
    //     const date = new Date()
    //     const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    //     const getTraffic = async () => {
    //         let count
    //         const { data } = await supabase
    //             .from('traffic_counter')
    //             .select('visitors')
    //             .eq('date_today', formattedDate)
        
    //         count = data[0].visitors
    //         count++

    //         const { error } = await supabase
    //             .from('traffic_counter')
    //             .update({ visitors: count })
    //             .eq('date_today', formattedDate)
            
    //         if (error) {

    //         } 
    //     }
    //     getTraffic()
    // }, [])

    // UseEffect to get the word of the day from Supabase Table

    useEffect(() => {
        let tempArr = []
        const getWord = async () => {
            const url = `https://random-word-api.herokuapp.com/word?length=5`;     
    
            let response = await fetch(url)

            let info = await response.json()

            let word = (info.toString()).toUpperCase()
            
            for(let i=0;i<word.length;i++) {
                tempArr.push(word[i])
            }
        
            return word
        }
        getWord()
        console.log(tempArr)
        setAnswer(tempArr)
    }, [])

    // UseEffect to check localStorage for previous game data for the day and update state, else create a localStorage object

    useEffect(() => {
        const date = new Date()
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        let testy = localStorage.getItem(`Data ${formattedDate}`)
        if (testy == null) {
            window.localStorage.clear()
            let data = {
                "guesses": Guesses,
                "results": Results,
                "currentRow": CurrentRow,
                "currentPosition": CurrentPosition,
                "showMessage": ShowMessage,
                "message": Message,
                "failed": Failed,
                "finished": Finished,
                "grayOut": GrayOut,
                "yellowOut": YellowOut,
                "greenOut": GreenOut,
                "answer": Answer,
            }
            let dataString = JSON.stringify(data)
            localStorage.setItem(`Data ${formattedDate}`, dataString)
        } else {
            let asString = localStorage.getItem(`Data ${formattedDate}`)
            let asObject = JSON.parse(asString)
            setGuesses(asObject.guesses)
            setResults(asObject.results)
            setCurrentRow(asObject.currentRow)
            setCurrentPosition(asObject.currentPosition)
            setShowMessage(asObject.showMessage)
            setMessage(asObject.message)
            setFailed(asObject.failed)
            setFinished(asObject.finished)
            setGrayOut(asObject.grayOut)
            setYellowOut(asObject.yellowOut)
            setGreenOut(asObject.greenOut)
            setAnswer(asObject.answer)
        }
        console.log(Answer)
    }, [])

    // Handle a keydown on the keyboard and add to guess

    const handleLetter = (letter) => {
        setShowMessage(false)
        if (CurrentPosition < 5) {
            let tempGuesses = [...Guesses]
            let tempRow = [...tempGuesses[CurrentRow]]
            tempRow[CurrentPosition] = letter
            tempGuesses[CurrentRow] = tempRow
            setGuesses(tempGuesses)
            let tempPos = CurrentPosition
            setCurrentPosition(tempPos + 1)
        }
    }

    // Handle the undo function to remove a letter from guess

    const handleRemove = () => {
        if (CurrentPosition > 0) {
            let tempGuesses = [...Guesses]
            let tempRow = [...tempGuesses[CurrentRow]]
            tempRow[CurrentPosition - 1] = ''
            tempGuesses[CurrentRow] = tempRow
            setGuesses(tempGuesses)
            let tempPos = CurrentPosition
            setCurrentPosition(tempPos - 1)
        }
    }

    // useEffect to update the localStorage object to save game data across sessions

    useEffect(() => {
        const date = new Date()
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        let data = {
            "guesses": Guesses,
            "results": Results,
            "currentRow": CurrentRow,
            "currentPosition": CurrentPosition,
            "showMessage": ShowMessage,
            "message": Message,
            "failed": Failed,
            "finished": Finished,
            "grayOut" : GrayOut,
            "yellowOut" : YellowOut,
            "greenOut" : GreenOut,
            "answer": Answer
        }
        let dataString = JSON.stringify(data)
        localStorage.setItem(`Data ${formattedDate}`, dataString)
    }, [CurrentPosition, ShowMessage])

    // Callback from checkLetters to see if the letter exists in the word already

    const checkExistence = (letter, alreadyExists) => {
        let exists = false
        let count = 0
        for(let i=0;i<Answer.length; i++) {
            if (letter == Answer[i]) {
                count++
            }
        }
        for(let i=0;i<Answer.length; i++) {
            if (letter == Answer[i]) {
                let aExists = false
                for (let j=0;j<alreadyExists.length; j++) {
                    if (alreadyExists[j] == letter && count < 2) {
                        aExists = true
                    }
                }
                if (!aExists) {
                    exists = true
                }
            }
        }
        return exists
    }

    // Callback from checkLetters that goes back across the guess again to see if a 
    // yellow letter that turned green later in the word only exists once

    const checkBack = (tempResults, good) => {

        let temp = tempResults

        const checkForHowMany = (q) => {
            let count = 0
            for (let i = 0;i<Answer.length;i++) {
                if (Guesses[CurrentRow][q] == Answer[i]) {
                    count++
                }
            }
            return count
        }

        const checkIfGreen = (q) => {
            let isGreen = false
            for (let i = 0;i<good.length;i++) {
                if (good[i] == Guesses[CurrentRow][q]) {
                    isGreen = true
                }
            }
            return isGreen
        }

        let grayOut = [...GrayOut]

        for(let i=0;i<temp.length;i++) {
            if (temp[i] == 1) {
                let count = checkForHowMany(i)
                let isGreen = checkIfGreen(i)
                if (count < 2 && isGreen) {
                    temp[i] = 3
                    grayOut.push(Guesses[CurrentRow][i])
                    setGrayOut(grayOut)
                }
            }
        }

        return temp
    }

    // Callback from checkLetters to add result to Supabase Table if the user has completed the game

    // const addToDashboard = (row) => {
    //     const date = new Date()
    //     const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    //     const addToCorrect = async () => {
    //         const { data } = await supabase
    //             .from('guesses')
    //             .select('correct')
    //             .eq('date', formattedDate)

    //         let correctArray = JSON.parse(data[0].correct)
    //         correctArray[row]++
    //         let setArray = JSON.stringify(correctArray)

    //         const { error } = await supabase
    //             .from('guesses')
    //             .update({ correct: setArray})
    //             .eq('date', formattedDate)
    //     }

    //     const addToIncorrect = async () => {
    //         const { data } = await supabase
    //             .from('guesses')
    //             .select('incorrect')
    //             .eq('date', formattedDate)
            
    //         let count = data[0].incorrect
    //         count++

    //         const { error } = await supabase
    //             .from('guesses')
    //             .update({ incorrect: count })
    //             .eq('date', formattedDate)
    //     }
        
    //     if (row < 5) {
    //         addToCorrect()
    //     } else {
    //         addToIncorrect()
    //     }
    // }

    // Callback from handleGuess to handle colors of letter and keyboard as well as check if the game is finished

    const checkLetters = () => {
        let tempResults = [...Results]
        let grayOut = [...GrayOut]
        let yellowOut = [...YellowOut]
        let greenOut = [...GreenOut]
        let tempResultsRow = []
        let alreadyExistsGood = []
        let alreadyExistsBad = []
        let winCount = 0
        for(let i= 0; i<Guesses[CurrentRow].length; i++) {
            let currentLetter = Guesses[CurrentRow][i]
            let correctLetter = Answer[i]
            let count = 0
            let pass = true
            for(let p = 0;p<alreadyExistsBad.length;p++) {
                if (currentLetter == alreadyExistsBad[p]) {
                    for (let k = 0;k<Answer.length;k++) {
                        if (currentLetter == Answer[k]) {
                            count++
                        }
                    }
                }
            }
            for(let p = 0;p<alreadyExistsGood.length;p++) {
                if (currentLetter == alreadyExistsGood[p]) {
                    for (let k = 0;k<Answer.length;k++) {
                        if (currentLetter == Answer[k]) {
                            count++
                        }
                    }
                }
            }
            if (count == 1) {
                pass = false
            }
            if (currentLetter == correctLetter) {
                alreadyExistsGood.push(currentLetter)
                tempResultsRow.push(2)
                greenOut.push(currentLetter)
                setGreenOut(greenOut)
                winCount++
            } else if ((checkExistence(currentLetter, alreadyExistsGood)) && pass) {
                tempResultsRow.push(1)
                yellowOut.push(currentLetter)
                setYellowOut(yellowOut)
                alreadyExistsBad.push(currentLetter)
            } else {
                tempResultsRow.push(3)
                grayOut.push(currentLetter)
                setGrayOut(grayOut)
            }
        }
        tempResults[CurrentRow] = checkBack(tempResultsRow, alreadyExistsGood)
        setResults(tempResults)
        if (winCount == 5) {
            setMessage('You Win!')
            setShowMessage(true)
            setFinished(true)
            // addToDashboard(CurrentRow)
        } else if (CurrentRow === 5) {
            setMessage('Better Luck Tomorrow.')
            setShowMessage(true)
            setFinished(true)
            setFailed(true)
            // addToDashboard(CurrentRow)
        }
    }

    // Callback from handleGuess to hit Netlify function that checks dictionary API to see if word is real

    const checkIfWord = async (thisWord) => {
        let result = null
        await fetch("/.netlify/functions/check-word", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: thisWord
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            result = JSON.parse(data)
        })
        return result
    }

    // Handle a guessed word on guess button keydown

    const handleGuess = async () => {
        let isFull = true
        let thisWord = ''
        for(let i= 0; i<Guesses[CurrentRow].length; i++) {
            let currentLetter = Guesses[CurrentRow][i]
            thisWord += currentLetter
            if (currentLetter == '') {
                isFull = false
            }
        }
        let isAWord = await checkIfWord(thisWord)
        if (isFull && isAWord) {
            checkLetters()
            setCurrentRow(previous => previous + 1)
            setCurrentPosition(0)
        } else if (!isFull) {
            setMessage('Enter A Full Word')
            setShowMessage(true)
        } else if (!isAWord) {
            setMessage('Not A Word')
            setShowMessage(true)
        }
    }

    // Function to copy a result when a user has finished, can be pasted in a text or social media

    const copyResult = () => {
        const date = new Date()
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        let resultString = ''
        if (Failed) {
            resultString = `${formattedDate} Fairdle X/6\n\n`
        } else {
            resultString = `${formattedDate} Fairdle ${CurrentRow}/6\n\n`
        }
        for (let i=0;i<CurrentRow;i++) {
            for (let j=0;j<Results[i].length;j++) {
                if (Results[i][j] === 1) {
                    resultString += '🟨'
                } else if (Results[i][j] === 2) {
                    resultString += '🟩'
                } else {
                    resultString += '⬛️'
                }
            }
            resultString += '\n'
        }
        navigator.clipboard.writeText(resultString)
        setCopied(true)
    }

    // Callback for conditionally rendering the keyboard key colors based on previous guess result

    const checkKeyColor = (letter) => {
        let color = 0
        for (let i = 0;i<GrayOut.length;i++) {
            if (GrayOut[i] == letter) {
                color = 1
            }
        }
        for (let i = 0;i<YellowOut.length;i++) {
            if (YellowOut[i] == letter) {
                color = 2
            }
        }
        for (let i = 0;i<GreenOut.length;i++) {
            if (GreenOut[i] == letter) {
                color = 3
            }
        }
        return color
    }

    // Paypal Tip Component

    const paypalTip = () =>
    <>
    {ShowThanks===1 ?
    <div onClick={() => setShowThanks(2)} className="hover:cursor-pointer w-full flex justify-center items-center border-[#29bfd5] border-2 focus:bg-[#757575] py-2.5 rounded-md text-xl text-[#ffffff] font-semibold">Keep Fairdle Ad Free</div>
    : null}
    {ShowThanks===2 ?
    <>
    <div className="flex-row items-center flex w-full px-2 mt-1">
        <div className="relative flex items-center flex-row w-9/12 text-2xl font-semibold text-white">
            <p>Tip Creator</p>
            <p className="absolute right-1 font-light text-2xl">$</p>
        </div>
        <input onChange={(e) => setTip(e.target.value)} value={Tip} className="w-3/12 border-2 bg-[#404040] border-[#757575] rounded-md shadow-inner h-12 text-white text-2xl focus:outline-none text-center" type='number' />
    </div>
    <PayPalScriptProvider
        options={{
            clientID: import.meta.env.VITE_LIVE_PAYPAL,
            disableFunding: "credit"
        }}
    >
        <PayPalButtons className='relative w-full mt-4 z-0 -mb-4' forceReRender={[Tip]}
            style={{
                disableMaxWidth: true,
                color: "white",
                tagline: false,
            }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: Tip,
                            },
                        },
                    ],
                    application_context: {
                        shipping_preference: "NO_SHIPPING",
                    },
                })
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(setShowThanks(3))
            }}
        />
    </PayPalScriptProvider>
    </>
    : null}
    {ShowThanks===3 ?
    <div className="h-12 w-full flex justify-center items-center text-white text-2xl font-semibold">
            Thank You for the Tip!
    </div>
    : null}
    </>

    // Share Result Component

    const shareResult = () =>
    <div className="select-none top-[27rem] left-0 right-0 flex p-4 flex-col absolute h-auto mx-auto w-full max-w-[22rem] bg-[#2e2e2e] rounded-xl z-10">
        <p className="text-2xl text-[#ffffff] font-semibold mb-3 text-center">Share It Up!</p>
        <div onClick={() => copyResult()} className={`hover:cursor-pointer w-full flex justify-center items-center bg-gradient-to-br from-[#29bfd5] to-[#6ccfd3] ${Copied ? 'opacity-40' : 'opacity-100'} py-2.5 rounded-md text-xl text-[#ffffff] font-semibold`}>{Copied ? 'Copied!' : 'Copy Results'}</div>
        {Copied ? <p className="text-white text-center px-4 mt-1.5">Now paste your results into a text message or your favorite social media.</p> : null}
        <div className="w-full h-[.05rem] bg-[#757575] my-3" />
        <div onClick={() => setShowGame(0)} className="hover:cursor-pointer w-full flex justify-center items-center border-[#29bfd5] border-2 focus:bg-[#757575] py-2.5 rounded-md text-xl text-[#ffffff] font-semibold mb-3">Show Dashboard</div>
    </div>

    // Component that renders gameboard from array in the state of Guesses

    const GuessTile = () =>
    <div className="select-none relative h-auto w-full max-w-xl flex flex-col mx-auto justify-center items-center px-2 mt-6">
    {Guesses.map((item, index) =>
        <div key={index} className="flex flex-row h-auto w-full justify-center gap-1.5 mb-1.5">
            {item.map((tile, i) =>
            <div key={i} className={`flex justify-center items-center text-4xl pb-1 font-bold text-[#ffffff] h-16 w-16 ${Guesses[index][i] == '' ? 'border-[#404040]' : 'border-[#757575]'} ${Results[index][i] == 1 ? 'bg-amber-400' : null} ${Results[index][i] == 2 ? 'bg-green-600' : null} ${Results[index][i] == 3 ? 'bg-[#404040]' : null} ${CurrentRow > index ? null : 'border-2'}`}>
                {tile}
            </div>
            )}
        </div>
        )}
    </div>

    // Component that renders keyboard from array in the state of Keys

    const Keyboard = () =>
    <div className={`${Finished ? 'opacity-0 z-0' : 'z-20'} h-auto w-full max-w-xl flex flex-col mx-auto justify-center items-center mt-4 px-2 relative bg-[#1c1c1c]`}>
        {Keys.map((row, index) =>
            <div key={index} className="flex flex-row justify-center h-auto w-full gap-1 mb-1">
                {row.map((letter, i) =>
                    <div key={i} onClick={Finished ? null : () => handleLetter(letter)} className={`${checkKeyColor(letter) == 0 ? 'bg-[#757575]' : 'null'} ${checkKeyColor(letter) == 1 ? 'bg-[#383838]' : 'null'} ${checkKeyColor(letter) == 2 ? 'bg-amber-400' : 'null'} ${checkKeyColor(letter) == 3 ? 'bg-green-600' : 'null'} select-none hover:cursor-pointer h-12 w-8 active:bg-opacity-80 text-[#ffffff] font-bold flex justify-center items-center rounded-[.25rem]`}>
                        {letter}
                    </div>
                )}
            </div>
        )}
    </div>

    // Component that renders the GUESS and UNDO buttons

    const ActionButtons = () =>
    <div className={`${Finished ? 'opacity-0 z-0' : 'z-20'} h-auto w-full max-w-xl flex flex-row mx-auto justify-center items-center pb-6 gap-1 relative bg-[#1c1c1c]`}>
        <div onClick={Finished ? null : () => handleGuess()} className="select-none active:bg-opacity-80 hover:cursor-pointer w-[7.6rem] h-10 flex justify-center items-center text-white font-bold text-[#ffffff] rounded-[.25rem] bg-[#757575]">GUESS</div>
        <div onClick={Finished ? null : () => handleRemove()} className="select-none active:bg-opacity-80 hover:cursor-pointer w-[7.6rem] h-10 flex justify-center items-center text-white font-bold text-[#ffffff] rounded-[.25rem] bg-[#757575]">UNDO</div>
    </div>

    // Component that displays the various messages in the header

    const MessageView = () =>
    <div className="absolute h-auto w-screen max-w-xl mx-auto">
    <div className={`absolute z-30 -top-[5.7rem] ${Finished ? 'bg-[#1c1c1c]' : 'bg-red-400'} py-3 rounded-lg border border-[#ffffff] left-4 h-auto w-screen max-w-[18rem] mx-auto flex flex-row text-[#ffffff] text-2xl font-semibold capitalize justify-center items-center px-4 shadow-inner ${ShowMessage ? 'opacity-100' : 'opacity-0'}`}>
        <p>{Message}</p>
    </div>
    </div>

    const ThankYou = () =>
    <div className="px-2 w-full max-w-md mx-auto mt-4">
        <div className="flex flex-col px-4 py-6 text-center w-full h-auto bg-[#404040] rounded-md">
            <p className="text-white font-semibold text-3xl">Thank you for playing Fairdle!</p>
            <p className="text-white text-2xl mt-6">There were 95 guesses over the course of the Iowa State Fair.</p>
            <p className="text-white text-2xl mt-6 font-light">Fairdles functionality continues to work via a random word generator.</p>
            <div className="hover:cursor-pointer w-full flex justify-center items-center bg-gradient-to-br from-[#29bfd5] to-[#6ccfd3] py-2.5 rounded-md text-xl text-[#ffffff] font-semibold mt-6" onClick={() => setShowGame(1)} >Continue</div>
        </div>
    </div>

    // Rendering the game as one

    const game = () =>
    <>
        {Finished ? shareResult() : null}
        <MessageView />
        <GuessTile />
        <Keyboard />
        <ActionButtons />
    </>

    return(
        <div className="relative w-screen h-auto max-w-xl mx-auto">
            {ShowGame===0 ? <Dashboard OnClick={() => setShowGame(1)} /> : null }
            {ShowGame===1 ? game() : null }
            {ShowGame===2 ? <ThankYou /> : null }
        </div>
    )
}