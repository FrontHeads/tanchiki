import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom/client';

import { App } from './App';
import { registerServiceWorker } from './utils/serviceWorkerUtils';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
