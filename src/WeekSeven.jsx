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

export default class WeekSeven extends Component {
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
			if (args && args.seven) {
				this.setState({ day: args.seven });
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
								<Title style={{ margin: "1em" }}>Days 1 & 2</Title>
								<p>
									You'll be familiarizing yourself with Facebook & Xero
								</p>
								<p>
									Use the button below to install the necessary plugins.
								</p>
								<Divider />
								<p>
									{this.state.tokenIsValid ? (
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												["woocommerce-xero", "facebook-for-woocommerce"]
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
										headerText="Facebook & Xero"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/facebook-for-woocommerce/">
												Facebook for WooCommerce
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/extensions/facebook-for-woocommerce/">
												Facebook for WooCommerce
												on Wooniversity
											</a>
										</li>
										<li>
											<a href="https://woocommerce.com/document/xero/">
												Xero
												Documentation
											</a>
										</li>
										<li>
											<a href="https://wooniversity.wordpress.com/extensions/top-extensions/xero-invoicing-accounting/">
												Xero on Wooniversity
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
								<Title style={{ margin: "1em" }}>Days 3, 4, & 5</Title>
								<p>
									In addition to a focus on interactions, you'll also be familiarizing yourself with Google Listings and Ads (Woogle). Press the button below to install Google Listings and Ads.
								</p>
								<Divider />
								<p>
										<Button
											onClick={this.installAndActivatePlugins.bind(
												this,
												["google-listings-and-ads"]
											)}
											className="woo button"
										>
											Install
											{this.state.installingPlugins
												? "ing"
												: null}{" "}
											Google Listings and Ads
											{this.renderSpinner()}
										</Button>
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
										headerText="Google Listings and Ads"
										listItemFontWeight="300"
									>
										<li>
											<a href="https://woocommerce.com/document/google-listings-and-ads/">
											Google Listings and Ads
												Documentation
											</a>
										</li>
										<li>
											<a href="https://woogleuniversity.wordpress.com/">
											Woogle University
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
		ipcRenderer.send("set-day", "seven", day);
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
						Days One & Two
					</TextButton>
					<TextButton
						onClick={() => {
							this.setDay(3);
						}}
						className={this.state.day === 3 ? "active" : null}
					>
						Days Three - Five
					</TextButton>
				</div>
				{this.dayContent()}
			</div>
		);
	}
}
