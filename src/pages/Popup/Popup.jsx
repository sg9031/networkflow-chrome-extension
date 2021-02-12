import React from 'react';
import './Popup.css';
import api from './api';
import axios from 'axios';

export default class Popup extends React.Component {

	state = {
		'connected': false,
		email: '',
		password: '',
		url: '',
		content: '',
		importance: 'Choose an importance',
		show: true,
		signup: false,
	}

	componentDidMount = () => {
		this.init();
	}

	init() {
		const email = localStorage.getItem('email');
		const url = localStorage.getItem('url');
		if (url.search('https://www.linkedin.com/in') < 0) {
			this.setState({ show: false });
			return;
		}
		if (email) {
			this.setState({ connected: true, url: url, email: email });
			this.readData(email, url);
		}
	}

	async readData(email, url) {
		let form = new FormData();
		form.append('email', email);
		form.append('profil', url);
		const req = (await axios.post(`${api}/notes/read`, form)).data;
		if (req['res']) {
			this.setState({ content: req['data'].content });
		}
	}

	async submit(email, password) {
		let form = new FormData();
		form.append('email', email);
		form.append('password', password);
		const req = (await axios.post(`${api}/users/connexion`, form)).data;
		if (req['res']) {
			this.setState({ connected: true, message: '' });
			localStorage.setItem('email', email);
		}
		else {
			this.setState({ message: req['message'] });
		}
	}

	async signup(email, password) {
		let form = new FormData();
		form.append('email', email);
		form.append('password', password);
		const req = (await axios.post(`${api}/users/inscription`, form)).data;
		if (req['res']) {
			this.setState({ connected: true, message: '' });
			localStorage.setItem('email', email);
		}
		else {
			this.setState({ message: req['message'] });
		}
	}

	deconnect = () => {
		localStorage.clear();
		this.init();
	}

	async save(content, importance) {
		let form = new FormData();
		form.append('email', this.state.email);
		form.append('profil', this.state.url);
		form.append('content', content);
		form.append('importance', this.deduit_importance(importance));
		const req = (await axios.post(`${api}/notes/add`, form)).data;
	}

	deduit_importance = (importance) => {
		if (importance == 'Choose a Importance') {
			return ('C');
		}
		if (importance == 'Very') {
			return ('A');
		}
		if (importance == 'Fairly') {
			return ('B');
		}
		if (importance == 'Neutral') {
			return ('C');
		}
		if (importance == 'Slightly') {
			return ('D');
		}
		if (importance == 'Not at all') {
			return ('E');
		}
		return ('C');
	}

	render() {
		return (
			<>
				{this.state.show === false ? (
					<section className="container-fluid text-center">
						<p><b>You are not on linkedin website, sorry! The adaptation to others social network is comming soon!</b></p>
					</section>
				) : (
						<section>
							<section className="container-fluid text-center">
								<p><b>{this.state.message}</b></p>
							</section>
							{this.state.connected === true ? (
								<section className="container-fluid text-center">
									<p>You are connected</p>
									<textarea className="form-control" rows={7} value={this.state.content} onChange={e => this.setState({ content: e.target.value })} />
									<label>Importance</label>
									<select value={this.state.importance} onChange={e => this.setState({ importance: e.target.value })} className="form-control">
										<option value={this.state.importance}>{this.state.importance}</option>
										<option value="Very">Very</option>
										<option value="Fairly">Fairly</option>
										<option value="Neutral">Neutral</option>
										<option value="Slightly">Slightly</option>
										<option value="Not at all">Not at all</option>
									</select>
									<button className="btn btn-success" onClick={() => this.save(this.state.content, this.state.importance)}>Save</button>
									<div style={{ marginTop: '2%' }}>
										<button className="btn btn-danger" onClick={() => this.deconnect()}>Disconnect</button>
									</div>
								</section>
							) : (
									<section className="container-fluid text-center">
										{this.state.signup === true ? (
											<div>
												<div className="form-group">
													<h3>Signup Form</h3>
												</div>
												<div className="form-group">
													<label>Email</label>
													<input type="email" className="form-control" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
												</div>
												<div className="form-group">
													<label>Password</label>
													<input type="password" className="form-control" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
												</div>
												<div className="form-group">
													<button className="btn btn-dark" onClick={() => this.signup(this.state.email, this.state.password)}>Valider</button>
												</div>
												<p onClick={() => this.setState({ signup: false })}><a><u>I have an account</u></a></p>
											</div>
										) : (
												<div>
													<div className="form-group">
														<h3>Signin Form</h3>
													</div>
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
													<p onClick={() => this.setState({ signup: true })}><a><u>Create an account</u></a></p>
												</div>
											)}
									</section>
								)}
						</section>
					)}
			</>
		)
	}
}
