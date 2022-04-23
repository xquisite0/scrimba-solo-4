import React from "react"

export default function Start(props) {
    return (
        <div id="start">
            <h1 className="start--title">Quizzical</h1>
            <p>Answer the following questions!</p>
            <button className="start--button" onClick={props.toggleStart}>Start Quiz</button>
        </div>
    )
}