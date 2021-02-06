import React from 'react';
import './Popup.css';
import api from './api';
import axios from 'axios';

export default class Popup extends React.Component {

	state = {
		'connected': false,
		email: '',
		password: '',
	}

	componentDidMount = () => {
		const email = localStorage.getItem('email');
		if (email) {
			this.setState({ connected: true });
		}
	}

	async submit(email, password) {
		let form = new FormData();
		form.append('email', email);
		form.append('password', password);
		const req = (await axios.post(`${api}/users/connexion`, form)).data;
		if (req['res']) {
			this.setState({ connected: true });
			localStorage.setItem('email', email);
		}
		else {
			this.setState({ message: req['message'] });
		}
	}

	deconnect = () => {
		localStorage.clear();
		this.setState({ connected: false });
	}

	render() {
		return (
			<>
				<section className="container-fluid text-center">
					<h4>{this.state.message}</h4>
				</section>
				{this.state.connected === true ? (
					<section className="container-fluid text-center">
						<p>You are connected</p>
						<button className="btn btn-danger" onClick={() => this.deconnect()}>Deconnexion</button>
					</section>
				) : (
						<section className="container-fluid text-center">
							<div className="form-group">
								<label>Email</label>
								<input type="email" className="form-control" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
							</div>
							<div className="form-group">
								<label>Password</label>
								<input type="password" className="form-control" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
							</div>
							<div className="form-group">
								<button className="btn btn-dark" onClick={() => this.submit(this.state.email, this.state.password)}>Valider</button>
							</div>
						</section>
					)}
			</>
		)
	}
}
