import React from 'react';
import store from '../lib/Store';
import config from '../../config';
import { checkContentType } from '../lib/api';
import { Redirect } from 'react-router'

// components
import Pane from './Pane';

// assets
import '../../assets/scss/character-creation.scss';


class CharacterCreation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: 0,
			name: '',
			strength: 0,
			intelligence: 0,
			wisdom: 0,
			dexterity: 0,
			constitution: 0,
			charisma: 0,
			class_id: null,
			hit_dice: '1d6',
			hp: 0
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.reroll = this.reroll.bind(this);
	}

	handleChange(event) {
		console.log(event.target, event.target.name, event.target.value);
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	async handleSubmit(event) {
		event.preventDefault();
		const result = await characterCreateRequest({
			username: this.state.username,
			password: this.state.password,
			email: this.state.email
		});

		console.log('got result', result);

		store.setState({
			player: {
				userid: result.userid,
				token_public: result.token_public,
				token_expires: result.token_expires,
				loggedIn: true
			}
		});
	}

	reroll() {
		// TODO: roll should be done server side to avoid cheating
		function d6() {
			return Math.ceil(Math.random() * 6);
		}
		this.setState({
			strength: d6() + d6(),
			intelligence: d6() + d6() + d6(),
			wisdom: d6() + d6() + d6(),
			dexterity: d6() + d6() + d6(),
			constitution: d6() + d6() + d6(),
			charisma: d6() + d6() + d6(),
		});
	}

	render() {
		if (this.props.character) {
			return (
				<Redirect to='/dashboard' />
			);
		}
		return (
			<div className='character-creation'>
				<Pane theme={'clear'} title={'CHARACTER CREATION'} contentLayout={'column'}>
					<form onSubmit={this.handleSubmit}>
						<label>
							<span>Name:</span>
							<input type="text" name="username" onChange={this.handleChange}/>
						</label>
						<label>
							<span>Strength:</span>
							<input type="text" name="strength" value={this.state.strength} readOnly />
						</label>
						<label>
							<span>Intelligence:</span>
							<input type="text" name="intelligence" value={this.state.intelligence} readOnly />
						</label>
						<label>
							<span>Wisdom:</span>
							<input type="text" name="wisdom" value={this.state.wisdom} readOnly />
						</label>
						<label>
							<span>Dexterity:</span>
							<input type="text" name="dexterity" value={this.state.dexterity} readOnly />
						</label>
						<label>
							<span>Constitution:</span>
							<input type="text" name="constitution" value={this.state.constitution} readOnly />
						</label>
						<label>
							<span>Charisma:</span>
							<input type="text" name="charisma" value={this.state.charisma} readOnly />
						</label>
						<label>
							<span>Hit Dice:</span>
							<input type="text" name="hit_dice" value={this.state.hit_dice} readOnly />
						</label>
						<label>
							<span>Health Points:</span>
							<input type="text" name="hp" value={this.state.hp} readOnly />
						</label>
						<input type="button" value="Roll" onClick={this.reroll} />
						<input type="submit" value="Submit" />
					</form>
				</Pane>
			</div>
		)
	}

}

async function characterCreateRequest(data) {
	const response = await fetch(`${config.api.url}/character`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	checkContentType(response);
	const json = await response.json();
	return json;
}

const mapStore = store => {
	return {
		character: store.state.player.character
	}
};

export default store.connect(mapStore)(CharacterCreation);
