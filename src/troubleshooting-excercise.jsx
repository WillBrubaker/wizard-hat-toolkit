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
var parse = require('html-react-parser');

export default class Troubleshooting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: null,
			showSpinner: false,
			errorFlyoverOpen: false,
			textNode: 1,
			checkboxChecked: false,
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
		
		if(option.increment) {
			let value = gameState[option.increment];
			value++
			gameState = Object.assign(gameState, { [option.increment]: value})
		}
		

		if ('undefined' != typeof option.action) {
		  //console.info('here is where I would do action ' + option.action)
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
		let elements = new Array;		
		textNode.text.forEach((paragraph) => {
			elements.push(<p><Text fontSize="l">{parse(paragraph)}</Text></p>)
		});

		if (textNode.checkboxen) {
			textNode.checkboxen.forEach((checkbox) => {
				console.info(gameState)
				elements.push(<Container style={{ width: "100%", float: "left", fontSize: "17px"}}><Checkbox label={checkbox.label} onChange={(event) => {gameState = Object.assign(gameState, {[checkbox.setState]: event}); this.setState({textNode: checkbox.nextText})} }/></Container>)
			})
		}

		textNode.options = this.shuffle(textNode.options);
		textNode.options.forEach((option) => {
			if (this.showOption(option)) {
				elements.push(<Button onClick={() => {this.setState({textNode: "function" === typeof option.nextText ? option.nextText(gameState) : option.nextText}); gameState = Object.assign(gameState, {lastNode: textNodeIndex}); this.selectOption(option)}} className="woo button">{option.text}</Button>)
			}
		});
		return elements;
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
