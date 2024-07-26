import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import css from './App.module.scss';
// Router
import Router from 'router';
// Components
import Layout from 'components/Layout';
import {useTranslation} from "react-i18next";
import i18n from '../../translation/index'
class App extends Component {
  state = {
    error: false,
  };

  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <Layout>
          <div className={css.error}>{i18n.t('components.app.error')}</div>
        </Layout>
      );
    } else {
      return (
        <>
          <Router />
          {/* <ToastContainer pauseOnFocusLoss={false} autoClose={5000} limit={2} /> */}
        </>
      );
    }
  }
}

export default App;
