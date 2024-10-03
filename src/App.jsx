import { useState } from 'react'
import {  Router,Route, Routes } from "react-router-dom";
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (

         <Routes>
        <Route path="/" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
  )
}

export default App
