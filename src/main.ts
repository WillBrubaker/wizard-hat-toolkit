// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';
//LocalMain.UserData.remove('ghToken');
process.env.GITHUB_TOKEN = LocalMain.UserData.get('ghToken');

const { downloadRelease } = require('@terascope/fetch-github-release');
const { validateGitHubToken, ValidationError } = require('validate-github-token');

export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;
	const { Octokit } = require("@octokit/rest");
	
	ipcMain.on('test-request', async () => {
		LocalMain.getServiceContainer().cradle.localLogger.log('info', 'am here');
		const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
		octokit.rest.repos.getLatestRelease({
			owner: "woocommerce",
			repo: "automatewoo"
		}).then(async ({ data }) => {
			download(data.assets[0].browser_download_url, context.environment.userDataPath + '/addons/wizard-hat-toolkit/woocommerce-subscriptions.zip')
		}, function(err){
			LocalMain.getServiceContainer().cradle.localLogger.log('error', "big ol failure");
			LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
			LocalMain.UserData.remove('ghToken');
		});
	});
	
	ipcMain.on("set-user-token", (event, token) => {
		process.env.GITHUB_TOKEN = token;
		LocalMain.sendIPCEvent("validate-token");
	});

	ipcMain.on('validate-token', async () => {
		try {
			const validated = await validateGitHubToken(
				process.env.GITHUB_TOKEN,
				{
					scope: {
						// Checks 'repo' scope is added to the token
						included: ['repo']
					}
				}
			);
			LocalMain.UserData.set('ghToken', process.env.GITHUB_TOKEN);
			LocalMain.sendIPCEvent("gh-token", {"valid": true});
		} catch(err) {
			if (err instanceof ValidationError) {
				LocalMain.sendIPCEvent('debug-message', err);
				LocalMain.getServiceContainer().cradle.localLogger.log('info', 'error:(');
				LocalMain.getServiceContainer().cradle.localLogger.log('info', err.message);
				LocalMain.sendIPCEvent("gh-token", {"valid": false, "ghToken": process.env.GITHUB_TOKEN});
				LocalMain.UserData.remove('ghToken');			
			} else {
				throw err;
			}
		}
	});

	ipcMain.on('switch-country', async (event, siteId, options) => {
		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		var error = false;
		for (var option in options) {
			await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
				'option',
				'set',
				option,
				options[option],
			]).then(function () { }, function (err) {
				LocalMain.sendIPCEvent('error');
				LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
				error = true;
			});
		}

		if (!error) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Switcheroo completed without errors!');
			LocalMain.sendIPCEvent('instructions');
		}

	});

	/**
	 * Downloads file from remote HTTP[S] host and puts its contents to the
	 * specified location.
	 */
	 async function download(url, filePath) {
		const user = 'woocommerce';
		const repo = 'automatewoo';
		const { GITHUB_TOKEN } = process.env;
		LocalMain.getServiceContainer().cradle.localLogger.log('info', "gh token");
		LocalMain.getServiceContainer().cradle.localLogger.log('info', `${GITHUB_TOKEN}`);
		const outputdir = context.environment.userDataPath + '/addons/wizard-hat-toolkit/';
		const leaveZipped = true;
		const disableLogging = false;
	
		// Define a function to filter releases.
		function filterRelease(release) {
		// Filter out prereleases.
		return release.prerelease === false;
		}
	
		// Define a function to filter assets.
		function filterAsset(asset) {
		// Select assets that contain the string 'windows'.
		return asset.name.includes('woo');
		}
	
		downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
		.then(function() {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', "All done");
			console.log('All done!');
		})
		.catch(function(err) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', "big ol failure");
			LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
			LocalMain.getServiceContainer().cradle.localLogger.log('info', err.message);
		});
	}
}

