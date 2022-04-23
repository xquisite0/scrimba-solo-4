import React from "react"
import Question from "./components/Question"
import Start from "./components/Start"
import "./styles.css"

export default function App() {

    const [started, setStarted] = React.useState(false)
    const [questions, setQuestions] = React.useState([])
    const [optionsOrder, setOptionsOrder] = React.useState([])
    const [submitted, setSubmitted] = React.useState(false)

    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                setQuestions(data.results.map(result => (
                    { ...result, selected: false }
                )))
            })
        // include a selected key in each object that starts with false
    }, [])
    console.log(questions)

    function htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    // data.results => category, correct_answer, difficulty, 
    // incorrect_answers, question, type
    console.log(questions)

    // write onclick function for question options, updates selected to reflect
    // selected options for respective questions
    function updatedSelected(question, option) {
        setQuestions(prevQuestions => {
            return prevQuestions.map(questionObj => {
                return questionObj.question === question ? { ...questionObj, selected: option } : questionObj
            })
        })
    }
    function isSelected(question, option) {
        for (let i = 0; i < questions.length; i++) {
            if (question === questions[i].question) {
                return option === questions[i].selected
            }
        }
    }
    function isCorrect(question, option) {
        for (let i = 0; i < questions.length; i++) {
            if (question === questions[i].question) {
                return option == htmlDecode(questions[i].correct_answer)
            }
        }
    }

    React.useEffect(() => {
        for (let i = 0; i < 5; i++) {
            let randomIndex = Math.floor(Math.random() * 4)
            setOptionsOrder(prevOptionsOrder => {
                return [...prevOptionsOrder, randomIndex]
            })
        }
    }, [])
    let optionsOrderIndex = 0
    const questionElements = questions.map(questionObj => {
        let questionAnswers = questionObj.incorrect_answers.slice()
        questionAnswers.splice(optionsOrder[optionsOrderIndex], 0, questionObj.correct_answer)
        optionsOrderIndex++
        let questionAnswersDecoded = questionAnswers.map(question => {
            return htmlDecode(question)
        })
        // if selected, elif display correct, elif display false, else
        // display correct, display false
        let optionElements = questionAnswersDecoded.map(option => {
            // add anonymous function to pass question and option into updatedSelected
            return <button className={isSelected(questionObj.question, option) ? "question--option--selected" : "question--option"} onClick={() => updatedSelected(questionObj.question, option)}>{option}</button>
        })
        return <Question question={htmlDecode(questionObj.question)} options={questionAnswersDecoded} optionElements={optionElements} />
    })
    // utilize controlled components for answers
    /* const optionElements = options.map(option => {
        return (
            // update class when selected
            <button className={"question--option"}>{option}</button>
        )
    }) */

    optionsOrderIndex = 0
    let correctAnswers = 0
    const submittedQuestionElements = questions.map(questionObj => {
        let questionAnswers = questionObj.incorrect_answers.slice()
        questionAnswers.splice(optionsOrder[optionsOrderIndex], 0, questionObj.correct_answer)
        optionsOrderIndex++
        let questionAnswersDecoded = questionAnswers.map(question => {
            return htmlDecode(question)
        })
        // if is selected? correct/wrong change class
        // elif its correct answer? change class
        // else change class
        let optionElements = questionAnswersDecoded.map(option => {
            // add anonymous function to pass question and option into updatedSelected
            let buttonClass
            if (isSelected(questionObj.question, option)) {
                console.log(option)
                if (isCorrect(questionObj.question, option)) {
                    correctAnswers++
                    buttonClass = 'question--option2 selected--correct'
                } else {
                    buttonClass = 'question--option2 selected--incorrect'
                }
            } else if (isCorrect(questionObj.question, option)) {
                buttonClass = 'question--option2 correct'
            } else {
                buttonClass = 'question--option2 incorrect'
            }
            return <button className={buttonClass} onClick={() => updatedSelected(questionObj.question, option)}>{option}</button>
        })
        return <Question question={htmlDecode(questionObj.question)} options={questionAnswersDecoded} optionElements={optionElements} />
    })

    // write onclick function for questions submit, checks correctness of each 
    // selected option, updates ui accordingly
    function handleSubmit() {
        setSubmitted(true)
    }
    function playAgain() {
        window.location.reload()
    }
    console.log(submitted)

    return (
        started ?
            <div>
                {submitted ? submittedQuestionElements : questionElements}
                <div id="check_answers">
                    {submitted && <div id="score">You scored {correctAnswers}/5 correct answers</div>}
                    <button id="check_answers_button" onClick={submitted ? playAgain : handleSubmit}>{submitted ? "Play again" : "Check answers"}</button>
                </div>
            </div>
            :
            <Start toggleStart={() => setStarted(true)} />

    )
}