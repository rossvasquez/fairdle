import { useState } from "react"

import checkIfWord from "check-if-word";

import "../styles/game.css"

export default function Game() {

    let words = checkIfWord('en'); 

    const [CurrentRow, setCurrentRow] = useState(0)

    const [CurrentPosition, setCurrentPosition] = useState(0)

    const [ShowMessage, setShowMessage] = useState(false)

    const [Message, setMessage] = useState('boop')

    const [Answer, setAnswer] = useState(['R','O','D','E','O'])

    const [Finished, setFinished] = useState(false)

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

    const [ Keys ] = useState([
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M']
    ])

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

    const checkExistence = (letter) => {
        let exists = false
        for(let i=0;i<Answer.length; i++) {
            if (letter == Answer[i]) {
                exists = true
            }
        }
        return exists
    }

    const handleGuess = () => {
        let isFull = true
        let thisWord = ''
        for(let i= 0; i<Guesses[CurrentRow].length; i++) {
            let currentLetter = Guesses[CurrentRow][i]
            thisWord += currentLetter
            if (currentLetter == '') {
                isFull = false
            }
        }
        let isAWord = words.check(thisWord)
        if (isFull && isAWord) {
            checkLetters()
            setCurrentRow(previous => previous + 1)
            setCurrentPosition(0)
        } else if (!isFull) {
            setMessage('Please enter a full word')
            setShowMessage(true)
        } else if (!isAWord) {
            setMessage('Please enter a real word')
            setShowMessage(true)
        }
    }

    const checkLetters = () => {
        let tempResults = [...Results]
        let tempResultsRow = []
        let winCount = 0
        for(let i= 0; i<Guesses[CurrentRow].length; i++) {
            let currentLetter = Guesses[CurrentRow][i]
            let correctLetter = Answer[i]
            if (currentLetter == correctLetter) {
                tempResultsRow.push(2)
                winCount++
            } else if (checkExistence(currentLetter)) {
                tempResultsRow.push(1)
            } else {
                tempResultsRow.push(3)
            }
        }
        tempResults[CurrentRow] = tempResultsRow
        setResults(tempResults)
        if (winCount == 5) {
            setMessage('You Win!')
            setShowMessage(true)
            setFinished(true)
        }
    }

    const ShareResult = () =>
    <div className="flex justify-center items-center flex-col absolute h-[27rem] w-[22rem] bg-[#2e2e2e] rounded-xl bg-opacity-[97%]">
        <p className="text-3xl text-[#ffffff] font-bold mb-14">Share It Up!</p>
        <div className="w-7/12 flex justify-center items-center bg-green-500 py-6 rounded-full text-xl text-[#ffffff] font-semibold">Copy Results</div>
    </div>

    const GuessTile = () =>
    <div className="relative h-auto w-full max-w-xl flex flex-col mx-auto justify-center items-center">
    {Finished ? <ShareResult /> : null}
    {Guesses.map((item, index) =>
        <div key={index} className="flex flex-row h-auto w-auto gap-1.5 mb-1.5">
            {item.map((tile, i) =>
            <div key={i} className={`flex justify-center items-center text-4xl pb-1 font-bold text-[#ffffff] h-16 w-16 ${Guesses[index][i] == '' ? 'border-[#404040]' : 'border-[#757575]'} ${Results[index][i] == 1 ? 'bg-amber-400' : null} ${Results[index][i] == 2 ? 'bg-green-500' : null} ${Results[index][i] == 3 ? 'bg-[#404040]' : null} ${CurrentRow > index ? null : 'border-2'}`}>
                {tile}
            </div>
            )}
        </div>
        )}
    </div>

    const Keyboard = () =>
    <div className="h-auto w-full max-w-xl flex flex-col mx-auto justify-center items-center mt-4">
        {Keys.map((row, index) =>
            <div key={index} className="flex flex-row h-auto w-auto gap-1 mb-1">
                {row.map((letter, i) =>
                    <div key={i} onClick={() => handleLetter(letter)} className="hover:cursor-pointer h-12 w-8 bg-[#757575] text-[#ffffff] font-bold flex justify-center items-center rounded-[.25rem]">
                        {letter}
                    </div>
                )}
            </div>
        )}
    </div>

    const ActionButtons = () =>
    <div className="h-auto w-full max-w-xl flex flex-row mx-auto justify-center items-center mt-2 mb-6 gap-2">
        <div onClick={() => handleGuess()} className="hover: cursor-pointer w-20 h-10 flex justify-center items-center text-white font-bold text-[#ffffff] rounded-[.25rem] bg-green-400">ENTER</div>
        <div onClick={() => handleRemove()} className="hover: cursor-pointer w-20 h-10 flex justify-center items-center text-white font-bold text-[#ffffff] rounded-[.25rem] bg-red-400">UNDO</div>
    </div>

    const MessageView = () =>
    <div className={`h-auto w-full max-w-xl flex flex-row mx-auto text-[#ffffff] text-2xl font-light capitalize justify-center items-center my-6 px-4 block ${ShowMessage ? 'opacity-100' : 'opacity-0'}`}>
        <p>{Message}</p>
    </div>

    return(
        <div className="w-screen h-auto">
            <MessageView />
            <GuessTile />
            <Keyboard />
            <ActionButtons />
        </div>
    )
}