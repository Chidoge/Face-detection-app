import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
			imageUrl : '',
			box : {},
			route : 'signin',
			isSignedIn : false,
			user : {
				id : '',
				name : '',
				email : '',
				password : '',
				entries : 0,
				joined : ''
			}
		}
	}


	/* Listens for route changes */
	onRouteChange = (route) => {

		if (route === 'signout') {
			this.setState({ isSignedIn : false});
		}
		else if (route === 'home') {
			this.setState({ isSignedIn : true});
		}

		this.setState({ route : route });
	}


	/* Calculates the parameters for the box which wraps around the face */
	calculateFaceLocation = (data) => {

		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		console.log(clarifaiFace);
		return {
			leftCol : clarifaiFace.left_col * width,
			topRow : clarifaiFace.top_row * height,
			rightCol : width - (clarifaiFace.right_col * width),
			bottomRow : height - (clarifaiFace.bottom_row * height)
		}
	}


	/* Updates box state so that FaceRecognition component can update the image with face outlined */
	displayFaceBox = (box) => {
		this.setState({ box : box});
	}


	/* Updates input field */
	onInputChange = (event) => {
		this.setState({ input : event.target.value });
	}


	/* Listens for submission of image link in the ImageLinkForm */
	onButtonSubmit = () => {

		this.setState({ imageUrl : this.state.input });

		/* Call the API to fetch bounding box of face */
		app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
		.then(response => {
			if (response) {
				fetch('http://localhost:3000/image', {
					method : 'put',
					headers : { 'Content-Type' : 'application/json' },
					body : JSON.stringify({
						id : this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, { entries: count}));
				})

			}
			this.displayFaceBox(this.calculateFaceLocation(response));

		})
		.catch(err => {
			console.log(err);
		});
	}



	loadUser = (data) => {

		this.setState({ user : {

				id : data.id,
				name : data.name,
				email : data.email,
				entries : data.entries,
				joined : data.joined
			}
		});
	}


	render() {

		/* Destructure to remove code repetition */
		const { isSignedIn, imageUrl, box } = this.state;

		return (
			<div className = 'App'>
				<Particles className = 'particles' params={particlesOptions} />
				<Navigation isSignedIn = { isSignedIn } onRouteChange = { this.onRouteChange } />
				{ (this.state.route === 'home')
					? 
					<div>
						<Logo />
						<Rank name = {this.state.user.name } entries = {this.state.user.entries }/>
						<ImageLinkForm onButtonSubmit = {this.onButtonSubmit} onInputChange = {this.onInputChange} />
						<FaceRecognition box = { box } imageUrl = { imageUrl } />
					</div>
					: (
						this.state.route === 'signin' 
						? <SignIn loadUser = { this.loadUser } onRouteChange = { this.onRouteChange } />
						: <Register loadUser = { this.loadUser } onRouteChange = { this.onRouteChange } />
					)
					
				}
			</div>
		);
	}
}

export default App;
