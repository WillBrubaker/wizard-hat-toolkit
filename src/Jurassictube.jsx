import React, { Component } from "react";
import { ipcRenderer } from "electron";
const { exec } = require("child_process");
import {
	Button,
	Title,
	BasicInput,
	Spinner,
	Card,
	Checkbox,
	Container,
	TextButton,
	Divider,
	List,
	InputPasswordToggle,
    CopyButton,
} from "@getflywheel/local-components";

export default class Jurassictube extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siteId: props.match.params.siteID,
			showSpinner: false,
			day: 1,
			tokenIsValid: null,
			installingPlugins: false,
			userDataPath: null,
			jtubeInstalled: null,
			editDomain: false,
            subdomain: null,
            wpUsername: null,
		};
		this.launchInstall = this.launchInstall.bind(this);
	}

	componentDidMount() {
		ipcRenderer.send("get-jtubeStuff", this.state.siteId);
		ipcRenderer.on("jtubeStuff", (event, message) => {
			message.forEach((element) => {
				this.setState(element);
			});
			console.info(this.state);
		});

        ipcRenderer.on("debug-message", (event, args) => {
			console.info(args);
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("jtubeStuff");
		ipcRenderer.removeAllListeners("debug-message");
	}

	launchInstall() {
		exec(
			`open -a Terminal '${this.state.userDataPath}/addons/wizard-hat-toolkit/jtubesetup.command'`
		);
	}

    saveUsername() {
        ipcRenderer.send('save-username', this.state.wpUsername);
    }

    saveSubdomain() {
        ipcRenderer.send('save-subdomain', this.state.subdomain, this.state.siteId);
    }

	notSetupContent() {
		return (
			<Card
				title={<Title style={{ margin: "1em" }}>Jurassic Tube</Title>}
				content={
					<div style={{ fontSize: 16 }}>
						<p>
							<a href="https://fieldguide.automattic.com/jurassic-tube-standalone/">
								Jurassic Tube
							</a>{" "}
							is an a8c in-house tunneling solution similar to
							services offered by{" "}
							<a href="https://ngrok.com/">ngrok</a>. It will
							allow your local test site to be reached from the
							internet via a .jurassic.tube subdomain over an{" "}
							<a href="https://www.concordia.ca/ginacody/aits/support/faq/ssh-tunnel.html">
								ssh tunnel
							</a>
							. This is useful when working with WCPay, WCS&T,
							anything that requires a Jetpack connection, or
							anything that receives webhooks or similar inbound
							requests (IPN, etc).
						</p>
						<p>
							The setup process requires the command line which
							you may be unfamiliar with. You can use the button
							below to lauch the installation script. It will
							launch the script in a terminal window. You will be
							prompted for a password twice. The first prompt is
							for the password of your Mac. This is necesary so
							that the symlink for the Jurassic Tube main script
							can be moved to a system path. The second password
							prompt is to create a password for an SSH key. For
							the purposes of usage within this addon, you should
							just hit enter to leave the password empty, and hit
							enter again to verify.
						</p>
						<p>If the script completes successfuly, </p>
						<p style={{ width: "100%", float: "left" }}>
							<Button
								onClick={this.launchInstall}
								className="woo button"
							>
								Install Jurassic Tube
							</Button>
						</p>
						<ol>
							{" "}
							<h3>The setup process</h3>
							<li>check for the presence of jt</li>
							<li>prompt for install if not already</li>
							<li>
								provide a suggested subdomain for this site (the
								siteId)
							</li>
							<li>input for WordPress username</li>
							<li>
								If we've got everything, present a button to
								activate tunnel
							</li>
						</ol>
					</div>
				}
			/>
		);
	}

	isSetupContent() {
		return (
			<Card
				title={<Title style={{ margin: "1em" }}>Jurassic Tube</Title>}
				content={
					<div style={{ fontSize: 16 }}>
						<p>
							Jurassic Tube will need your WordPress username and
							a subdomain for this site. A subdomain has been
							chosen for you and can be edited in the input box
							below.
						</p>
						<p>
							subdomain:
							<br />
							<BasicInput
								value={this.state.subdomain ? this.state.subdomain : this.state.siteId}
								disabled={!this.state.editDomain}
								onChange={(event) => {
                                    console.log("onChange: ", event);
                                    this.setState({subdomain: event.target.value})
                                }
									
								}
							/>
                            {! this.state.editDomain ? <TextButton
								onClick={() => {
									this.setState({ editDomain: true });
								}}
							>
								Edit
							</TextButton> :  <TextButton
								onClick={() => {
									this.setState({ editDomain: false });
                                    this.saveSubdomain()

								}}
							>
								Save
							</TextButton>
                            }
                            <TextButton
								onClick={() => {
									this.setState({ editDomain: false });
								}}
							>
								<CopyButton onClick={exec(`echo ${this.state.subdomain ? this.state.subdomain : this.state.siteId}|pbcopy`)} />
							</TextButton>
						</p>
                        <p>
                        WordPress username:<br />
                        <BasicInput
								value={this.state.wpUsername ? this.state.wpUsername : null}
								onChange={(event) => {
                                    console.log("onChange: ", event);
                                    this.setState({wpUsername: event.target.value})
                                }
									
								}
							/>
                            <TextButton
								onClick={() => {
									this.saveUsername
								}}
							>
								Save
							</TextButton>
                        </p>
					</div>
				}
			/>
		);
	}

	render() {
		return (
			<Container>
				{this.notSetupContent()}
				{this.isSetupContent()}
			</Container>
		);
	}
}
