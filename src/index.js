import React from 'react';
import ReactDOM from 'react-dom';

import App from './scripts/components/App';

import registerServiceWorker from './scripts/modules/registerServiceWorker';

import './styles/index.css';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();