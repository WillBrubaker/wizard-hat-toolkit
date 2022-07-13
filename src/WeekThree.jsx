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

export default class WeekThree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			day: null,
			tokenIsValid: null,
			installingPlugins: false,
			enablingPaypal: null,
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
			this.setState({ enablingPaypal: null });
		});

		ipcRenderer.send("what-day");
		ipcRenderer.on("is-day", (event, args) => {
			if (args && args.three) {
				this.setState({ day: args.three });
			}
		});

		ipcRenderer.send("is-token-valid");
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
									Today you will begin some basic
									troubleshooting familiarization and an
									introduction to payment gateways.
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
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout`}
											>
												Visit WooCommerce Payment
												Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://wooniversity.wordpress.com/payments/getting-started-with-payment-gateways/">
												Review Getting Started with
												Payment Gateways
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/troubleshooting/getting-started/">
												Review the Getting Started
												troubleshooting guide in
												Wooniversity
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/troubleshooting/getting-started/#troubleshooting-workflow">
												Review the troubleshooting
												workflow checklist
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/troubleshooting/woo-advanced-troubleshooting/#Error-Messages-and-Logs">
												Review the ‘Error Messages and
												Logs‘ section of Advanced
												Troubleshooting in Wooniversity.
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
									Today you will be working with WooCommerce
									Payments and some payment related
									extensions.
								</p>
								<p>
									Use the button below to install all of the
									necessary plugins for today's agenda.
								</p>
								<p>This does install the WC Pay Dev Tools</p>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> WooCommerce Payments
									requires a Jetpack connection. You can use{" "}
									<a
										href={`#/main/site-info/${this.state.siteId}/wizard-hat-toolkit/jurassic-tube`}
									>
										Jurassic Tube
									</a>{" "}
									to do this from a local test site.
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
													"woocommerce-payments",
													"woocommerce-deposits",
													"woocommerce-pre-orders",
													"woocommerce-gateway-purchase-order",
													"woocommerce-eu-vat-number",
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
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=woocommerce_payments`}
											>
												Visit WooCommerce Payments
												Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/payments/">
												WooCommerce Payments
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/payments/woocommerce-payments/">
												WooCommerce Payments on
												Wooniversity
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
									Today you will be working with the Stripe
									payment gateway.
								</p>
								<p>Use the button below to install Stripe.</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>

								<p>
									<Button
										onClick={this.installAndActivatePlugins.bind(
											this,
											["woocommerce-gateway-stripe"]
										)}
										className="woo button"
									>
										Install
										{this.state.installingPlugins
											? "ing"
											: null}{" "}
										Stripe
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
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=stripe`}
											>
												Visit Stripe Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/stripe/">
												Stripe Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/payments/stripe/">
												Stripe on Wooniversity
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
								<p>Today you will be working with PayPal.</p>
								<p>
									Use the button below to install the
									necessary plugins for today's agenda.
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
										onClick={() => {
											this.installAndActivatePlugins([
												"woocommerce-gateway-paypal-powered-by-braintree",
												"woocommerce-paypal-payments",
											]);
											this.setState({
												enablingPaypal: false,
											});
										}}
										className="woo button"
									>
										Install
										{this.state.installingPlugins
											? "ing"
											: null}{" "}
										Plugins
										{false === this.state.enablingPaypal
											? this.renderSpinner()
											: null}
									</Button>
								</p>
								<Divider
									style={{
										width: "100%",
										float: "left",
										margin: "1em",
									}}
								/>
								<p style={{ width: "100%", float: "left" }}>
									PayPal standard is hidden on new WooCommerce
									installations. To force it to load, you can
									use the code snippet from{" "}
									<a href="https://developer.woocommerce.com/2021/07/12/developer-advisory-paypal-standard-will-be-hidden-on-new-installs/">
										the announcement post
									</a>{" "}
									or press the button below to have it handled
									for you.
								</p>
								<p style={{ width: "100%", float: "left" }}>
									<Button
										onClick={() => {
											this.enablePayPalStandard();
											this.setState({
												enablingPaypal: true,
											});
										}}
										className="woo button"
									>
										Enable PayPal Standard
										{true === this.state.enablingPaypal
											? this.renderSpinner()
											: null}
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
										headerText={
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paypal`}
											>
												Visit PayPal Standard Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/paypal-standard/">
												PayPal Standard Documentation
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
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=ppcp-gateway`}
											>
												Visit PayPal Payments Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-paypal-payments/">
												PayPal Payments Documentation
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
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=braintree_paypal`}
											>
												Visit Braintree Settings
											</a>
										}
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-gateway-paypal-powered-by-braintree">
												Braintree Documentation
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
									Today you will be introduced to Square,
									GoCardless, PayFast, SnapScan, eWay, and
									Affirm payment gateways.
								</p>
								<p>
									Use the button below to install the plugins
									for today's agenda.
								</p>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> PayFast uses an ITN
									(Instant Transaction Notification) system.
									Likewise other payment gateways may require
									webhooks for some or all of their
									functionality. You can use{" "}
									<a
										href={`#/main/site-info/${this.state.siteId}/wizard-hat-toolkit/jurassic-tube`}
									>
										Jurassic Tube
									</a>{" "}
									to allow access to your site from the
									internet.
								</Banner>
								<Banner variant="warning" icon="warning">
									<strong>Note:</strong> Some payment gateways
									may require your shop address to be in a
									specific country or a specific currency. See
									the shop config options for a quick way to
									change all of these settings:{" "}
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
									<Button
										onClick={this.installAndActivatePlugins.bind(
											this,
											[
												"woocommerce-square",
												"woocommerce-gateway-gocardless",
												"woocommerce-payfast-gateway",
												"woocommerce-gateway-snapscan",
												"woocommerce-gateway-eway",
												"woocommerce-gateway-affirm",
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
										headerText="Payment Gateway Settings & Documentation"
										listItemFontWeight="300"
									>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=square_credit_card`}
											>
												Visit Square Credit Card
												Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-square/">
												WooCommerce Square Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/payments/square/">
												Square on Wooniversity
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=gocardless`}
											>
												Visit GoCardless Direct Debit
												Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/gocardless/">
												GoCardless Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/payments/gocardless/">
												GoCardless on Wooniversity
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=payfast`}
											>
												Visit PayFast Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/payfast-payment-gateway/">
												PayFast Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=snapscan`}
											>
												Visit SnapScan Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-gateway-snapscan/">
												WooCommerce SnapScan
												Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=eway`}
											>
												Visit Eway Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/eway/">
												WooCommerce Eway Documentation
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=&section=affirm`}
											>
												Visit Affirm Settings
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-gateway-affirm/">
												WooCommerce Affirm Documentation
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
		ipcRenderer.send("set-day", "three", day);
	}

	render() {
		return (
			<div>
				<div id="week-3-content">
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
