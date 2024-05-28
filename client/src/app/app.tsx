import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './app.module.css';
import Detail from './detail/detail';
import Tickets from './tickets/tickets';

const App = () => {
  return (
    <div className={styles['app']}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<Detail />} />
      </Routes>
    </div>
  );
};

export default App;
