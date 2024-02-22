import { Routes, Route } from 'react-router-dom'
// Pages
import ClientPaymentPage from 'pages/ClientPaymentPage'
import SuccessPaymentPage from 'pages/SuccessPaymentPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import { Home } from '../pages/Home/Home'

const Router = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route element={<ClientPaymentPage />} path="/clientPayment" />
    <Route element={<SuccessPaymentPage />} path="/successPayment" />
    <Route element={<LoginPage />} path="/login" />
    <Route path="*" element={<Home />} />
  </Routes>
)

export default Router
