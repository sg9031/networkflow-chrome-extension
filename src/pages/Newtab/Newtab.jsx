import React from 'react';
import './Newtab.css';
import './Newtab.scss';
import axios from 'axios';
import api from '../Popup/api';
import { Table } from 'react-bootstrap';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import instantMeiliSearch from '@meilisearch/instant-meilisearch';
import logo from '../../assets/img/networkflowpngslimmm.png';

import { connectHitInsights } from 'react-instantsearch-dom';

const Hit = ({ hit, insights }) => (
	hit.map(x =>
		<p>x.profil</p>
	)
);

const HitWithInsights = connectHitInsights(window.aa)(Hit);

const searchClient = instantMeiliSearch(
	'http://127.0.0.1:7700',
);

// function Hit(props) {

// 	return (
// 		<>
// 			{/* <div>
// 				<p>{props.hit.content}</p>
// 			</div> */}
// 			<tr key={props.hit.id}>
// 				<td>{deduction(props.hit.importance)}</td>
// 				<td>{props.hit.profil.replaceAll('https://www.linkedin.com/in/', '').replaceAll('/', '')}</td>
// 				<td>{props.hit.content}</td>
// 			</tr>
// 		</>
// 	);
// }

function deduction(importance) {
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

export default class NewTab extends React.Component {

	state = {
		email: '',
		connected: false,
		message: 'You are not connected to you account, please do so',
		data: [],
	}

	componentDidMount = () => {
		const email = localStorage.getItem('email');
		if (email) {
			this.setState({ connected: true, email: email });
			this.loadElements(email);
		}
		else {
			const email = 'stanleyserbin@gmail.com'
			localStorage.setItem('email', email);
			this.setState({ connected: true, email: email });
			this.loadElements(email);
		}
	}

	async loadElements(email) {
		const req = (await axios.get(`${api}/notes/read/all/${email}`)).data;
		if (req['res']) {
			this.setState({ data: req['data'] });
			this.add_data(req['data']);
		}
	}

	async add_data(data) {
		const req = (await axios.post('http://127.0.0.1:7700/indexes/notes/documents', data)).data;
		console.log(req);
		return (true);
	}

	deduction = (importance) => {
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

	async meili(search) {
		const req = (await axios.post('http://127.0.0.1:7700/indexes/notes/search', {
			'q': search,
		})).data;
		this.setState({ data: req['hits'] })
	}


	render() {
		return (
			<section className="container-fluid text-center">
				{this.state.connected === true ? (
					<div>
						<div style={{ margin: '2%' }}>
							<img src={logo} width={'50%'} />
						</div>
						<div className="container-fluid col-sm-4" style={{ paddingTop: '2%', paddingBottom: '2%' }}>
							<label>Search:</label>
							<input className="form-control" onChange={e => this.meili(e.target.value)} />
						</div>
						<div>
							<InstantSearch
								indexName="notes"
								searchClient={searchClient}
							>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Importance</th>
											<th>Profil</th>
											<th>Content</th>
										</tr>
									</thead>
									<tbody>
										{this.state.data.map(x =>
											<tr key={x.id}>
												<td>{this.deduction(x.importance)}</td>
												<td>{x.profil.replaceAll('https://www.linkedin.com/in/', '').replaceAll('/', '')}</td>
												<td>{x.content}</td>
											</tr>
										)}
									</tbody>
								</Table>
							</InstantSearch>
						</div>
					</div>
				) : (
						<div>
							{this.state.message}
						</div>
					)}
			</section>
		)
	}
}