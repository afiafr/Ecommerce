import { Route, Routes } from 'react-router-dom'
import './App.css'
import Menu from './component/nav/Menu'
import Shop from './pages/Shop'
import Cart from './pages/Cart'

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Shop/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </>
  )
}

export default App
