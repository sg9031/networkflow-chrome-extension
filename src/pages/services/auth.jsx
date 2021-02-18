import api from '../api';
import axios from 'axios';
import error from './errors';

async function signup_email(email, password) {
	try {
		const form = {
			'email': email.toLowerCase(),
			'password': password,
		}
		const req = await axios.post(`${api.url}/user/create/`, form);
		if (req.status >= 200 && req.status <= 300) {
			localStorage.setItem('email', email);
			localStorage.setItem('refresh', req.data.refresh);
			return true;
		}
		else {
			error.error_to_show();
			return false;
		}
	}
	catch (e) {
		console.log(e);
		error.http_error_handler(e.response, 0);
		return false;
	}
}

async function get_access_token(refresh = null) {
	try {
		if (!refresh) {
			refresh = localStorage.getItem('refresh');
		}
		const form = {
			'refresh': refresh,
		}
		const req = await axios.post(`${api.url}/token/refresh/`, form);
		console.log(req);
		if (req.status >= 200 && req.status <= 300) {
			localStorage.setItem('access', req.data.access);
			return true;
		}
		return false;
	}
	catch (e) {
		return false;
	}
}

async function signin_email(email, password) {
	try {
		const form = {
			'email': email.toLowerCase(),
			'password': password,
		}
		const req = await axios.post(`${api.url}/token/obtain/`, form);
		if (req.status >= 200 && req.status <= 300) {
			localStorage.setItem('email', email);
			localStorage.setItem('refresh', req.data.refresh);
			localStorage.setItem('access', req.data.access);
			return true;
		}
		else {
			error.error_to_show();
			return false;
		}
	}
	catch (e) {
		error.http_error_handler(e.response, '1');
		return false;
	}
}

export default { signup_email, signin_email, get_access_token };