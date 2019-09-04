/* @flow */
import React from 'react'
import ReactDom from 'react-dom'
import {buildAPIHooks, DebugRequestPanel} from '../../src/index'

console.info('Starting Demo React Hooks App')

const api = buildAPIHooks(
  "https://jsonplaceholder.typicode.com",
    {debug: true}, // Request options
    {debug: DebugRequestPanel} // Render component overrides
)

const appElement = document.getElementById('app')

const Example = (props) => {
    console.info('Mounted Example Element')
    const todo = api.useGET('/todos/1')

    todo.requestOnce();

    return api.AsyncComponent(todo, ({data}) => <div>
        <h2>Todo #{data.id}: {data.title}</h2>
        User: {data.userId} Completed? {data.completed ? 'yes' : 'no'}
        <br />
        <button onClick={() => todo.sendRequest()}>
            Reload
        </button>
    </div>)
}

appElement &&
  ReactDom.render(
    <Example />,
    appElement,
  )
