import React, { Component } from "react";
import { ipcRenderer } from "electron";
import {
	Button,
	Banner,
	Title,
	Spinner,
	Card,
	TextButton,
	Divider,
	List,
	InputPasswordToggle,
} from "@getflywheel/local-components";

export default class WeekFour extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			day: null,
			tokenIsValid: null,
			installingPlugins: false,
		};
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
		ipcRenderer.on("gh-token", (event, args) => {
			this.setState({
				tokenIsValid: args.valid,
			});
		});

		ipcRenderer.send("what-day");
		ipcRenderer.on('is-day', (event, args) => {
			if (args && args.four) {
				this.setState({day: args.four})
			}
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
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 1</Title>
								<p>
									Today you will be introduced to core
									WooCommerce shipping methods as well as the
									premium Table Rate Shipping and Distance
									rate shipping extensions.
								</p>
								<p>
									Use the button below to install all of the
									necessary plugins for today's agenda.
								</p>
								<Divider />
								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												[
													"woocommerce-table-rate-shipping",
													"woocommerce-distance-rate-shipping",
												]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											Plugins
											{this.renderSpinner()}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>

								<div
									id="list"
									style={{
										width: "100%",
										float: "left",
										marginTop: "1em",
									}}
								>
									<List
										style={{ width: "100%" }}
										bullets={true}
										headerHasDivider={true}
										headerText="Shipping"
										listItemFontWeight="300"
									>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=options`}
											>
												Visit Shipping Options Settings
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping`}
											>
												Visit Shipping Zone Settings
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=classes`}
											>
												Visit Shipping Classes Settings
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/shipping/shipping-intro/">
												Introduction to Shipping on
												Wooniversity
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/setting-up-shipping-zones/">
												Setting Up Shipping Zones
												Documentation
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/product-shipping-classes/">
												Product Shipping Classes
												Documentation
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/flat-rate-shipping/">
												Flat Rate Shipping Documentation
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/local-pickup/">
												Local Pickup Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/free-shipping/">
												Free Shipping Documentation
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
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 2</Title>
								<p>
									Today you will be introduced to box packing
									calculations and API based shipping
									calculators.
								</p>
								<p>
									Use the button below to install the plugins
									covered in today's agenda.
								</p>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> Many shipping methods
									require your site be set to a specific base
									country and/or currency. It may also make
									sense to use measurement units for the
									country the shipping service originates in.
									See the shop config options for a quick way
									to change all of these settings:{" "}
									<a
										href={`#/main/site-info/${this.state.siteId}/wizard-hat-toolkit/shop-config`}
									>
										Shop config switcheroo tool
									</a>
									.
								</Banner>
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
											onClick={this.installAndActivateWCPay.bind(
												this,
												[
													"woocommerce-shipping-usps",
													"woocommerce-shipping-ups",
													"woocommerce-shipping-fedex",
													"woocommerce-shipping-royalmail",
													"woocommerce-shipping-australia-post",
													"woocommerce-shipping-canada-post",
													"woocommerce-shipping-flat-rate-boxes",
												]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											Plugins
											{this.renderSpinner()}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>
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
										headerText="Shipping Methods Settings & Documentation"
										listItemFontWeight="300"
									>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=usps`}
											>
												Visit USPS Settings
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/shipping/shipping-plugins/usps/">
												USPS on Wooniversity
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/usps-shipping-method/">
												USPS Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=ups`}
											>
												Visit UPS Settings
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/shipping/shipping-plugins/ups/">
												UPS on Wooniversity
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/ups-shipping-method/">
												UPS Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=fedex`}
											>
												Visit FedEx Settings
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/shipping/shipping-plugins/fedex/">
												FedEx on Wooniversity
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/fedex/">
												FedEx Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=royal_mail`}
											>
												Visit Royal Mail Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/royal-mail/">
												Royal Mail Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=australia_post`}
											>
												Visit Australia Post Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/australia-post/">
												Australia Post Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=canada_post`}
											>
												Visit Canada Post Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/canada-post/">
												Canada Post Documentation
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/flat-rate-box-shipping/">
												Flat Rate Box Shipping
												Documentation
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
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 3</Title>
								<p>
									Today you will be working with taxes in
									WooCommerce Core as well as WooCommerce
									Shipping & Tax
								</p>
								<p>
									Use the button below to install plugins for
									today's agenda.
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> WooCommerce Shipping
									& Tax requires a Jetpack connection. You can
									use{" "}
									<a
										href={`#/main/site-info/${this.state.siteId}/wizard-hat-toolkit/jurassic-tube`}
									>
										Jurassic Tube
									</a>{" "}
									to do this from a local test site.
								</Banner>
								<p>
									<Button
										onClick={this.installAndActivatePlugins.bind(
											this,
											["woocommerce-services", "jetpack"]
										)}
										className="woo button"
									>
										Install
										{this.state.installingPlugins
											? "ing"
											: null}{" "}
										Plugins
										{this.renderSpinner()}
									</Button>
								</p>
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
										headerText="Tax & WooCommerce Shipping & Tax"
										listItemFontWeight="300"
									>
										<li>
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
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=shipping&section=woocommerce-services-settings`}
											>
												Visit WooCommerce Shipping
												Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-shipping-and-tax/">
												WooCommerce Shipping & Tax
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/shipping/woocommerce-shipping-tax/">
												WooCommerce Shipping & Tax on
												Wooniversity
											</a>
										</li>
									</List>
								</div>
							</div>
						}
					/>
				);
			case 4:
				return (
					<Card
						content={
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 4</Title>
								<p>
									Today you will be introduced to some popular
									third party shipping integrations that we
									support as well as some extensions that
									relate to shipping.
								</p>
								<p>
									Use the button below to install the plugins
									covered in today's agenda.
								</p>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> Shipstation will need
									to be able to reach your site. If you intend
									to test Shipstation, you can use{" "}
									<a
										href={`#/main/site-info/${this.state.siteId}/wizard-hat-toolkit/jurassic-tube`}
									>
										Jurassic Tube
									</a>{" "}
									to allow connections to your test site from
									the outside.
								</Banner>
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
													"woocommerce-shipstation-integration",
													"woocommerce-shipping-stamps",
													"woocommerce-shipment-tracking",
													"woocommerce-shipping-per-product",
													"woocommerce-shipping-multiple-addresses",
													"woocommerce-warranty",
													"woocommerce-advanced-notifications",
													"woocommerce-conditional-shipping-and-payments",
												]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											Plugins
											{this.renderSpinner()}
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
										headerText="ShipStation & Stamps.com API integration"
										listItemFontWeight="300"
									>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=integration&section=shipstation`}
											>
												Visit ShipStation Settings
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=stamps`}
											>
												Visit Stamps.com API integration
												Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/shipstation-for-woocommerce/">
												ShipStation Documentation
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-shipping-stamps/">
												Stamps.com API integration
												Documentation
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
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 5</Title>
								<p>
									Today you'll be familiarizing yourself with
									some thrid party shipping related
									extensions.
								</p>
								<p>
									Use the button below to install the plugins
									covered in today's agenda.
								</p>
								<Divider />
								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												[
													"woocommerce-advanced-shipping-packages",
													"woocommerce-shipping-local-pickup-plus",
													"woocommerce-order-delivery",
													"delivery-slots-for-woocommerce",
													"iconic-woo-delivery-slots",
													"woocommerce-pip",
												]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											Plugins
											{this.renderSpinner()}
										</Button>
									) : (
										this.tokenInput()
									)}
								</p>
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
										headerText="Shipping Related Plugin Documentation"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-advanced-shipping-packages/">
												Advanced Shipping Packages
											</a>
										</li>
										<li>
											<a
												href="http://docs.woocommerce.com/document/local-pickup-plus"
											>
												Local Pickup Plus
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/woocommerce-order-delivery/">
											Order Delivery for WooCommerce
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/delivery-slots-for-woocommerce/">
											Delivery Slots for WooCommerce
											</a>
										</li>
									<li>
											<a href="https://docs.woocommerce.com/document/iconic-delivery-slots-for-woocommerce/">
											Iconic Delivery Slots for WooCommerce
											</a>
										</li>
									<li>
											<a href="http://docs.woocommerce.com/document/woocommerce-print-invoice-packing-list">
											WooCommerce Print Invoices and Packing Lists
											</a>
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
	}

	setDay(day) {
		ipcRenderer.send("set-day", 'four', day);
	}

	render() {
		return (
			<div>
				<div id="week-4-content">
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
