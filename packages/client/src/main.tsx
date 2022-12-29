import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom/client';

import { App } from './App';
import { registerServiceWorker } from './utils/serviceWorkerUtils';

registerServiceWorker();

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement, <App />);
