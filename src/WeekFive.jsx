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
} from "@getflywheel/local-components";

export default class WeekFive extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			tokenIsValid: null,
			installingPlugins: false,
			day: null,
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
		ipcRenderer.send("what-day");
		ipcRenderer.on('is-day', (event, args) => {
			if (args && args.five) {
				this.setState({day: args.five})
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
									Today you will be introduced WooCommerce Subscriptions.
								</p>
								<p>
									Use the button below to install WooCommerce Subscriptions.
								</p>
								<Divider />
								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												[
													"woocommerce-subscriptions",
												]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											WooCommerce Subscriptions
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
										headerText="Subscriptions"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/documentation/woocommerce-extensions/woocommerce-subscriptions/">
											Subscriptions Documentation
											</a>
										</li>
										<li>
											<a href="https://subscriptionsuniversity.wordpress.com/">
											Subscriptions University
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/subscriptions/faq/">
											Subscriptions FAQ
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/subscriptions/payment-gateways/">
											Subscription Payment Methods & Gateways
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=wc-settings&tab=subscriptions`}
											>
												Visit Subscriptions Settings
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/edit.php?post_type=shop_subscription`}
											>
												Visit Subscriptions Screen
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
									Today you will working with extensions that offer enhanced subscription functionality on top of WooCommerce Subscriptions.
								</p>
								<p>
									Use the button below to install the plugins
									covered in today's agenda.
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
											onClick={this.installAndActivateWCPay.bind(
												this,
												[
													"woocommerce-subscription-downloads",
													"woocommerce-all-products-for-subscriptions",
													"woocommerce-subscriptions-gifting",
													"enhancer-for-woocommerce-subscriptions",
													"woocommerce-memberships",
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
										headerText="Subscription Related Extensions"
										listItemFontWeight="300"
									>
										<li>
											<a href="http://docs.woocommerce.com/document/woocommerce-subscription-downloads/">
											WooCommerce Subscription Downloads Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/all-products-for-woocommerce-subscriptions/">
											All Products for WooCommerce Subscriptions Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/subscriptions-gifting/">
											Gifting for WooCommerce Subscriptions Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/enhancer-for-woocommerce-subscriptions">
											Enhancer for WooCommerce Subscriptions Documentation
											</a>
										</li>
										<li>
											<a href="http://docs.woocommerce.com/document/woocommerce-memberships/">
											WooCommerce Memberships Documentation
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
									Today you will be working with AutomateWoo.
								</p>
								<p>
									Use the button below to install AutomateWoo.
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
											["automatewoo",]
										)}
										className="woo button"
									>
										Install
										{this.state.installingPlugins
											? "ing"
											: null}{" "}
										AutomateWoo
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
										headerText="AutomateWoo"
										listItemFontWeight="300"
									>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/admin.php?page=automatewoo-settings`}
											>
												Visit AutomateWoo Settings
											</a>
										</li>
										<li>
											<a
												href={`http://${
													this.props.sites[
														this.props
															.selectedSites[0]
													].domain
												}/wp-admin/edit.php?post_type=aw_workflow`}
											>
												Visit AutomateWoo Workflows Screen
											</a>
										</li>
										<li>
											<a href="https://automatewoo.com/docs/">
											AutomateWoo Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/extensions/top-extensions/automatewoo/">
											AutomateWoo on
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
									Today you will be working with some extensions related to AutomateWoo and one that is a competeting product.
								</p>
								<p>
									Use the button below to install the plugins
									covered in today's agenda.
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
													"woocommerce-follow-up-emails",
													"automatewoo-birthdays",
													"automatewoo-referrals",
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
										headerText="AutomateWoo Extensions & Follow-Ups"
										listItemFontWeight="300"
									>
										<li>
											<a
												href="https://automatewoo.com/docs/refer-a-friend/"
											>
												AutomateWoo Refer A Friend Documentation
											</a>
										</li>
										<li>
											<a
												href="https://automatewoo.com/docs/getting-started-with-birthdays/"
											>
												AutomateWoo Birthday Addon Documentation
											</a>
										</li>
										
										<li>
											<a href="https://woocommerce.com/document/automated-follow-up-emails-docs/">
											Follow-Ups Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/extensions/top-extensions/follow-up-emails/">
												Follow-Ups on Wooniversity
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
									As you work through tickets today, use your test site as needed to test cases.
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
		ipcRenderer.send("set-day", 'five', day);
	}

	render() {
		
		return (
			<div>
				<div id="week-5-content">
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
