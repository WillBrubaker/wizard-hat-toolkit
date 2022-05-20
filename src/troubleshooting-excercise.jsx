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
	Checkbox,
	List,
	TextButton,
	Banner,
	AdvancedToggle,
	RadioBlock,
	Container,
} from "@getflywheel/local-components";
import { element } from "prop-types";
import { defaultProps } from "react-select/dist/declarations/src/Select";
var parse = require('html-react-parser');

export default class Troubleshooting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			errorFlyoverOpen: false,
			textNode: 1,
			checkboxChecked: false,
			testEmailSent: false,
			orderId: 0,
		};
	
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});
		});

		ipcRenderer.on("got-order-id", (event, data) => {
			//this.setState({orderId: data})
			console.log(data)
		})
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
		if (nextTextNodeId === 0 ) {
			return;
		} else if (nextTextNodeId < 0) {
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
		  let keys = new Array;
		  keys = Object.keys(option.action);
		  this[keys[0]](option.action[keys[0]])
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
		if ( "undefined" === typeof textNode) {
			return;
		}
		const elements = new Array;
		const replacements = { '{MailhogPort}': this.props.sites[this.props.selectedSites[0]].services.mailhog.ports.WEB, '{domain}': this.props.sites[this.props.selectedSites[0]].domain }	
		const replacementKeys = Object.keys(replacements)
		textNode.text.forEach((paragraph) => {
			replacementKeys.forEach((key) => {
				paragraph = paragraph.replace(key, replacements[key])
			})
			elements.push(<p><Text fontSize="l">{parse(paragraph)}</Text></p>)
		});
		
		let boxes = new Array;
		let states = new Array;
		if (textNode.checkboxen) {
			boxes = textNode.checkboxen
			boxes.forEach((checkbox) => {
				gameState = Object.assign(gameState, checkbox.setState)
				//elements.push(<Container style={{ width: "100%", float: "left", fontSize: "17px"}}><Checkbox label={checkbox.label} checked={false} onChange={(value) => { this.setState({textNode: checkbox.nextText});  if (value) { gameState = Object.assign(gameState, checkbox.setState); this.selectOption(checkbox)} }}  /></Container>)
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

	installPlugins(plugins) {
		this.setState({
			showSpinner: true,
		});
		ipcRenderer.send(
			"install-plugins",
			plugins,
			this.state.siteId
		);
	}

	getOrderId() {
		ipcRenderer.send("get-order-id", this.state.siteId)
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
