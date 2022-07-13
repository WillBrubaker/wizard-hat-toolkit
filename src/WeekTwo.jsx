import React, { Component } from "react";
import { ipcRenderer } from "electron";
import {
	Button,
	Title,
	Spinner,
	Card,
	TextButton,
	Divider,
	List,
	InputPasswordToggle,
	Banner,
} from "@getflywheel/local-components";

export default class WeekTwo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			tokenIsValid: null,
			installingPlugins: false,
			day: null,
		};
		this.installWoocommerce = this.installWoocommerce.bind(this);
		this.installThemes = this.installThemes.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});

			this.setState({
				installingPlugins: false,
			});
		});

		ipcRenderer.send("is-token-valid");
		ipcRenderer.send("what-day");
		ipcRenderer.on('is-day', (event, args) => {
			if (args && args.two) {
				this.setState({day: args.two})
			}
		});

		ipcRenderer.on("gh-token", (event, args) => {
			this.setState({
				tokenIsValid: args.valid,
			});
		});

		ipcRenderer.on("token-is-valid", (event, tokenIsValid) => {
			this.setState({
				tokenIsValid: tokenIsValid,
			});
		});

		ipcRenderer.send("validate-token");
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("spinner-done");
		ipcRenderer.removeAllListeners("gh-token");
		ipcRenderer.removeAllListeners("token-is-valid");
		ipcRenderer.removeAllListeners("is-day");
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

	installAndActivatePlugins(pluginsToInstall) {
		this.setState({
			showSpinner: true,
		});
		this.setState({
			installingPlugins: true,
		});
		ipcRenderer.send(
			"install-plugins",
			pluginsToInstall,
			this.state.siteId
		);
	}

	enablePayPalStandard(pluginsToInstall) {
		this.setState({
			showSpinner: true,
		});
		ipcRenderer.send("enable-paypal-standard", this.state.siteId);
	}

	installAndActivateWCPay(pluginsToInstall) {
		ipcRenderer.send("install-wc-dev-tools", this.state.siteId);
		this.setState({
			showSpinner: true,
		});
		this.setState({
			installingPlugins: true,
		});
		ipcRenderer.send(
			"install-plugins",
			pluginsToInstall,
			this.state.siteId
		);
	}

	installThemes(themesToInstall) {
		this.setState({
			showSpinner: true,
		});
		this.setState({
			installingThemes: true,
		});
		ipcRenderer.send("install-themes", themesToInstall, this.state.siteId);
	}

	installWoocommerce() {
		this.setState({
			showSpinner: true,
		});
		ipcRenderer.send(
			"install-woocommerce",
			this.state.siteId,
			this.state.rootPath
		);
	}

	tokenInput = () => (
		<div
			style={{
				flexGrow: "1",
				position: "relative",
			}}
			class="woo gh-token"
		>
			<p>
				This content requires a valid{" "}
				<a href="https://github.com/settings/tokens">GitHub token</a>{" "}
				with 'repo' scope enabled.
			</p>
			<p>Please enter a valid token to continue.</p>
			<p>
				<InputPasswordToggle
					onChange={(event) =>
						this.maybeSaveToken(event.target.value)
					}
					onBlur={(event) => this.maybeSaveToken(event.target.value)}
				/>
			</p>
		</div>
	);

	dayContent() {
		switch (this.state.day) {
			case 1:
				return (
					<Card
						content={
							<div>
								<Title style={{ margin: "1em" }}>
									Day 1
								</Title>
								<p>
									Today you will be installing
									WooCommerce and demo content and
									becoming familiar with the settings.
								</p>
								<p>
									If you haven't already installed
									WooCommerce or imported the demo
									content, you can use the button
									below.
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<p>
									<Button
										className="woo button"
										onClick={
											this.installWoocommerce
										}
									>
										Install
										{this.state.showSpinner
											? "ing"
											: null}{" "}
										WooCommerce & Demo Content
										{this.renderSpinner()}
									</Button>
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<div
									id="list"
									style={{
										width: "100%",
										float: "left",
									}}
								>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings`}
											>
												Visit WooCommerce
												Settings Page
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#general-settings">
												General Settings
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-general-settings">
												Review General Settings
											</a>
										</li>
									</List>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=products`}
											>
												Visit WooCommerce
												Product Settings Page
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#product-settings">
												Products Settings
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-product-settings">
												Review Product Settings
											</a>
										</li>
									</List>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=products&section=inventory`}
											>
												Visit Inventory Options
												Page
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#products-inventory-options">
												Inventory Options
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-inventory-options">
												Review Inventory Options
											</a>
										</li>
									</List>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=products&section=downloadable`}
											>
												Visit Downloadable
												Products Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/configuring-woocommerce-settings/#products-downloadable-products">
												Downloadable Products
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-downloadable-product-settings">
												Review Downloadable
												Products Settings
											</a>
										</li>
									</List>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=tax`}
											>
												Visit Tax Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/setting-up-taxes-in-woocommerce/">
												Tax Settings
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/onboarding/woo-crash-course-woocommerce-101/#review-tax-settings">
												Review Tax Settings
											</a>
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
						content={
							<div>
								<Title style={{ margin: "1em" }}>
									Day 2
								</Title>
								<p>
									Today you will be reviewing the
									WooCommerce system status report and
									the system tools included with
									WooCommerce.
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<div
									id="list"
									style={{
										width: "100%",
										float: "left",
									}}
								>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-status`}
											>
												Visit WooCommerce System
												Status Report
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/">
												Understanding the
												WooCommerce System
												Status Report
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/troubleshooting/the-system-status-report-ssr/">
												The System Status Report
												(SSR)
											</a>
										</li>
									</List>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-status&tab=tools`}
											>
												Visit WooCommerce System
												Tools
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/understanding-the-woocommerce-system-status-report/#section-16">
												System Tools
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/troubleshooting/woocommerce-system-tools/">
												WooCommerce System Tools
											</a>
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
						content={
							<div>
								<Title style={{ margin: "1em" }}>
									Day 3
								</Title>
								<p>
									Today you will be diving into
									extensions on the WooCommerce
									Marketplace with a focus on bundles
									and add-ons.
								</p>
								<p>
									Use the button below to install all
									of the necessary plugins for today's
									agenda.
									<Banner
										variant="warning"
										icon="warning"
									>
										<strong>Note:</strong> Gravity
										Forms Product Add-ons requires
										the premium Gravity Forms
										plugin. See{" "}
										<a href="https://mc.a8c.com/secret-store/?secret_id=4889">
											here
										</a>
										. This will need to be installed
										manually.
									</Banner>
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												[
													"woocommerce-chained-products",
													"woocommerce-product-bundles",
													"woocommerce-force-sells",
													"woocommerce-composite-products",
													"woocommerce-mix-and-match-products",
													"woocommerce-product-addons",
													"woocommerce-checkout-add-ons",
													"woocommerce-gravityforms-product-addons",
													"woocommerce-ninjaforms-product-addons",
													"ninja-forms",
												]
											)}
											className="woo button"
										>
											Install{this.state.showSpinner
											? "ing"
											: null} Plugins
											{this.renderSpinner()}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>
							</div>
						}
					/>
				);
			case 4:
				return (
					<Card
						content={
							<div>
								<Title style={{ margin: "1em" }}>
									Day 4
								</Title>
								<p>
									You'll be working with
									WooCommerce.com accounts today. The
									most relevant part of your test site
									would be the WooCommerce.com
									extensions tab and subscription
									management.
								</p>
								<div>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-addons&section=helper`}
											>
												Visit 'My Subscriptions'
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/managing-woocommerce-com-subscriptions/">
												Managing WooCommerce.com
												Subscriptions
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/woocommerce-com/woocommerce-accounts/extending-subscriptions/customer-options-for-managing-wccom-subscriptions/">
												Customer Options for
												Managing WCcom
												Subscriptions
											</a>
										</li>
									</List>
								</div>
							</div>
						}
					/>
				);
			case 5:
				return (
					<Card
						content={
							<div>
								<Title style={{ margin: "1em" }}>
									Day 5
								</Title>
								<p>
									Today you will be working with the
									Storefront theme, child themes, and
									associated plugins as well as
									importing/exporting.
								</p>
								<p>
									Use the button below to install all
									of the necessary plugins for today's
									agenda.
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												[
													"storefront-homepage-contact-section",
													"storefront-hamburger-menu",
													"storefront-product-sharing",
													"storefront-footer-bar",
													"storefront-powerpack",
													"storefront-mega-menus",
													"storefront-reviews",
													"storefront-pricing-tables",
													"storefront-product-hero",
													"storefront-blog-customiser",
													"storefront-parallax-hero",
													"woocommerce-product-csv-import-suite",
												]
											)}
											className="woo button"
											disabled={
												this.state.showSpinner
											}
										>
											Install
											{this.state
												.installingPlugins
												? "ing"
												: null}{" "}
											Plugins
											{this.state
												.installingPlugins
												? this.renderSpinner()
												: null}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>
								<p
									style={{
										width: "100%",
										float: "left",
									}}
								>
									Use the button below to install all
									of the necessary themes for today's
									agenda.
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installThemes.bind(
												this,
												[
													"deli",
													"boutique",
													"outlet",
													"pharmacy",
													"homestore",
												]
											)}
											className="woo button"
											disabled={
												this.state.showSpinner
											}
										>
											Install
											{this.state.installingThemes
												? "ing"
												: null}{" "}
											Themes
											{this.state.installingThemes
												? this.renderSpinner()
												: null}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>
							</div>
						}
					/>
				);
			default:
				return null;
		}
	}

	setDay(day) {
		ipcRenderer.send("set-day", 'two', day);
	}

	render() {
		
		return (
			<div>
				<div id="week-2-content">
					<TextButton
						onClick={() => {
							this.setDay(1);
						}}
						className={this.state.day === 1 ? "active" : null}
					>
						Day One
					</TextButton>
					<TextButton
						onClick={() => {
							this.setDay(2);
						}}
						className={this.state.day === 2 ? "active" : null}
					>
						Day Two
					</TextButton>
					<TextButton
						onClick={() => {
							this.setDay(3);
						}}
						className={this.state.day === 3 ? "active" : null}
					>
						Day Three
					</TextButton>
					<TextButton
						onClick={() => {
							this.setDay(4);
						}}
						className={this.state.day === 4 ? "active" : null}
					>
						Day Four
					</TextButton>
					<TextButton
						onClick={() => {
							this.setDay(5);
						}}
						className={this.state.day === 5 ? "active" : null}
					>
						Day Five
					</TextButton>
				</div>
				{this.dayContent()}
			</div>
		);
	}
}
