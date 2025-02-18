import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CommonRoutes from './modules/commonroutes'
import TestScreen from './test'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<TestScreen />} />
        <Route path='/home/*' element={<CommonRoutes />} />
      </Routes>
    </>
  )
}

export default App
