import { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import css from './App.module.scss'
// Router
import Router from 'router'
// Components
import Layout from 'components/Layout'

class App extends Component {
  state = {
    error: false,
  }

  componentDidCatch() {
    this.setState({
      error: true,
    })
  }

  render() {
    if (this.state.error) {
      return (
        <Layout>
          <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
        </Layout>
      )
    } else {
      return (
        <>
          <Router />
          <ToastContainer pauseOnFocusLoss={false} autoClose={5000} limit={2} />
        </>
      )
    }
  }
}

export default App
