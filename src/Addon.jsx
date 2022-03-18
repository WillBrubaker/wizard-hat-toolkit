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
	TertiaryNav,
	TertiaryNavItem,
	Card,
	InputPasswordToggle,
	Divider,
	AdvancedToggle,
	List,
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

	maybeSaveToken(token) {
		ipcRenderer.send("set-user-token", token);
	}

	weekContent(week) {
		if (2 === week) {
			const content = () => (
				<div>
					<Card
						title={<Title style={{margin:"1em"}}>Day 1</Title>}
						content={
							<div>
								<p>
										Today you will be installing WooCommerce
										and demo content and becoming familiar
										with the settings.
									</p>
									<AdvancedToggle headingText={"Quick Start"} style={{height: "auto"}}>
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
									</AdvancedToggle>
					
										<p>
										<List id="wc-settings" bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${
													this.props.sites[
														this.props.match.params
															.siteID
													].domain
												}/wp-admin/admin.php?page=wc-settings`}
											>
												Visit WooCommerce Settings Page
											</a>} listItemFontWeight="300">
											<li>
													The store address section is
													where the base location for
													the store is entered. This
													address is used by tax rates
													and some shipping caclulators.
												</li>
												<li>
													Selling location(s): This
													setting will limit the
													countries available in the
													"Country" selector of the
													billing address at checkout.
												</li>
												<li>
													Shipping location(s): This
													setting will limit the
													countries available in the
													"Country" selector of the
													shipping address at
													checkout. This may be useful
													in a scenario where a
													merchant wishes to sell
													virtual products globally
													but only wishes to ship
													within their own country.
												</li>
												<li>Default customer location: For customers on the site who are not logged in or do not have any address information on file, what location should the be considered to be from? This can have an affect how prices/taxes are displayed in the shop</li>
												<li>Enable taxes: check to enable the tax settings tab. You should go ahead and enable this if it's not already.</li>
												<li>Enable coupons: enables coupons...</li>
												<li>Currency options: Which currency does the store work with. There are also some number formatting/localization settings available. This can also have an impact on payment method and/or shipping method availability, i.e. Canada Post requires the currency to be set to Canadian Dollars.</li>
												<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#general-settings">General Settings Documentation</a>
										</List>
										<List id="product-settings" bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${
													this.props.sites[
														this.props.match.params
															.siteID
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=products`}
											>
												Visit WooCommerce Product Settings Page
											</a>} listItemFontWeight="300">
											<li>
													Shop Page: Allows you to assign the WordPress page that will output an archive of the WooCommerce products.
												</li>
												<li>
													Add to cart behavior: Choose whether or not to redirect to the cart page after successful cart addition. Choose whether or not to use AJAX add to cart buttons on product archives. Bear in mind that add to cart buttons on product archives are only displayed on simple products.
												</li>
												<li>
												Placeholder image: Allows you to set a default product image. It can use either a URL to an image or an attachnent ID.
												</li>
												<li>Measurements: Sets the unit of measure appropriate to the store's region.</li>
												<li>Reviews: Self-explanatory reviews configuration options.</li>
												<li>Product Ratings: Self-explanatory product rating configuration settings.</li>
												<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#product-settings">Products Settingss Documentation</a>
										</List>
								</p>
							</div>
						}
						footer={"hello footer"}
					/>
					
						<Card
							content={
							<div>
									<AdvancedToggle headingText={"Day 2"}>
									<p>Today you will be doing Day 2 things</p>
								<ul
									style={{ listStyle: "none" }}
									class="wizard-hat"
								>
									<li>
										<Button className="woo button">
											Day2 Action1
										</Button>
									</li>
									<li>
										<Button className="woo button">
											Day2 Action2
										</Button>
									</li>
								</ul>
								</AdvancedToggle>
							</div>
							}
							footer={
								
						}
					/>
				</div>
			);
			return content;
		}
		return null;
	}

	storeConfig = () => (
		<ul style={{ listStyle: "none" }} class="wizard-hat">
			<li>
				<Button
					onClick={this.switchCountry.bind(this, "United States", {
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
					})}
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

	Tools = () => (
		<ul style={{ listStyle: "none" }} class="wizard-hat">
			<li>
				<Button onClick={this.launchPostman} className="woo button">
					Launch Postman
				</Button>
			</li>
		</ul>
	);

	Excercises = () => (
		<ul style={{ listStyle: "none" }} class="wizard-hat">
			<li>
				<Button onClick={this.testRequest} className="woo button">
					Test d/l install plugin
				</Button>
			</li>
		</ul>
	);

	tokenInput = () => (
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
					This content requires a valid{" "}
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
					onBlur={(event) => this.maybeSaveToken(event.target.value)}
				/>
			</Card>
		</div>
	);

	render() {
		if (
			"running" ===
			this.props.siteStatuses[this.props.match.params.siteID]
		) {
			return (
				<div style={{ flex: "1", overflowY: "auto", margin: "10px" }}>
					{this.renderInstructions()}
					{this.renderError()}
					<div id="wootertiarynav">
						<TertiaryNav>
							<TertiaryNavItem
								path="/shop-config"
								component={
									this.state.tokenIsValid
										? this.storeConfig
										: this.tokenInput
								}
							>
								Shop Config Options
							</TertiaryNavItem>
							<TertiaryNavItem
								path="/tools"
								component={this.Tools}
							>
								Tools
							</TertiaryNavItem>
							<TertiaryNavItem
								path="/excercises"
								component={
									this.state.tokenIsValid
										? this.Excercises
										: this.tokenInput
								}
							>
								Excercises
							</TertiaryNavItem>
							<Divider />
							<Title style={{ margin: "1em" }}>
								Onbarding Content
							</Title>
							<TertiaryNavItem
								path="/week2"
								component={
									this.state.tokenIsValid
										? this.weekContent(2)
										: this.tokenInput
								}
							>
								Week 2
							</TertiaryNavItem>
						</TertiaryNav>
					</div>
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
