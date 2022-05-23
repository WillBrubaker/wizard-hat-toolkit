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
	Container,
} from "@getflywheel/local-components";
import { element, objectOf } from "prop-types";
import { defaultProps } from "react-select/dist/declarations/src/Select";
var parse = require("html-react-parser");
let replacements = {};
let replacementKeys = {};

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
			showCheckBoxFlyover: false,
			showFlyover: false,
		};
		this.getOrderId();
		replacements = {
			"{MailhogPort}":
				this.props.sites[this.props.selectedSites[0]].services.mailhog
					.ports.WEB,
			"{domain}": this.props.sites[this.props.selectedSites[0]].domain,
			"{fromThisOrder}": this.state.orderId
				? '<a href="http://' +
				  this.props.sites[this.props.selectedSites[0]].domain +
				  "/wp-admin/post.php?post=" +
				  this.state.orderId +
				  '&action=edit">this order</a> '
				: "",
		};
		replacementKeys = Object.keys(replacements);
		this.hideFlyover = this.hideFlyover.bind(this);

		prompts.forEach((prompt) => {
			if (prompt.options) {
				prompt.options = this.shuffle(prompt.options);
			}
		});
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});
		});

		ipcRenderer.on("got-order-id", (event, data) => {
			this.setState({ orderId: JSON.parse(data)[0].ID });
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("got-order-id");
		ipcRenderer.removeAllListeners("spinner-done");
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

	renderCheckboxFlyover() {
		return (
			<FlyModal isOpen={true === this.state.showCheckBoxFlyover}>
				<Title>Confirmation before continuing.</Title>
				<div
					style={{ textAlign: "left", padding: "1em", fontSize: 18 }}
				>
					{gameState.flyoverText}
				</div>
			</FlyModal>
		);
	}

	renderFlyover() {
		return (
			<FlyModal
				isOpen={true === this.state.showFlyover}
				onRequestClose={this.hideFlyover}
			>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						<div
							style={{
								textAlign: "left",
								padding: "1em",
								fontSize: "l",
							}}
						>
							{gameState.flyoverText}
						</div>
					</Text>
				</div>
			</FlyModal>
		);
	}

	hideFlyover() {
		this.setState({
			showFlyover: false,
		});
	}

	selectOption(option, nextTextNodeId) {

		if (nextTextNodeId === 0) {
			return;
		} else if (nextTextNodeId < 0) {
			this.setState({ textNode: 1 });
			return this.startGame();
		}
		
		if (option.setState) {
			this.setState({
				showFlyover: option.setState.showFlyover,
			});
		}

		if (option.increment) {
			let value = gameState[option.increment];
			value++;
			gameState = Object.assign(gameState, { [option.increment]: value });
		}

		if ("undefined" != typeof option.action) {
			let keys = new Array();
			keys = Object.keys(option.action);
			this[keys[0]](option.action[keys[0]]);
		}

		const textNode = prompts.find((textNode) => textNode.id === nextTextNodeId);
		if (textNode.flyover) {
			this.setState({ showCheckBoxFlyover: true });
			let outPut = new Array();
			if (textNode.flyover.text) {
				textNode.flyover.text.forEach((paragraph) => {
					replacementKeys.forEach((key) => {
						paragraph = paragraph.replace(key, replacements[key]);
					});
					outPut.push(
						<p style={{ fontSize: "l" }}>{parse(paragraph)}</p>
					);
				});
			}
			textNode.flyover.checkboxes.forEach((checkbox) => {
				let stateKey = Object.keys(checkbox.setState)[0];
				gameState = Object.assign(gameState, { [stateKey]: null });
				outPut.push(
					<Container>
						<p style={{ textAlign: "left", padding: "1em" }}>
							<Text fontSize="s">
								<Checkbox
									className="woo checkbox flyover"
									shouldCloseOnOverlayClick={false}
									label={checkbox.text}
									onChange={(value) => {
										gameState = Object.assign(gameState, {
											[stateKey]: value,
										});
										this.setState({
											showCheckBoxFlyover:
												textNode.flyover.close(
													gameState
												),
										});
									}}
								/>
							</Text>
						</p>
					</Container>
				);
			});

			gameState = Object.assign(gameState, { flyoverText: outPut });
			this.setState({
				showCheckBoxFlyover: true,
			});
		}
	}

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	showTextNode() {
		const textNode = prompts.find(
			(textNode) => textNode.id === this.state.textNode
		);
		if ("undefined" === typeof textNode) {
			return;
		}
		const elements = new Array();

		textNode.text.forEach((paragraph) => {
			replacementKeys.forEach((key) => {
				paragraph = paragraph.replace(key, replacements[key]);
			});
			elements.push(
				<p style={{ padding: "1em" }}>
					<Text fontSize="l">{parse(paragraph)}</Text>
				</p>
			);
		});

		//textNode.options = this.shuffle(textNode.options);
		textNode.options.forEach((option) => {
			
			const nextTextNodeId = "function" === typeof option.nextText ? option.nextText(gameState) : option.nextText;
			if (this.showOption(option)) {
				elements.push(
					<Button
						onClick={() => {
							gameState = Object.assign(gameState, {
								lastNode: this.state.textNode,
							});
							gameState = Object.assign(gameState, option.setState);
							this.selectOption(option, nextTextNodeId);
							this.setState({
								textNode: nextTextNodeId,
							});
						}}
						className="woo button"
					>
						{option.text}
					</Button>
				);
			}
		});
		return elements;
	}

	installPlugins(plugins) {
		this.setState({
			showSpinner: true,
		});
		ipcRenderer.send("install-plugins", plugins, this.state.siteId);
	}

	getOrderId() {
		ipcRenderer.send("get-order-id", this.state.siteId);
	}

	render() {
		return (
			<div class="woo">
				<Card>
					{this.renderFlyover()}
					{this.renderCheckboxFlyover()}
					{this.showTextNode()}
				</Card>
			</div>
		);
	}
}
