import React from 'react';
import './Newtab.css';
import './Newtab.scss';
import axios from 'axios';
import api from '../Popup/api';
import { Table } from 'react-bootstrap';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import instantMeiliSearch from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
	'http://127.0.0.1:7700',
);

function Hit(props) {
	return <Highlight attribute="name" hit={props.hit} />;
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
			console.log('OK')
		}
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


	render() {
		return (
			<section className="container-fluid text-center">
				{this.state.connected === true ? (
					<div>
						<div className="container-fluid col-sm-4" style={{ paddingTop: '2%', paddingBottom: '2%' }}>
							<label>Search:</label>
							<input className="form-control" />
						</div>
						<div>
							{/* <Table striped bordered hover>
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
							</Table> */}
							<InstantSearch
								indexName="steam-video-games"
								searchClient={searchClient}
							>
								<SearchBox />
								<Hits hitComponent={Hit} />
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