useHTTPCall Hook For React
==========================

The goal of this project is to provide a simple react hook to manage HTTP requests in purely functional React components.

Installation is easy:

```
npm install react-hooks-http
```

And you're ready to go!

Usage
=====

Raw usage of the useHTTPCall hook is straightforward, but discouraged:

```
import {useHTTPCall, RenderAsyncComponent} from 'react-hooks-http'
const UserProfileView = (props) => {
    const options = {debug: true, headers: {Authorization: "Token asdf123"}}

    // useHTTPCall returns a "Call Hook"
    const getProfile = useHTTPCall('http://localhost:8000/profile', options);


    // a Call Hook includes members for triggering requests
    getProfile.requestOnce();

    // RenderAsyncComponent will automatically show a "Loading" until fetched
    return RenderAsyncComponent(getProfile,
        ({data}) => <div>Hello {data.username}</div>)
}
```

It is preferred to do all your setup upfront and use the `buildAPIHooks` wrapper:

```
import {buildAPIHooks, DebugRequestPanel} from 'react-hooks-http'

const options = {debug: true, headers: {Authorization: "Token asdf123"}}
const api = buildAPIHooks('http://localhost:8000', options, {
    debug: DebugRequestPanel // Add our nifty debug request panel to all calls
})

const UpdateAddress = (props) => {
    // Make 2 Call Hook objects to begin updating the user's address
    const old_profile = api.useGET('/profile');
    const update_profile = api.usePOST('/profile');

    // We'll load the details first
    old_profile.requestOnce();

    // Build a simple form to set the body of update_profile
    // the setField method will collect values for a POST/PUT,
    // and if your next call to sendRequest() has no parameters
    // it will assemble the form you've built and send that as JSON
    return api.AsyncComponent(old_profile, ({data}) => <div>
        <input
            defaultValue={data.address}
            onChange={(e) => update_profile.setField('address', e.target.value)}
        />
        <button onClick={() => update_profile.sendRequest()}>
            SAVE ADDRESS
        </button>
    </div>
    )
}
```
