import React from 'react';
import { render } from 'react-dom';

import Newtab from './Newtab';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

render(<Newtab />, window.document.querySelector('#app-container'));
