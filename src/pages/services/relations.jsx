import api from '../api';
import axios from 'axios';
import error from './errors';
import auth from './auth';

async function get_all_relations() {
	try {
		const req = (await axios.get(`${api.url}/relations/`, {
			headers: {
				'Authorization': `JWT ${localStorage.getItem('access')}`,
			}
		})).data;
		return req;
	}
	catch (e) {
		if (e.response.status === 401) {
			await auth.get_access_token(localStorage.getItem('refresh'));
		}
		else {
			error.http_error_handler(e.response);
		}
	}
}

async function get_relation_by_vanity_name(name) {
	try {
		const req = (await axios.get(`${api.url}/relations/?vanity_name=${name}`, {
			headers: {
				'Authorization': `JWT ${localStorage.getItem('access')}`,
			}
		})).data;
		return req;
	}
	catch (e) {
		if (e.response.status === 401) {
			await auth.get_access_token(localStorage.getItem('refresh'));
			this.get_relation_by_vanity_name();
		}
	}
}

async function create_relation(name, importance, notes) {
	try {
		const form = {
			'importance': importance,
			'notes': notes,
			'vanity_name': name,
		}
		const req = (await axios.post(`${api.url}/relations/`, form, {
			headers: {
				'Authorization': `JWT ${localStorage.getItem('access')}`,
			}
		})).data;
		return req;
	}
	catch (e) {
		if (e.response.status === 401) {
			await auth.get_access_token(localStorage.getItem('refresh'));
			this.update_relation();
		}
		else {
			error.http_error_handler(e.response);
		}
	}
}

async function update_relation(name, importance, notes) {
	try {
		const form = {
			'importance': importance,
			'notes': notes,
		}
		const req = (await axios.put(`${api.url}/relations/?vanity_name=${name}`, form, {
			headers: {
				'Authorization': `JWT ${localStorage.getItem('access')}`,
			}
		})).data;
		return req;
	}
	catch (e) {
		if (e.response.status === 401) {
			await auth.get_access_token(localStorage.getItem('refresh'));
			this.create_relation();
		}
		else {
			error.http_error_handler(e.response);
		}
	}
}

export default { get_all_relations, get_relation_by_vanity_name, update_relation, create_relation };