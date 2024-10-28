import { Provider } from 'react-redux';
import '../styles/index.css';
import store from '../app/store';

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
