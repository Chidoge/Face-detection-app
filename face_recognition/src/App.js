import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
	apiKey : '4f96d4e2d08446aaa088f3fd8cb83798'
});

const particlesOptions = {
 	particles: {
 		number: {
 			value: 80,
 			density: {
 				enable: true,
 				value_area: 800
 			}
 		}
	}
}

/* The main container for the page */
class App extends Component {

	constructor() {

		super();

		this.state = {
			input : '',
			imageUrl : ''
		}
	}

	onInputChange = (event) => {
		this.setState({ input : event.target.value });
	}

	onButtonSubmit = () => {

		this.setState({ imageUrl : this.state.input });
		app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input).then(
			function(response) {
				console.log(response.outputs[0].data.regions[0].region_info.bounding_box);

			},
			function(err) {
				// there was an error
				console.log(err);
			}
		);
	}

	render() {
		return (
			<div className = 'App'>
				<Particles className = 'particles' params={particlesOptions} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm onButtonSubmit = {this.onButtonSubmit} onInputChange = {this.onInputChange} />
				<FaceRecognition imageUrl = {this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
