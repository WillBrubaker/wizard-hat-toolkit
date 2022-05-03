import React, { Component } from "react";
import { ipcRenderer } from "electron";
import * as LocalRenderer from "@getflywheel/local/renderer";

import {
	Button,
	FlyModal,
	Title,
	Text,
	Spinner,
	Card,
	Divider,
	List,
	TextButton,
	Banner,
	AdvancedToggle,
	Checkbox,
	RadioBlock,
	Container,
} from "@getflywheel/local-components";

export default class Troubleshooting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: null,
			showSpinner: false,
			wpEmailSent: false,
			loggingTestEmailSent: false,
			wpEmailIsReceived: null,
			wpEmailIsLogged: null,
			wpEmailTroubleshootingExhausted: false,
			adminOrderEmailReceived: null,
			adminOrderEmailSent: null,
			testEmailSent: false,
			emailScenarioSetUp: false,
			mailLoggingPluginActive: false,
			postConflictEmailLogged: false,
			adminOrderEmailTested: false,
			newOrderStatus: null,
			newOrderCreated: false,
			orderStatusFlyoverOpen: false,
			orderStatusTransitioned: null,
			transitionedOrderEmailReceieved: null,
			transitionedOrderEmailLogged: null,
			orderTransitionedEmailReceived: null,
		};
		this.hideInstructions = this.hideInstructions.bind(this);
		this.orderStatusSet = this.orderStatusSet.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on("spinner-done", () => {
			this.setState({
				showSpinner: false,
			});
		});
	}

	renderSpinner() {
		if (this.state.showSpinner) {
			return <Spinner />;
		} else {
			return null;
		}
	}

	setUpScenario() {
		if (!this.state.emailScenarioSetUp) {
			return (
				<Container>
					<p>Click the button below to set up the scenario</p>
					<p>
						<Button
							onClick={() => {
								this.setState({
									emailScenarioSetUp: true,
								});
								console.info(
									"do stuff here to cause email to break"
								);
							}}
							className="woo button"
						>
							{this.renderSpinner()}
							Set Up
						</Button>
					</p>
				</Container>
			);
		} else {
			return (
				<Container>
					<p>Follow the prompts below to troubleshoot the issue.</p>
				</Container>
			);
		}
	}

	hideInstructions() {
		this.setState({
			orderStatusFlyoverOpen: false,
		});
	}

	whatIsTheOrderStatus() {
		if (null === this.state.newOrderStatus) {
			return (
				<p>
					What status does the order have?
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(
									`the order status value is ${value}`
								);
								this.setState({
									// orderStatusFlyoverOpen: true,
									newOrderStatus: value,
								});
							}}
							options={{
								pending: {
									label: "Pending payment",
								},
								processing: {
									label: "Processing",
								},
								completed: {
									label: "Completed",
								},
								hold: {
									label: "On hold",
								},
								canceled: {
									label: "Cancelled",
								},
								refunded: {
									label: "Refunded",
								},
								failed: {
									label: "Failed",
								},
							}}
						/>
					</span>
				</p>
			);
		}
	}

	orderStatusFeedbackText() {
		var text;
		switch (this.state.newOrderStatus) {
			case "processing":
			case "completed":
				text = "Probably a fatal error. Do conflict troubleshooting.";
				break;
			default:
				text =
					"The order wasn't transitioned to a paid status as expected. This is a separate topic to troubleshoot. For now, manually transition the order to pending payment (if not already) and then transition it to either processing or completed.";
		}
		return (
			<Container>
				<p>{text}</p>
				<p>{this.orderStatusTransitioned()}</p>
                    <p>{this.transitionedOrderEmailReceieved()}</p>
			</Container>
		);
	}

	orderStatusTransitioned() {
		return (
			<Container>
				<Checkbox
					name="email_sent"
					label="Order status was manually transitioned?"
					onChange={(checked) => {
						this.setState({
							orderStatusTransitioned: checked,
						});
						console.info("order status transitioned");
						console.info(`checked is ${checked}`);
						console.info(
							`orderStatusTransitioned is ${this.state.orderStatusTransitioned}`
						);
					}}
				/>
				
			</Container>
		);
	}

	transitionedOrderEmailReceieved() {
          console.info(
               `transitionedOrderEmailReceieved called. orderStatusTransitioned is ${this.state.orderStatusTransitioned}`
          );
		if (this.state.transitionedOrderEmailReceieved) {
               console.info('great success. returning the conclusion message')
			return (
				<Container>
					<p>This concludes the troubleshooting excercise.</p>
				</Container>
			);
		} else if (this.state.orderStatusTransitioned) {
               console.info('returning the transitionedOrderEmailLogged part.')
			return(
                    <Container>
                    {this.transitionedOrderEmailLogged()}
                    </Container>
               );
                    
		}
	}

	transitionedOrderEmailLogged() {
          if (null === this.state.transitionedOrderEmailLogged) {
               return (
				<Container>
					<p>Check to see if the email was logged.</p>
					<p>
						<span style={{ padding: "1em" }}>
							<RadioBlock
								onChange={(value) => {
									console.info(
										`new order email after transition ${
											value === "true" ? "was" : "was not"
										} logged`
									);
									this.setState({
										transitionedOrderEmailLogged:
											value === "true" ? true : false,
									});
								}}
								options={{
									true: {
										label: "Yes",
									},
									false: {
										label: "No",
									},
								}}
							/>
						</span>
					</p>
				</Container>
			);
          } else if (this.state.transitionedOrderEmailLogged) {
			return (
				<Container>
					<p>
						This concludes the troubleshooting excercise. The
						problem likely lies upstream of the WordPress
						installation.
					</p>
				</Container>
			);
		} else if (false === this.state.transitionedOrderEmailLogged) {
			return (
				<Container>
					<p>
						If the email wasn't logged, that is an indication that
						there is an issue on the WordPress website preventing
						emails from being sent. The next step would be conflict
						troubleshooting. Disable all plugins except for WP Mail Logging and WooCommerce. Then, manually transition the order to pending, then to either processing or completed.
					</p>
					<p>
						Next, check the{" "}
						<a
							href={`http://${
								this.props.sites[this.props.selectedSites[0]]
									.domain
							}/wp-admin/tools.php?page=wpml_plugin_log`}
						>
							WP Mail Logging Log.
						</a>{" "}
						Was the new order email logged?
						<span style={{ padding: "1em" }}>
							<RadioBlock
								onChange={(value) => {
									console.info(
										`the logging order email ${
											value === "true" ? "was" : "was not"
										} logged, setting transitionedOrderEmailLogged to ${value}`
									);
									var wasLogged =
										value === "true" ? true : false;
									if (wasLogged) {
										this.setState({
											transitionedOrderEmailLogged: wasLogged,
											transitionedOrderEmailReceieved: true,
										});
									} else {
										this.setState({
											wpEmailTroubleshootingExhausted: true,
										});
									}
								}}
								options={{
									true: {
										label: "Yes",
									},
									false: {
										label: "No",
									},
								}}
							/>
						</span>
					</p>
				</Container>
			);
		}
	}

	orderStatusFeedback() {
		console.info(
			`the state of orderStatusFlyoverOpen is ${this.state.orderStatusFlyoverOpen}`
		);
		return (
			<FlyModal
				isOpen={this.state.orderStatusFlyoverOpen}
				onRequestClose={this.hideInstructions}
				hasIcon={false}
				shouldCloseOnOverlayClick={false}
			>
				<Title fontSize="xl">Great Success!</Title>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						{this.orderStatusFeedbackText()}
					</Text>
				</div>
			</FlyModal>
		);
	}

	wpTestEmail() {
		if (this.state.testEmailPluginActive) {
			return (
				<Container>
					<p>
						<a
							href={`http://${
								this.props.sites[this.props.selectedSites[0]]
									.domain
							}/wp-admin/tools.php?page=wp-test-email`}
						>
							Visit the test email page.
						</a>{" "}
						and send a test email. Your test site uses{" "}
						<a href="https://github.com/mailhog/MailHog">Mailhog</a>{" "}
						so the email address you send that to is
						inconsequential.
						<br />
						<span style={{ padding: "1em" }}>
							<Checkbox
								name="email_sent"
								label="Test email sent?"
								onChange={(checked) => {
									this.setState({
										testEmailSent: checked,
									});
									console.info(
										"wp test email sent confirmation"
									);
								}}
							/>
						</span>
					</p>
				</Container>
			);
		} else {
			//plugin is not active, offer an interface to install it.
			return (
				<Container>
					<p>
						You can press the button below to install and activate
						this plugin.
					</p>
					<p>
						<Button
							onClick={() => {
								console.info(
									"wp test email activate button has been pressed."
								);
								/*this.setState({
									showSpinner: true,
								});
								ipcRenderer.send(
									"install-plugins",
									["wp-test-email"],
									this.props.selectedSites[0]
								);*/
								this.setState({
									testEmailPluginActive: true,
								});
							}}
							className="woo button"
						>
							{this.renderSpinner()}
							Install Plugin
						</Button>
					</p>
				</Container>
			);
		}
	}

	emailLoggingPlugin() {
		if (this.state.mailLoggingPluginActive) {
			//plugin is not active, offer an interface to install it.
			return (
				<Container>
					<p>
						<a
							href={`http://${
								this.props.sites[this.props.selectedSites[0]]
									.domain
							}/wp-admin/tools.php?page=wp-test-email`}
						>
							Visit the test email page.
						</a>{" "}
						and send a test email. Your test site uses{" "}
						<a href="https://github.com/mailhog/MailHog">Mailhog</a>{" "}
						so the email address you send that to is
						inconsequential.
						<br />
						<span style={{ padding: "1em" }}>
							<Checkbox
								name="email_sent"
								label="Test email sent?"
								onChange={(checked) => {
									console.log(
										`logging test email ${
											checked ? "was" : "was not"
										} sent`
									);
									this.setState({
										loggingTestEmailSent: checked,
									});
								}}
							/>
						</span>
					</p>

					{this.wpEmailLogged()}
				</Container>
			);
		} else {
			return (
				<Container>
					<p>
						You can press the button below to install and activate
						this plugin.
					</p>
					<p>
						<Button
							onClick={() => {
								console.info(
									"activating the mail logging plugin"
								);
								this.setState({
									mailLoggingPluginActive: true,
								});
								/*ipcRenderer.send(
									"install-plugins",
									["wp-mail-logging"],
									this.props.selectedSites[0]
								);*/
							}}
							className="woo button"
						>
							{this.renderSpinner()}
							Install Plugin
						</Button>
					</p>
				</Container>
			);
		}
	}

	isWPEmailReceived() {
		if (
			this.state.emailScenarioSetUp &&
			this.state.wpEmailTroubleshootingExhausted
		) {
			return (
				<Card>
					<h3>You've exhausted all troubleshooting steps.</h3>
					<p>
						The conditions indicate that the problem is external to
						WooCommerce or WordPress. This user may be best served
						by being refered to their host or professional help for
						assistance with diagnosis of this issue.
					</p>
				</Card>
			);
		} else if (
			this.state.emailScenarioSetUp &&
			!this.state.wpEmailIsReceived
		) {
			return (
				<Card>
					<h3>Are WordPress emails received?</h3>
					<p>
						WooCommerce relies on the underlying functionality of
						WordPress to send email. If this underlying
						functionality isn't working, we shouldn't expect for it
						to work with WooCommerce. A quick way to test if
						WordPress is sending emails is to use the{" "}
						<a href="https://wordpress.org/plugins/wp-test-email/">
							test email plugin.
						</a>{" "}
						{this.wpTestEmail()}
					</p>
				</Card>
			);
		}
	}

	adminNewOrderEmailSent() {
		if (
			this.state.adminOrderEmailTested &&
			null === this.state.adminOrderEmailReceived
		) {
			return (
				<p>
					Next, check your{" "}
					<a
						href={`http://localhost:${
							this.props.sites[this.props.selectedSites[0]]
								.services.mailhog.ports.WEB
						}`}
					>
						inbox (Mailhog).
					</a>{" "}
					Was the new order email received?
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(value);
								this.setState({
									adminOrderEmailReceived:
										value === "true" ? true : false,
								});
							}}
							options={{
								true: {
									label: "Yes",
								},
								false: {
									label: "No",
								},
							}}
						/>
					</span>
				</p>
			);
		}
	}

	orderTransitionedEmailReceived() {
		if (this.state.orderStatusTransitioned) {
			return (
				<p>
					Next, check your{" "}
					<a
						href={`http://localhost:${
							this.props.sites[this.props.selectedSites[0]]
								.services.mailhog.ports.WEB
						}`}
					>
						inbox (Mailhog).
					</a>{" "}
					Was the new order email received?
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(value);
								this.setState({
									adminOrderEmailReceived:
										value === "true" ? true : false,
								});
							}}
							options={{
								true: {
									label: "Yes",
								},
								false: {
									label: "No",
								},
							}}
						/>
					</span>
				</p>
			);
		}
	}

	adminOrderEmailTested() {
		if (false === this.state.adminOrderEmailTested) {
			return (
				<p>
					It's generally a safe bet that fixing whatever was
					preventing WordPress emails from sending will resolve the
					problem that our user reported. However, it is possible that
					the email problem they are reporting is specific to
					WooCommerce so we should verify this is working now. Open an
					order and use the order actions menu to Resend new order
					notification email.
					<br />
				</p>
			);
		}
	}
	wpEmailIsReceived() {
		if (
			this.state.testEmailSent &&
			(this.state.wpEmailIsReceived || this.state.wpEmailIsLogged)
		) {
			return (
				<Card>
					<h3>WordPress emails are being received.</h3>
                         {this.adminOrderEmailTested()}
					<p>
						<span style={{ padding: "1em" }}>
							<Checkbox
								name="email_sent"
								label="Admin new order email resent?"
								onChange={(checked) => {
									console.info(
										`admin new order email resent confirmation is ${checked}`
									);
									this.setState({
										adminOrderEmailTested: checked,
									});
								}}
							/>
						</span>
					</p>
					
					{this.adminNewOrderEmailSent()}
				</Card>
			);
		} else if (
			this.state.testEmailSent &&
			false === this.state.wpEmailIsReceived &&
			!this.state.wpEmailTroubleshootingExhausted
		) {
			return (
				<Card>
					<h3>WordPress emails are not being received.</h3>
					<p>
						If the emails aren't being received, then one might
						suspect that they had been caught up in a spam filter.
						Before making that suggestion, however, we should ensure
						that WordPress is sending emails. We can do this with a
						plugin such as{" "}
						<a href="https://wordpress.org/plugins/wp-mail-logging/">
							WP Mail Logging.{" "}
						</a>{" "}
					</p>
					{this.emailLoggingPlugin()}
				</Card>
			);
		} else if (
			this.state.testEmailSent &&
			null === this.state.wpEmailIsReceived
		) {
			return (
				<Card>
					Next, check your{" "}
					<a
						href={`http://localhost:${
							this.props.sites[this.props.selectedSites[0]]
								.services.mailhog.ports.WEB
						}`}
					>
						inbox (Mailhog).
					</a>{" "}
					Was the test email received?
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(
									`the wp test email ${
										value === "true" ? "was" : "was not"
									} received setting wpEmailIsReceived to ${value}`
								);
								this.setState({
									wpEmailIsReceived:
										value === "true" ? true : false,
								});
							}}
							options={{
								true: {
									label: "Yes",
								},
								false: {
									label: "No",
								},
							}}
						/>
					</span>
				</Card>
			);
		}
	}

	wpEmailLogged() {
		if (
			this.state.loggingTestEmailSent &&
			null === this.state.wpEmailIsLogged
		) {
			return (
				<p>
					Next, check the{" "}
					<a
						href={`http://${
							this.props.sites[this.props.selectedSites[0]].domain
						}/wp-admin/tools.php?page=wpml_plugin_log`}
					>
						WP Mail Logging Log.
					</a>{" "}
					Was the test email logged?
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(
									`the logging test email ${
										value === "true" ? "was" : "was not"
									} received, setting wpEmailIsLogged to ${value}`
								);
								this.setState({
									wpEmailIsLogged:
										value === "true" ? true : false,
									wpEmailIsReceived:
										value === "true" ? true : false,
								});
							}}
							options={{
								true: {
									label: "Yes",
								},
								false: {
									label: "No",
								},
							}}
						/>
					</span>
				</p>
			);
		} else if (
			this.state.loggingTestEmailSent &&
			false === this.state.wpEmailIsLogged
		) {
			return (
				<div>
					<p>
						If the email wasn't logged, that is an indication that
						there is an issue on the WordPress website preventing
						emails from being sent. The next step would be conflict
						troubleshooting. Disable all plugins except for the test
						email plugin and WooCommerce, then, send a test email
						again.
					</p>
					<p>
						Next, check the{" "}
						<a
							href={`http://${
								this.props.sites[this.props.selectedSites[0]]
									.domain
							}/wp-admin/tools.php?page=wpml_plugin_log`}
						>
							WP Mail Logging Log.
						</a>{" "}
						Was the test email logged?
						<span style={{ padding: "1em" }}>
							<RadioBlock
								onChange={(value) => {
									console.info(
										`the logging test email ${
											value === "true" ? "was" : "was not"
										} received, setting wpEmailIsLogged to ${value}`
									);
									var wasLogged =
										value === "true" ? true : false;
									if (wasLogged) {
										this.setState({
											wpEmailIsLogged: wasLogged,
											wpEmailIsReceived: true,
										});
									} else {
										this.setState({
											wpEmailTroubleshootingExhausted: true,
										});
									}
								}}
								options={{
									true: {
										label: "Yes",
									},
									false: {
										label: "No",
									},
								}}
							/>
						</span>
					</p>
				</div>
			);
		}
	}

	isAdminNewOrderEmailRecieved() {
		return "admin new order email was received";
	}

	orderStatusSet() {
		if (this.state.newOrderCreated && this.state.newOrderStatus) {
			return <Container>{this.orderStatusFeedbackText()}</Container>;
		}
	}

	newOrderCreated() {
		if (!this.state.newOrderCreated && null === this.state.newOrderStatus) {
			return (
				<Container>
					<p>
						You can press the button below to generate a new order.
					</p>
					<p>
						<Button
							onClick={() => {
								console.info("generating a new order");
								this.setState({
									newOrderCreated: true,
								});
								/*ipcRenderer.send(
                                                                           "install-plugins",
                                                                           ["wp-mail-logging"],
                                                                           this.props.selectedSites[0]
                                                                      );*/
							}}
							className="woo button"
						>
							{this.renderSpinner()}
							Generate Order
						</Button>
					</p>
				</Container>
			);
		} else if (this.state.newOrderCreated) {
			return (
				<Container>
					<p>
						{this.whatIsTheOrderStatus()}
						{this.orderStatusSet()}
					</p>
				</Container>
			);
		} else {
		}
	}

	adminNewOrderEmailReceived() {
		if (
			this.state.adminOrderEmailReceived &&
			this.state.wpEmailIsReceived
		) {
			var content = this.state.newOrderCreated ? null : (
				<p>
					Sadly though, our user has let us know that while they're
					happy that the underlying email system is working, emails
					still aren't being sent when orders are placed. To test
					this, place a new order and see if the email was received.
				</p>
			);
			return (
				<Card>
					<h3>
						The new order email notification was received when
						manually sent.
					</h3>
					{content}
					{this.newOrderCreated()}
				</Card>
			);
		} /*else if (
			this.state.wpEmailIsReceived &&
			false === this.state.adminOrderEmailReceived &&
			this.state.adminOrderEmailTested
		) {
			return (
				<Container>
					<a
						href={`http://${
							this.props.sites[this.props.selectedSites[0]].domain
						}/wp-admin/tools.php?page=wpml_plugin_log`}
					>
						Was the email logged?
					</a>{" "}
					<span style={{ padding: "1em" }}>
						<RadioBlock
							onChange={(value) => {
								console.info(
									`setting wpEmailIsLogged to ${value}`
								);
								this.setState({
									wpEmailIsReceived:
										value === "true" ? true : false,
								});
							}}
							options={{
								true: {
									label: "Yes",
								},
								false: {
									label: "No",
								},
							}}
						/>
					</span>
				</Container>
			);
		}*/
	}

	render() {
		return (
			<div class="woo">
				<Card>
					<p>
						Scenario: A WooCommerce user has submitted a ticket
						letting us know that the WooCommerce order emails are
						not working as expected.
					</p>
					{this.setUpScenario()}
					<div
						style={{
							width: "100%",
							float: "left",
						}}
					>
						{this.isWPEmailReceived()}
						{this.wpEmailIsReceived()}
						{this.adminNewOrderEmailReceived()}
						<Divider style={{ width: "100%" }} />
					</div>
				</Card>
			</div>
		);
	}
}
