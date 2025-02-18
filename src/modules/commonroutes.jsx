import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './home/HomePage'

const CommonRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/test' element={"<"} />
            </Routes>
        </>
    )
}

export default CommonRoutes
