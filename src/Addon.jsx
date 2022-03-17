import React, { Component } from "react";
import { ipcRenderer } from "electron";
const { exec } = require("child_process");

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
import * as LocalRenderer from "@getflywheel/local/renderer";

// https://github.com/getflywheel/local-components
import {
	Button,
	FlyModal,
	Title,
	Text,
	Spinner,
	Container,
	TertiaryNav,
	TertiaryNavItem,
	Card,
	InputPasswordToggle,
	Divider,
} from "@getflywheel/local-components";

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showInstructions: false,
			showError: false,
			localeSwitchedTo: "",
			showSpinner: false,
			tokenIsValid: false,
		};

		this.hideInstructions = this.hideInstructions.bind(this);
		this.hideError = this.hideError.bind(this);
		this.showSpinner = this.showSpinner.bind(this);
		this.testRequest = this.testRequest.bind(this);
		this.launchPostman = this.launchPostman.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on("instructions", (event) => {
			this.setState({
				showInstructions: true,
			});
			this.setState({
				showSpinner: false,
			});
		});

		ipcRenderer.on("error", (event) => {
			this.setState({
				showError: true,
			});
			this.setState({
				showSpinner: false,
			});
		});

		ipcRenderer.on("gh-token", (event, args) => {
			this.setState({
				tokenIsValid: args.valid,
			});
		});

		ipcRenderer.on("debug-message", (event, args) => {
			console.info(args);
		});

		ipcRenderer.send("validate-token");
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("instructions");
		ipcRenderer.removeAllListeners("error");
		ipcRenderer.removeAllListeners("gh-token");
		ipcRenderer.removeAllListeners("debug-message");
	}

	hideInstructions() {
		this.setState({
			showInstructions: false,
		});
	}

	hideError() {
		this.setState({
			showError: false,
		});
	}

	switchCountry(newLocale, optionsToSet) {
		this.setState({
			showSpinner: true,
		});
		ipcRenderer.send("switch-country", this.state.siteId, optionsToSet);
		this.localeSwitchedTo = newLocale;
	}

	testRequest() {
		ipcRenderer.send("test-request");
	}

	launchPostman() {
		exec("open -a Postman");
	}

	renderInstructions() {
		return (
			<FlyModal
				isOpen={this.state.showInstructions}
				onRequestClose={this.hideInstructions}
			>
				<Title fontSize="xl">Great Success!</Title>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						Site locale switcheroo to {this.localeSwitchedTo}{" "}
						happened without incident!
					</Text>
				</div>
			</FlyModal>
		);
	}

	renderError() {
		return (
			<FlyModal
				isOpen={this.state.showError}
				onRequestClose={this.hideError}
			>
				<Title fontSize="xl">Much Sadness :(</Title>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						There was some sort of an error. Check the logs maybe.
					</Text>
				</div>
			</FlyModal>
		);
	}

	showSpinner() {
		return this.state.showSpinner;
	}

	renderSpinner() {
		if (this.state.showSpinner) {
			return <Spinner />;
		} else {
			return null;
		}
	}

	renderItemOne() {
		return <div>Item 1 Content</div>;
	}

	maybeSaveToken(token) {
		ipcRenderer.send("set-user-token", token);
	}

	weekContent(week) {
		if (2 === week) {
			const content = () => (
				<div>
					<Card
						header={<Title>Day 1</Title>}
						content={
							<div>
								<p>
									Today you will be installing WooCommerce and
									demo content and becoming familiar with the
									settings.
								</p>
							</div>
						}
						footer={
							<div>
								<ul
									style={{ listStyle: "none" }}
									class="wizard-hat"
								>
									<li>
										<Button className="woo button">
											Install WooCommerce
										</Button>
									</li>
									<li>
										<Button className="woo button">
											Install Demo Content
										</Button>
									</li>
								</ul>
							</div>
						}
					/>
				</div>
			);
			return content;
		}
		return null;
	}

	storeConfig() {
		return (
			<ul style={{ listStyle: "none" }} class="wizard-hat">
				<li>
					<Button
						onClick={this.switchCountry.bind(
							this,
							"United States",
							{
								woocommerce_store_address: "537 Paper Street",
								woocommerce_store_address_2: "#34",
								woocommerce_store_city: "Wilmington",
								woocommerce_default_country: "US:DE",
								woocommerce_store_postcode: "19806",
								woocommerce_currency: "USD",
								woocommerce_price_thousand_sep: ",",
								woocommerce_price_decimal_sep: ".",
								woocommerce_weight_unit: "lbs",
								woocommerce_dimension_unit: "in",
							}
						)}
						className="woo button"
					>
						Switch Site to United States
						{this.renderSpinner()}
					</Button>
				</li>
				<li>
					<Button
						onClick={this.switchCountry.bind(this, "Europe", {
							woocommerce_store_address: "Brederopad 77",
							woocommerce_store_address_2: "",
							woocommerce_store_city: "Delft",
							woocommerce_default_country: "NL",
							woocommerce_store_postcode: "2624 XR",
							woocommerce_currency: "EUR",
							woocommerce_price_thousand_sep: " ",
							woocommerce_price_decimal_sep: ",",
							woocommerce_weight_unit: "kg",
							woocommerce_dimension_unit: "cm",
						})}
						className="woo button"
					>
						Switch Site to Europe
						{this.renderSpinner()}
					</Button>
				</li>
				<li>
					<Button
						onClick={this.switchCountry.bind(this, "Australia", {
							woocommerce_store_address: "28 Kaesler Road",
							woocommerce_store_address_2: "",
							woocommerce_store_city: "Mount Burr",
							woocommerce_default_country: "AU:SA",
							woocommerce_store_postcode: "5279",
							woocommerce_currency: "AUD",
							woocommerce_price_thousand_sep: " ",
							woocommerce_price_decimal_sep: ",",
							woocommerce_weight_unit: "kg",
							woocommerce_dimension_unit: "cm",
							woocommerce_dimension_unit: "in",
						})}
						className="woo button"
					>
						Switch Site to Australia
						{this.renderSpinner()}
					</Button>
				</li>
				<li>
					<Button
						onClick={this.switchCountry.bind(this, "Canada", {
							woocommerce_store_address: "40 Bay St",
							woocommerce_store_address_2: "",
							woocommerce_store_city: "Toronto",
							woocommerce_default_country: "CA:ON",
							woocommerce_store_postcode: "M5J 2X2",
							woocommerce_currency: "CAD",
							woocommerce_price_thousand_sep: " ",
							woocommerce_price_decimal_sep: ",",
							woocommerce_weight_unit: "kg",
							woocommerce_dimension_unit: "cm",
						})}
						className="woo button"
					>
						Switch Site to Canada
						{this.renderSpinner()}
					</Button>
				</li>
			</ul>
		);
	}

	Tools() {
		return (
			<ul style={{ listStyle: "none" }} class="wizard-hat">
				<li>
					<Button onClick={this.launchPostman} className="woo button">
						Launch Postman
					</Button>
				</li>
			</ul>
		);
	}

	Excercises() {
		return (
			<ul style={{ listStyle: "none" }} class="wizard-hat">
				<li>
					<Button onClick={this.testRequest} className="woo button">
						Test d/l install plugin
					</Button>
				</li>
			</ul>
		);
	}

	render() {
		if (
			"running" ===
				this.props.siteStatuses[this.props.match.params.siteID] &&
			this.state.tokenIsValid
		) {
			return (
				<div style={{ flex: "1", overflowY: "auto", margin: "10px" }}>
					{this.renderInstructions()}
					{this.renderError()}
					<div id="wootertiarynav">
						<TertiaryNav>
							<TertiaryNavItem
								path="/storeConfig"
								component={this.storeConfig}
							>
								Store Config Options
							</TertiaryNavItem>
							<TertiaryNavItem
								path="/Tools"
								component={this.Tools}
							>
								Tools
							</TertiaryNavItem>
							<TertiaryNavItem
								path="/Excercises"
								component={this.Excercises}
							>
								Excercises
							</TertiaryNavItem>
							<Divider />
							<Title style={{ margin: "1em" }}>
								Onbarding Content
							</Title>
							<TertiaryNavItem
								path="/week2"
								component={this.weekContent(2)}
							>
								Week 2
							</TertiaryNavItem>
						</TertiaryNav>
					</div>
				</div>
			);
		} else if (
			"running" ===
			this.props.siteStatuses[this.props.match.params.siteID]
		) {
			return (
				<div
					style={{
						flexGrow: "1",
						overflow: "auto",
						position: "relative",
					}}
					class="woo gh-token"
				>
					<Card>
						<p>
							The token is invalid. You will need a valid{" "}
							<a href="https://github.com/settings/tokens">
								GitHub token
							</a>{" "}
							with 'repo' scope enabled.
						</p>
						<p>Please enter a valid token to continue.</p>
						<InputPasswordToggle
							onChange={(event) =>
								this.maybeSaveToken(event.target.value)
							}
							onBlur={(event) =>
								this.maybeSaveToken(event.target.value)
							}
						/>
					</Card>
				</div>
			);
		} else {
			return (
				<div style={{ flex: "1", overflowY: "auto", margin: "10px" }}>
					<Card>No interface while site not running.</Card>
				</div>
			);
		}
	}
}
