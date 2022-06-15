import React, { Component } from "react";
import { ipcRenderer } from "electron";
import {
	Button,
	FlyModal,
	Title,
	Text,
	Spinner,
	Card,
	Checkbox,
	Container,
    TextButton,
    Divider,
    List,
    InputPasswordToggle,
} from "@getflywheel/local-components";


export default class WeekThree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			day: 1,
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

        ipcRenderer.send('is-token-valid');
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

    installAndActivateWCPay(pluginsToInstall) {
        ipcRenderer.send('install-wc-dev-tools', this.state.siteId)
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
					<a href="https://github.com/settings/tokens">
						GitHub token
					</a>{" "}
					with 'repo' scope enabled.
				</p>
				<p>Please enter a valid token to continue.</p>
				<p><InputPasswordToggle
					onChange={(event) =>
						this.maybeSaveToken(event.target.value)
					}
					onBlur={(event) => this.maybeSaveToken(event.target.value)}
					
				/></p>
		</div>
	);

    dayContent() {
        switch (this.state.day) {
            case 1:
                return (
                    <Card
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 1
                            </Title>
                        }
                        content={
                            <div>
                                <p>
                                    Today you will begin some basic troubleshooting familiarization and an introduction to payment gateways.
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
                                                    this.props.sites[this.props.selectedSites[0]].domain
                                                }/wp-admin/admin.php?page=wc-settings&tab=checkout`}
                                            >
                                                Visit WooCommerce
                                                Payment Settings
                                            </a>
                                        }
                                        listItemFontWeight="300"
                                    >
                                        <li>
                                            <a href="https://wooniversity.wordpress.com/payments/getting-started-with-payment-gateways/">
                                                Review Getting Started with Payment Gateways
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
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 2
                            </Title>
                        }
                        content={
                            <div>
                                <p>
                                    Today you will be working with WooCommerce Payments and some payment related extensions.
                                </p>
                                <p>
                                    Use the button below to install all
                                    of the necessary plugins for today's
                                    agenda.
                                   
                                </p>
                                <p>This does install the WC Pay Dev Tools </p>
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
                                            Install{this.state.installingPlugins ? "ing" : null} Plugins
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
            case 3:
                return (
                    <Card
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 3
                            </Title>
                        }
                        content={
                            <div>
                                <p>
                                    Today you will be working with the Stripe payment gateway.
                                </p>
                                <p>
                                    Use the button below to install Stripe.
                                   
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
                                                    "woocommerce-gateway-stripe",
                                                ]
                                            )}
                                            className="woo button"
                                        >
                                            Install{this.state.installingPlugins ? "ing" : null} Plugins
                                            {this.renderSpinner()}
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </p>
                            </div>
                        }
                    />
                );
            case 4:
                return (
                    <Card
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 4
                            </Title>
                        }
                        content={
                            <div>
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
                                                    this.props.sites[this.props.selectedSites[0]].domain
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
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 5
                            </Title>
                        }
                        content={
                            <div>
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
                                            disabled={this.state.showSpinner}
                                        >
                                            Install{this.state.installingPlugins ? "ing" : null} Plugins
                                            {this.state.installingPlugins ? this.renderSpinner() : null}
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </p>
                                <Divider
                                    style={{
                                        width: "100%",
                                        float: "left",
                                        margin: "1em",
                                    }}
                                />
                                <p style={{
                                    width: "100%",
                                    float: "left",
                                }}>
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
                            </div>
                        }
                    />
                );
            default:
                return null;
        }
    }

	render() {
		return (
			<div>
				<div id="week-2-content">
					<TextButton
						onClick={() => {
							this.setState({ day: 1 });
						}}
					>
						Day One
					</TextButton>
					<TextButton
						onClick={() => {
							this.setState({ day: 2 });
						}}
					>
						Day Two
					</TextButton>
					<TextButton
						onClick={() => {
							this.setState({ day: 3 });
						}}
					>
						Day Three
					</TextButton>
					<TextButton
						onClick={() => {
							this.setState({ day: 4 });
						}}
					>
						Day Four
					</TextButton>
					<TextButton
						onClick={() => {
							this.setState({ day: 5 });
						}}
					>
						Day Five
					</TextButton>
				</div>
                {this.dayContent()}
			</div>
		);
	}
}
