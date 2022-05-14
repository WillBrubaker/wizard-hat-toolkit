import React, { Component } from "react";
import { ipcRenderer } from "electron";
import * as LocalRenderer from "@getflywheel/local/renderer";
import { prompts, gameState } from "./prompts";
import {
	Button,
	FlyModal,
	Title,
	Text,
	Spinner,
	Card,
	Divider,
	List,
	TextButton,
	Banner,
	AdvancedToggle,
	Checkbox,
	RadioBlock,
	Container,
} from "@getflywheel/local-components";
import { element } from "prop-types";

export default class Troubleshooting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: null,
			showSpinner: false,
			wpEmailSent: false,
			loggingTestEmailSent: false,
			wpEmailIsReceived: null,
			wpEmailIsLogged: null,
			wpEmailTroubleshootingExhausted: false,
			adminOrderEmailReceived: null,
			adminOrderEmailSent: null,
			testEmailSent: false,
			emailScenarioSetUp: false,
			mailLoggingPluginActive: false,
			postConflictEmailLogged: false,
			adminOrderEmailTested: false,
			newOrderStatus: null,
			newOrderCreated: false,
			orderStatusFlyoverOpen: false,
			orderStatusTransitioned: null,
			transitionedOrderEmailReceieved: null,
			transitionedOrderEmailLogged: null,
			orderTransitionedEmailReceived: null,
			textNode: 1,
		};
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});
		});
	}

	renderSpinner() {
		if (this.state.showSpinner) {
			return <Spinner />;
		} else {
			return null;
		}
	}

	step14text() {
		return "Awesome! What step do you take next?";
	}

	showOption(option) {
		return option.requiredState == null || option.requiredState(gameState);
	}

	selectOption(option) {
		const nextTextNodeId = option.nextText
		if (nextTextNodeId <= 0) {
		  this.setState({textNode: 1});
		  return this.startGame()
		}
		gameState = Object.assign(gameState, option.setState)
		console.info(gameState)
		
		if ('undefined' != typeof option.action) {
		  console.info('here is where I would do action ' + option.action)
		}
		return this.showTextNode(this.state.textNode)
	  }

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	showTextNode(textNodeIndex) {
		const textNode = prompts.find(
			(textNode) => textNode.id === textNodeIndex
		);
		let elements = [];
		if ( 23 === textNodeIndex || 18 === textNodeIndex) {
			console.info(textNode)
		}
		
		textNode.text.forEach((paragraph) => {
			elements.push(<p><Text fontSize="l">{paragraph}</Text></p>)
		});
		textNode.options = this.shuffle(textNode.options);
		
		textNode.options.forEach((option) => {
			if (this.showOption(option)) {
				elements.push(<Button onClick={() => {this.setState({textNode: option.nextText}); this.selectOption(option)}} className="woo button">{option.text}</Button>)
			}
		});
		return elements;
	}

	startGame() {
		gameState = {};
		return (this.showTextNode(1));
	}

	render() {
		return (
			<div class="woo">
				<Card>
					{this.showTextNode(this.state.textNode)}
				</Card>
			</div>
		);
	}
}
