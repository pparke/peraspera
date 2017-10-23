import React from 'react';
import { joinGame } from '../lib/api';
import store from '../lib/Store';
import config from '../../config';
import { checkContentType } from '../lib/api';

// components
import Pane from './Pane';

// assets
import '../../assets/scss/signup.scss';


export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			handle: '',
			email: '',
			password: '',
			userid: '',
			token_public: '',
			token_expires: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log(event.target);
	}

	async handleSubmit(event) {
		event.preventDefault();
		const result = await signupRequest({
			username: this.state.username,
			handle: this.state.handle,
			password: this.state.password,
			email: this.state.email
		});

		this.setState({
			userid: result.userid,
			token_public: result.token_public,
			token_expires: result.token_expires
		});
	}

	render() {
		return (
			<div className='signup'>
				<Pane theme={'clear'} title={'SIGNUP'} contentLayout={'column'}>
					<form onSubmit={this.handleSubmit}>
						<label>
							Username:
							<input type="text" name="username" />
						</label>
						<label>
							Handle:
							<input type="text" name="handle" />
						</label>
						<label>
							Email:
							<input type="email" name="email" />
						</label>
						<label>
							Password:
							<input type="password" name="password" />
						</label>
						<input type="submit" value="Submit" />
					</form>
				</Pane>
			</div>
		)
	}

}

async function signupRequest(data) {
	const response = await fetch(`${config.api.url}/login/new`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	checkContentType(response);
	const json = await response.json();
	return json.ship;
}
