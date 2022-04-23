import React from "react"

export default function Question(props) {

    // utilize controlled components for answers
    /* const optionElements = props.options.map(option => {
        return (
            // update class when selected
            <button className={"question--option"}>{option}</button>
        )
    }) */
    return (
        <div className="question">
            <h4 className="question--question">{props.question}</h4>
            <div className="question--options">
                {props.optionElements}
            </div>
        </div>
    )
}