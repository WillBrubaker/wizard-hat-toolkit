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
	List,
	TextButton,
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
			dayContent: 1,
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
		let weekContent;
		if (2 === week) {
			weekContent = () => (
				<div>
					<div id="week-1-content">
						<TextButton onClick={() => { this.setState({ dayContent: 1 }) }} >Day One</TextButton>
						<TextButton onClick={() => { this.setState({ dayContent: 2 }) }} >Day Two</TextButton>
						<TextButton onClick={() => { this.setState({ dayContent: 3 }) }} >Day Three</TextButton>
						<TextButton onClick={() => { this.setState({ dayContent: 4 }) }} >Day Four</TextButton>
						<TextButton onClick={() => { this.setState({ dayContent: 5 }) }} >Day Five</TextButton>
						{this.dayContent(2)}
					</div>
				</div>

			);
			return weekContent;
		}
		return null;
	}

	installBundleAddonPlugins() {
		ipcRenderer.send("install-bundle-addon-plugins");
	}

	dayContent(week) {
		let todayContent;
		switch (week) {
			case 2:
				switch (this.state.dayContent) {
					case 1:
						return (
							<Card
								title={<Title style={{ margin: "1em" }}>Day 1</Title>}
								content={
									<div>
										<p>
											Today you will be installing WooCommerce and demo content and becoming familiar with the settings.
										</p>
										<p>If you haven't already installed WooCommerce or imported the demo content, you can use the buttons below.</p>
										<Divider style={{ width: "100%", float: "left", margin: "1em" }} />

										<p>
											<Button className="woo button">
												Install WooCommerce
											</Button>
										</p>
										<p>
											<Button className="woo button">
												Install Demo Content
											</Button>
										</p>
										<Divider style={{ width: "100%", float: "left", margin: "1em" }} />

										<div id="list" style={{ width: "100%", float: "left" }}>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-settings`}
											>
												Visit WooCommerce Settings Page
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#general-settings">General Settings Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-general-settings">Review General Settings</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-settings&tab=products`}
											>
												Visit WooCommerce Product Settings Page
											</a>} listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#product-settings">Products Settings Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-product-settings">Review Product Settings</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-settings&tab=products&section=inventory`}
											>
												Visit Inventory Options Page
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#products-inventory-options">Inventory Options Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-inventory-options">Review Inventory Options</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-settings&tab=products&section=downloadable`}
											>
												Visit Downloadable Products Settings
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#products-downloadable-products">Downloadable Products Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-downloadable-product-settings">Review Downloadable Products Settings</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-settings&tab=tax`}
											>
												Visit Tax Settings
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/setting-up-taxes-in-woocommerce/">Tax Settings Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-tax-settings">Review Tax Settings</a>
												</li>
											</List>
										</div>
									</div>
								}
							/>
						);
					case 2:
						return (
							<Card
								title={<Title style={{ margin: "1em" }}>Day 2</Title>}
								content={
									<div>
										<p>
											Today you will be reviewing the WooCommerce system status report and the system tools included with WooCommerce.
										</p>
										<Divider style={{ width: "100%", float: "left", margin: "1em" }} />

										<div id="list" style={{ width: "100%", float: "left" }}>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-status`}
											>
												Visit WooCommerce System Status Report
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/">Understanding the WooCommerce System Status Report</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/troubleshooting/the-system-status-report-ssr/">The System Status Report (SSR)</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-status&tab=tools`}
											>
												Visit WooCommerce System Tools
											</a>} listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/#section-16">System Tools Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/troubleshooting/woocommerce-system-tools/">WooCommerce System Tools</a>
												</li>
											</List>
										</div>
									</div>
								}
							/>
						);
					case 3:
						return (
							<Card
								title={<Title style={{ margin: "1em" }}>Day 2</Title>}
								content={
									<div>
										<p>
											Today you will be diving into extensions on the WooCommerce Marketplace with a focus on bundles and add-ons. You will also start to get into troubleshooting WooCommerce.
										</p>
										<p>Use the button below to install all of the necessary plugins for today's agenda.</p>
										<Divider style={{ width: "100%", float: "left", margin: "1em" }} />

										<p>
											<Button onClick={this.installBundleAddonPlugins} className="woo button">
												Install Plugins
											</Button>
										</p>
										<Divider style={{ width: "100%", float: "left", margin: "1em" }} />

										<div id="list" style={{ width: "100%", float: "left" }}>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-status`}
											>
												Visit WooCommerce System Status Report
											</a>}
												listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/">Understanding the WooCommerce System Status Report</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/troubleshooting/the-system-status-report-ssr/">The System Status Report (SSR)</a>
												</li>
											</List>
											<List style={{ width: "100%" }} bullets={true} headerHasDivider={true} headerText={<a
												href={`http://${this.props.sites[
													this.props.match.params
														.siteID
												].domain
													}/wp-admin/admin.php?page=wc-status&tab=tools`}
											>
												Visit WooCommerce System Tools
											</a>} listItemFontWeight="300">
												<li>
													<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/#section-16">System Tools Documentation</a>
												</li>
												<li>
													<a href="https://wooniversity.wordpress.com/troubleshooting/woocommerce-system-tools/">WooCommerce System Tools</a>
												</li>
											</List>
										</div>
									</div>
								}
							/>
						);
					default:
						return null;
				}
		};

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

	Troubleshooting = () => (
		<div>
			<Card>
				<p>This is the troubleshooting section</p>
			</Card>
		</div>
	);

	pluginManagement = () => (
		<div>
			<Card>
				<p>
					This is the plugin management section
				</p>
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
							<Title style={{ margin: "1em" }}>
								Utilities
							</Title>
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
								path="/pluginManagement"
								component={this.state.tokenIsValid
									? this.pluginManagement
									: this.tokenInput}
							>
								Plugin Management
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
							<Divider />
							<Title style={{ margin: "1em" }}>
								Troubleshooting
							</Title>
							<TertiaryNavItem
								path="/troubleshooting"
								component={
									this.Troubleshooting
								}
							>
								Lessons
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
