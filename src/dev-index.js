import React from 'react'
import ReactDom from 'react-dom'

import {buildAPIHooks} from "./hook";
import DebugRequestPanel from "./DebugRequestPanel"

const api = buildAPIHooks(
  "https://jsonplaceholder.typicode.com",
    {debug: true}, // Request options
    {debug: DebugRequestPanel}
)

const appElement = document.getElementById('root')

const Example = (props) => {
    const todo = api.useGET('/todos/1')
    const post = api.usePOST('/todos/1')

    todo.requestOnce();

    return api.Component(todo, ({data}) => <div>
        <h2>Todo #{data.id}: {data.title}</h2>
        User: {data.userId} Completed? {data.completed ? 'yes' : 'no'}
        <input onChange={(e) => post.setField('nickname', e)} />
        <br />
        <button onClick={() => todo.sendRequest()}>
            Reload
        </button>
        <DebugRequestPanel {...post} />
    </div>)
}

appElement &&
  ReactDom.render(
    <Example />,
    appElement,
  )
