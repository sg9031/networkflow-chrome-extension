import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

render(<Popup />, window.document.querySelector('#app-container'));
