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

export default class WeekSix extends Component {
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
		ipcRenderer.on("is-day", (event, args) => {
			if (args && args.six) {
				this.setState({ day: args.six });
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
									Today you will be introduced WooCommerce
									Bookings.
								</p>
								<p>
									Use the button below to install WooCommerce
									Bookings.
								</p>
								<Divider />
								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												["woocommerce-bookings"]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											WooCommerce Bookings
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
										headerText="Bookings"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/getting-started-with-bookings/">
												Getting Started with Bookings
												Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/creating-a-bookable-product/">
												Creating a Bookable Product
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/extensions/top-extensions/woocommerce-bookings/">
												Bookings on Wooniversity
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
									Today you will working with WooCommerce
									Accommodation Bookings and Box Office.
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
													"woocommerce-accommodation-bookings",
													"woocommerce-box-office",
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
										headerText="Accommodation Bookings & Box Office"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/woocommerce-accommodation-bookings/">
												WooCommerce Accommodation for
												Bookings Documentation
											</a>
										</li>
										<li>
											<a href="https://docs.woocommerce.com/document/woocommerce-box-office/">
												WooCommerce Box Office
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
									You will have a full day of interactions
									today. Use your test site as needed during
									the course of your support work.
								</p>
							</div>
						}
					/>
				);
			case 4:
				return (
					<Card
						content={
							<div style={{ fontSize: 16 }}>
								<Title style={{ margin: "1em" }}>Day 4 & 5</Title>
								<p>
									You will be familiarizing yourself
									with WooCommerce Product Vendors, a multi
									vendor marketplace solution for WooCommerce.
									Follow the guidance in your onboarding P2
									and wooniversity.
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
		ipcRenderer.send("set-day", "six", day);
	}

	render() {
		if (null === this.state.day) {
			this.setState({ day: 1 });
		}
		return (
			<div>
				<div id="week-6-content">
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
						Day Four & Five
					</TextButton>
				</div>
				{this.dayContent()}
			</div>
		);
	}
}
