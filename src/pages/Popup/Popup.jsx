import React from 'react';
import './Popup.css';
import api from '../api';
import axios from 'axios';
import auth from '../services/auth';
import relations from '../services/relations';
import names from '../utils/names';

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
		category: 'Choose a category',
		loading: false,
		vanity_name: '',
		created: false,
	}

	componentDidMount = () => {
		this.init();
	}

	init() {
		const email = localStorage.getItem('email');
		const url = decodeURI(localStorage.getItem('url'));
		if (url.search('https://www.linkedin.com/in') < 0) {
			this.setState({ show: false });
			return;
		}
		const vanity_name = names.get_vanityname_from_url(url)
		this.setState({ vanity_name: vanity_name });
		if (email) {
			this.setState({ connected: true, url: url, email: email });
			this.readData(vanity_name);
		}
	}

	async signIn(email, password) {
		if (await auth.signin_email(email, password)) {
			this.setState({ connected: true })
		}
	}

	async signUp(email, password) {
		if (await auth.signup_email(email, password)) {
			if (await auth.get_access_token(localStorage.getItem('refresh'))) {
				this.setState({ connected: true });
			}
		}
	}

	async readData(vanity_name) {
		const data = await relations.get_relation_by_vanity_name(vanity_name);
		if (data) {
			this.setState({
				content: data.notes,
				importance: this.deduit_importance_reverse(data.importance),
				created: true,
			});
		}
	}

	deduit_importance_reverse = (importance) => {
		if (importance == 'C') {
			return ('Neutral');
		}
		if (importance == 'A') {
			return ('Very');
		}
		if (importance == 'B') {
			return ('Fairly');
		}
		if (importance == 'C') {
			return ('Neutral');
		}
		if (importance == 'D') {
			return ('Slightly');
		}
		if (importance == 'E') {
			return ('Not at all');
		}
		return ('Neutral');
	}

	deconnect = () => {
		localStorage.clear();
		this.init();
	}

	async save(content, importance, category) {
		this.setState({ loading: true });
		if (this.state.created) {
			await relations.update_relation(this.state.vanity_name, this.deduit_importance(importance), content);
		}
		else {
			await relations.create_relation(this.state.vanity_name, this.deduit_importance(importance), content);
		}
		setTimeout(() => {
			this.setState({ loading: false });
		}, 500);
	}

	deduit_importance = (importance) => {
		if (importance == 'Choose a Importance') {
			return ('C');
		}
		if (importance == 'Very') {
			return ('4');
		}
		if (importance == 'Fairly') {
			return ('3');
		}
		if (importance == 'Neutral') {
			return ('2');
		}
		if (importance == 'Slightly') {
			return ('1');
		}
		if (importance == 'Not at all') {
			return ('0');
		}
		return ('2');
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
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
								<section className="container-fluid text-center" style={{ paddingBottom: '2%' }}>
									<div>
										{this.state.loading === true &&
											<img src="https://media4.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" width="20%" />
										}
									</div>
									<div className="form-group">
										<label>Your notes</label>
										<textarea className="form-control" rows={7} value={this.state.content} onChange={e => this.setState({ content: e.target.value })} />
									</div>
									<div className="form-group">
										<label>Importance</label>
										<select value={this.state.importance} onChange={e => this.setState({ importance: e.target.value })} className="form-control">
											<option value={this.state.importance}>{this.state.importance}</option>
											<option value="Very">Very</option>
											<option value="Fairly">Fairly</option>
											<option value="Neutral">Neutral</option>
											<option value="Slightly">Slightly</option>
											<option value="Not at all">Not at all</option>
										</select>
									</div>
									<div className="form-group">
										<label>Category</label>
										<select value={this.state.category} onChange={e => this.setState({ category: e.target.value })} className="form-control">
											<option value={this.state.category}>{this.capitalizeFirstLetter(this.state.category)}</option>
											<option value="fundraising">Fundraising</option>
											<option value="lead">Lead</option>
											<option value="recruiting">Recruiting</option>
											<option value="neutral">Neutral</option>
										</select>
									</div>
									<div className="form-group">
										<button className="btn btn-success" onClick={() => this.save(this.state.content, this.state.importance, this.state.category)}>Save</button>
									</div>
								</section>
							) : (
									<section className="container-fluid text-center">
										<p>{this.state.message}</p>
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
													<button className="btn btn-dark" onClick={() => this.signUp(this.state.email, this.state.password)}>Valider</button>
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
														<button className="btn btn-dark" onClick={() => this.signIn(this.state.email, this.state.password)}>Valider</button>
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
