import React, { Component } from "react";
import { ipcRenderer } from "electron";
import * as LocalRenderer from "@getflywheel/local/renderer";
import { prompts, gameState } from "./prompts";
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
} from "@getflywheel/local-components";
import { element, objectOf } from "prop-types";
import { defaultProps } from "react-select/dist/declarations/src/Select";
var parse = require("html-react-parser");
let replacements = {};
let replacementKeys = {};

export default class WeekThree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			day: 1,
		};
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});
		});

	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("spinner-done");
	}

	renderSpinner() {
		if (this.state.showSpinner) {
			return <Spinner />;
		} else {
			return null;
		}
	}

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
                                                    this.props.sites[this.props.selectedSites[0]].domain
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
                                                    this.props.sites[this.props.selectedSites[0]].domain
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
                        title={
                            <Title style={{ margin: "1em" }}>
                                Day 3
                            </Title>
                        }
                        content={
                            <div>
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
                                            Install Plugins
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
                                            disabled={this.state.showSpinner}
                                        >
                                            Install{this.state.installingThemes ? "ing" : null} Themes
                                            {this.state.installingThemes ? this.renderSpinner() : null}
                                        </Button>
                                    ) : (
                                        null
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
