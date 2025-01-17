import { useState } from 'react'
import Greeting from './components/Greeting'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Greeting message='Welcome to the App' title='Hello World' />
    </>
  )
}

export default App
