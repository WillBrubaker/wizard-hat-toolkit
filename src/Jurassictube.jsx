import React, { Component } from "react";
import { ipcRenderer } from "electron";
const { exec } = require("child_process");
const fs = require("fs");
import {
	Button,
	Title,
	BasicInput,
	Card,
	Checkbox,
	Container,
	TextButton,
	Divider,
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
			httpPort: (props.sites[props.match.params.siteID].services.nginx) ? props.sites[props.match.params.siteID].services.nginx.ports
			.HTTP : props.sites[props.match.params.siteID].services.apache.ports
			.HTTP,
			webroot: props.sites[props.match.params.siteID].path,
			userHome: null,
			isInstalled: null,
			sshkeyCopied: false,
		};
		this.launchInstall = this.launchInstall.bind(this);
		this.connectJurassicTube = this.connectJurassicTube.bind(this);
		this.wpConfigStuff = this.wpConfigStuff.bind(this);
		this.disconnect = this.disconnect.bind(this);
	}

	componentDidMount() {
		this.isInstalled();
		ipcRenderer.send("get-jtubeStuff", this.state.siteId);
		ipcRenderer.on("jtubeStuff", (event, message) => {
			message.forEach((element) => {
				this.setState(element);
			});
			this.setState({isInstalled: this.state.sshkeyCopied && this.isInstalled()})
		});
		
		ipcRenderer.on("debug-message", (event, args) => {
			console.info(args);
		});
	}

	isInstalled() {
		const path = "/usr/local/bin/jurassictube";

		try {
			if (fs.existsSync(path)) {
				return true;
			}
		} catch (err) {
			this.setState({ isInstalled: false });
			this.setState({ sshkeyCopied: false });
			return false;
		}
		this.setState({ isInstalled: false });
		this.setState({ sshkeyCopied: false });
		return false;
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("jtubeStuff");
		ipcRenderer.removeAllListeners("debug-message");
	}

	launchInstall() {
		exec(
			`open -a Terminal '${this.state.userDataPath}/addons/wizard-hat-toolkit/jtubesetup.command'`
		);
		setTimeout(() => {
			this.isInstalled();
		}, 10000); //automatically kill the connection after 60 minutes.
	}

	saveUsername() {
		ipcRenderer.send("save-username", this.state.wpUsername);
	}

	saveSubdomain() {
		ipcRenderer.send(
			"save-subdomain",
			this.state.subdomain,
			this.state.siteId
		);
	}

	notSetupContent() {
		return (
			<Card
				content={
					<div style={{ fontSize: 16 }}>
						<Title>Jurassic Tube Setup</Title>
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
							you may be unfamiliar with, but the button below
							aims to make the process easier. You can use the
							button to lauch the installation script in a
							terminal window.
						</p>
						<p>
							You will be prompted for a password twice. The first
							prompt is for the password of your Mac. This is
							necesary so that the symlink for the Jurassic Tube
							main script can be created in the system path. The
							second password prompt is to create a password for
							the SSH key generated for this connection. It is
							optional but recommended. The password is not saved
							so if you do choose to use one, you will need to
							manage that yourself. You can just enter through
							(twice) to bypass setting a password on the key.
						</p>

						<p style={{ width: "100%", float: "left" }}>
							<Button
								onClick={this.launchInstall}
								className="woo button"
							>
								Install Jurassic Tube
							</Button>
						</p>
						<p>
							After your key has been generated, copy to your
							clipboard and then register the key on{" "}
							<a href="https://fieldguide.automattic.com/jurassic-tube-standalone/">
								Jurassic Tube
							</a>
							. You can close the terminal window after you've
							copied the key.
						</p>
						<p>
							<Checkbox
								className="woo checkbox flyover"
								label="SSH Key copied and entered at jurassic.tube?"
								onChange={(value) => {
									this.setState({
										isInstalled:
											this.isInstalled() && value,
									});
								}}
								checked={this.state.sshkeyCopied && this.isInstalled()}
							/>
						</p>
					</div>
				}
			/>
		);
	}

	isSetupContent() {
		return (
			<Card
				content={
					<div style={{ fontSize: 16 }}>
						<Title style={{ margin: "1em" }}>
							Jurassic Tube Connection Configuration
						</Title>
						<p>
							Jurassic Tube will need your WordPress username to connect.
							Please enter and save your WordPress username:
						</p>
						<p>
							WordPress username:
							<br />
							<BasicInput
								value={
									this.state.wpUsername
										? this.state.wpUsername
										: null
								}
								onChange={(event) => {
									this.setState({
										wpUsername: event.target.value,
									});
								}}
							/>
							<TextButton
								onClick={() => {
									this.saveUsername();
								}}
							>
								Save
							</TextButton>
						</p>
						<p>
							Jurassic Tube requires a subdomain. One has been
							chosen for you, or you can edit/save your own. This
							subdomain also needs to be recorded on{" "}
							<a href="https://jurassic.tube">Jurassic Tube</a>{" "}
							before it will be available for use.
						</p>
						<p>
							subdomain:
							<br />
							<BasicInput
								value={
									this.state.subdomain
										? this.state.subdomain
										: this.state.siteId
								}
								disabled={!this.state.editDomain}
								onChange={(event) => {
									this.setState({
										subdomain: event.target.value,
									});
								}}
							/>
							{!this.state.editDomain ? (
								<TextButton
									onClick={() => {
										this.setState({ editDomain: true });
									}}
								>
									Edit
								</TextButton>
							) : (
								<TextButton
									onClick={() => {
										this.setState({ editDomain: false });
										this.saveSubdomain();
									}}
								>
									Save
								</TextButton>
							)}
							<TextButton
								onClick={() => {
									this.setState({ editDomain: false });
								}}
							>
								<CopyButton
									onClick={exec(
										`echo ${
											this.state.subdomain
												? this.state.subdomain
												: this.state.siteId
										}|pbcopy`
									)}
								/>
							</TextButton>
						</p>
					</div>
				}
			/>
		);
	}

	connectJurassicTube() {
		this.wpConfigStuff();
		exec(
			`open -a Terminal '${this.state.userDataPath}/addons/wizard-hat-toolkit/${this.state.siteId}-tunnel.command'`
		);
		setTimeout(() => {
			this.disconnect();
		}, 60 * 60000); //automatically kill the connection after 60 minutes.
	}

	wpConfigStuff() {
		const webroot = this.state.webroot.replace("~", this.state.userHome);
		const wpConfigPhp = `${webroot}/app/public/wp-config.php`;
		fs.readFile(wpConfigPhp, "utf-8", function (err, data) {
			if (err) {
				throw err;
			}
			const siteUrlRegex =
				/define.*WP_SITEURL.*,.*https.*HTTP_HOST.*\);/;
			const siteUrlDefined = data.match(siteUrlRegex);
			const homeUrlRegex =
				/define.*WP_HOME.*,.*https.*HTTP_HOST.*\);/;
			const homeUrlDefined = data.match(homeUrlRegex);
			if (!homeUrlDefined || !siteUrlDefined) {
				let newData = data.replace(
					"define('WP_SITEURL'",
					"//define('WP_SITEURL'"
				);
				newData = newData.replace(
					"define('WP_HOME'",
					"//define('WP_HOME'"
				);
				newData = newData.replace(
					/(<\?php.*\/\*\*.*@package WordPress\n\s\*\/)/s,
					"$1\ndefine( 'WP_SITEURL', 'https://' . $_SERVER['HTTP_HOST'] );\ndefine( 'WP_HOME', 'https://' . $_SERVER['HTTP_HOST'] );"
				);
				fs.writeFile(wpConfigPhp, newData, function (err, data) {
					if (err) {
						throw err;
					}
				});
			}
		});
	}

	writeConnectionFile() {
		const file = `${this.state.userDataPath}/addons/wizard-hat-toolkit/${this.state.siteId}-tunnel.command`;
		fs.writeFile(
			`${file}`,
			`jurassictube -u ${this.state.wpUsername} -s ${
				this.state.subdomain ? this.state.subdomain : this.state.siteId
			} -h 127.0.0.1:${this.state.httpPort}`,
			(err) => {
				if (err) {
					console.error(err);
				}
				try {
					const fd = fs.openSync(file, "r");
					fs.fchmodSync(fd, 0o754);
				} catch (error) {
					console.error(error);
				}
			}
		);
		exec(
			`chmod u+x ${this.state.userDataPath}/addons/wizard-hat-toolkit/${this.state.siteId}-tunnel.command`
		);
	}

	disconnect() {
		exec(
			`jurassictube -b -s ${
				this.state.subdomain ? this.state.subdomain : this.state.siteId
			}`
		);
	}

	connectButton() {
		{
			this.writeConnectionFile();
		}
        const tubeUrl = `https://${this.state.subdomain ? this.state.subdomain : this.state.siteId}.jurassic.tube`
		return (
			<Card
				content={
					<div style={{ fontSize: 16 }}>
						<Title style={{ margin: "1em" }}>
							Jurassic Tube Connection
						</Title>
						<p>
							Pressing the button below will check (and possibly
							modify) your wp-config.php file adding and defining
							the following constants:
							<br />
							<span style={{ width: "100%", float: "left" }}>
								define( 'WP_HOME', 'https://' .
								$_SERVER['HTTP_HOST']);
							</span>
							<span style={{ width: "100%", float: "left" }}>
								define( 'WP_SITEURL', 'https://' .
								$_SERVER['HTTP_HOST']);
							</span>
							and then initiate the tunnel.
						</p>
                        <p>If you set a password on your SSH key, you will be prompted for it when you connect.</p>
						<p style={{ width: "100%", float: "left" }}>
							<Button
								onClick={this.connectJurassicTube}
								className="woo button"
							>
								Initiate tunnel
							</Button>
						</p>
						<p>
							After the tunnel has started, you can reach your site at <a href={tubeUrl}>{tubeUrl}</a>. Once connected, it's fine to close the
							terminal window.
						</p>
						<p style={{ width: "100%", float: "left" }}>
							<Button
								onClick={this.disconnect}
								className="woo button"
							>
								Close tunnel
							</Button>
						</p>
					</div>
				}
			/>
		);
	}

	render() {
		return (
			<Container>
				{this.state.userDataPath &&
				this.state.siteId &&
				this.state.wpUsername &&
				this.state.isInstalled
					? this.connectButton()
					: null}
				<Divider />
				{this.state.isInstalled
					? this.isSetupContent()
					: this.notSetupContent()}
			</Container>
		);
	}
}
