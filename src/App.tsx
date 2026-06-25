import Navbar from "./components/navbar"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Onboardpage from './pages/onboard'
import ProfilePage from './pages/profile'


function App() {

  return (
   <BrowserRouter>
      <div className=" min-h-screen flex flex-col">
        <Navbar/>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/onboard" element={<Onboardpage/>} />
            <Route path='/profile' element={<ProfilePage/>} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
