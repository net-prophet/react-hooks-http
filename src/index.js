import * as HTTPHooks from './hook'
import DebugRequestPanel from './DebugRequestPanel'


// Uncomment this to test example with `npm run start`
/*
import React from 'react'
import ReactDom from 'react-dom'

console.info('Starting Demo React Hooks App')

const api = HTTPHooks.buildAPIHooks(
  "https://jsonplaceholder.typicode.com",
    {debug: true}, // Request options
    {debug: DebugRequestPanel} // Render component overrides
)

const appElement = document.getElementById('root')

const Example = (props) => {
    console.info('Mounted Example Element')
    const todo = api.useGET('/todos/1')

    todo.requestOnce();

    return api.Component(todo, ({data}) => <div>
        <h2>Todo #{data.id}: {data.title}</h2>
        User: {data.userId} Completed? {data.completed ? 'yes' : 'no'}
        <br />
        <button onClick={() => todo.sendRequest()}>
          {todo.response.pending ? '...' : 'Reload'}
        </button>
    </div>)
}

appElement &&
  ReactDom.render(
    <Example />,
    appElement,
  )
// END EXAMPLE USAGE
//        */
export default HTTPHooks;
