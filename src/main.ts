// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';
import { object } from 'prop-types';
//LocalMain.UserData.remove('ghToken');
process.env.GITHUB_TOKEN = LocalMain.UserData.get('ghToken');

const { downloadRelease } = require('@terascope/fetch-github-release');
const { validateGitHubToken, ValidationError } = require('validate-github-token');
const fs = require('fs');

let premiumPluginInfo = {};
let premiumPluginSelections = [];
export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;
	const { Octokit } = require("@octokit/rest");
	const bundlePlugins = [
		'woocommerce-chained-products',
		'woocommerce-product-bundles',
		'woocommerce-force-sells',
		'woocommerce-composite-products',
		'woocommerce-mix-and-match-products',
	];

	ipcMain.on('test-request', async () => {
		download("", "");
	});


	ipcMain.on('install-bundle-addon-plugins', (event, siteId) => {
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		installPlugins(bundlePlugins, site);
	});

	ipcMain.on("install-plugins", async (event, pluginsToInstall, siteId) => {
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		installPlugins(pluginsToInstall, site);
	});

	ipcMain.on("get-premium-plugin-selections", async () => {
		const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
		var pluginSlugs = {};
		await octokit.request('GET /repos/{owner}/{repo}/commits', {
			owner: 'woocommerce',
			repo: 'all-plugins',
		}).then(async ({ data }) => {
			await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
				owner: 'woocommerce',
				repo: 'all-plugins',
				tree_sha: data[0].commit.tree.sha,
			}).then(async ({ data }) => {
				var targetSha;
				for (var index in data.tree) {
					if ("undefined" != typeof data.tree[index] && "product-packages" === data.tree[index].path) {
						targetSha = data.tree[index].sha;
						break;
					}
				}
				await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
					owner: 'woocommerce',
					repo: 'all-plugins',
					tree_sha: targetSha,
				}).then(async ({ data }) => {
					for (var index in data.tree) {
						if ("tree" === data.tree[index].type) {
							pluginSlugs[index] = data.tree[index].path;
							premiumPluginSelections.push({ label: data.tree[index].path, value: index });
						}
					}
					premiumPluginInfo = data.tree;
				}, function (err) {
					LocalMain.getServiceContainer().cradle.localLogger.log("error", err)
					LocalMain.sendIPCEvent('error');
					LocalMain.sendIPCEvent('spinner-done');
				});
			}, function (err) {
				LocalMain.getServiceContainer().cradle.localLogger.log("error", err)
				LocalMain.sendIPCEvent('error');
				LocalMain.sendIPCEvent('spinner-done');
			});
		}, function (err) {
			LocalMain.getServiceContainer().cradle.localLogger.log("error", err)
			LocalMain.sendIPCEvent('error');
			LocalMain.sendIPCEvent('spinner-done');
		});
		LocalMain.sendIPCEvent("premium-plugin-selections", premiumPluginSelections);
	});

	ipcMain.on("install-woocommerce", async (event, siteId, path) => {
		var error = false;
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		const options = {
			woocommerce_store_address: "537 Paper Street",
			woocommerce_store_address_2: "#34",
			woocommerce_store_city: "Wilmington",
			woocommerce_default_country: "US:DE",
			woocommerce_store_postcode: "19806",
			woocommerce_currency: "USD",
			woocommerce_price_thousand_sep: ",",
			woocommerce_price_decimal_sep: ".",
			woocommerce_weight_unit: "lbs",
			woocommerce_dimension_unit: "in",
		}

		const commands = [
			["wc", "--user=1", "tool", "run", "install_pages"],
		];

		await LocalMain.getServiceContainer().cradle.wpCli.run(site, ["plugin", "install", "woocommerce", "--activate", "--force"]).then(function () {
		}, function (err) {
			LocalMain.sendIPCEvent('error');
			LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
			error = true;
		});

		await LocalMain.getServiceContainer().cradle.wpCli.run(site, ["plugin", "install", "wordpress-importer", "--activate", "--force"]).then(function () {
			LocalMain.getServiceContainer().cradle.wpCli.run(site, ["import", path + "/app/public/wp-content/plugins/woocommerce/sample-data/sample_products.xml", "--authors=skip"], { skipPlugins: false }).then(function () {
			}, function (err) {
				LocalMain.sendIPCEvent('error');
				LocalMain.sendIPCEvent('spinner-done');
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
			});
		}, function (err) {
			LocalMain.sendIPCEvent('error');
			LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
			error = true;
		});

		if (!error) {
			commands.forEach(command => {
				LocalMain.getServiceContainer().cradle.wpCli.run(site, command, { skipPlugins: false }).then(function () {
				}, function (err) {
					error = true;
					LocalMain.sendIPCEvent('error');
					LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
				});
			});


			for (var option in options) {
				LocalMain.getServiceContainer().cradle.wpCli.run(site, [
					'option',
					'set',
					option,
					options[option],
				]).then(function () { }, function (err) {
					LocalMain.sendIPCEvent('error');
					LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
					error = true;
				});
			}
		}


		if (!error) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'WooCommerce install completed without errors!');
			LocalMain.sendIPCEvent("spinner-done");
		}

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
			LocalMain.sendIPCEvent("gh-token", { "valid": true });
		} catch (err) {
			if (err instanceof ValidationError) {
				LocalMain.sendIPCEvent('debug-message', err);
				LocalMain.getServiceContainer().cradle.localLogger.log('error', 'error:(');
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err.message);
				LocalMain.sendIPCEvent("gh-token", { "valid": false });
				LocalMain.UserData.remove('ghToken');
			} else {
				LocalMain.sendIPCEvent('error');
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
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
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
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
		const outputdir = context.environment.userDataPath + '/addons/wizard-hat-toolkit/';
		const leaveZipped = true;
		const disableLogging = false;

		// Define a function to filter releases.
		function filterRelease(release) {
			// Filter out prereleases.
			return release.prerelease === false;
		}


		downloadRelease(user, repo, outputdir, filterRelease, () => { return true; }, leaveZipped, disableLogging)
			.then(function () {
				LocalMain.getServiceContainer().cradle.localLogger.log('info', "All done");
			})
			.catch(function (err) {
				LocalMain.sendIPCEvent('error');
				LocalMain.getServiceContainer().cradle.localLogger.log('error', "big ol failure");
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err.message);
			});
	}

	function installPlugins(pluginsToInstall, site) {
		downloadPlugins(pluginsToInstall).then(async (zipFiles) => {
			for (const zipFile of zipFiles ) {
				await LocalMain.getServiceContainer().cradle.wpCli.run(site, ["plugin", "install", zipFile, "--activate", "--force"]).then(function () {
					fs.unlink(zipFile, (err) => {
						if (err) {
							LocalMain.getServiceContainer().cradle.localLogger.log("error", err)
						}
					});
				},function(err){
					LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
					LocalMain.sendIPCEvent('spinner-done');
				});
			}
		}).then(() => {
			LocalMain.sendIPCEvent('spinner-done');
		});
	}

	/**
	 * Downloads file from remote HTTP[S] host and puts its contents to the
	 * specified location.
	 */
	async function getPremiumPluginsData() {
		const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
		var pluginSlugs = {};
		await octokit.request('GET /repos/{owner}/{repo}/commits', {
			owner: 'woocommerce',
			repo: 'all-plugins',
		}).then(async ({ data }) => {
			await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
				owner: 'woocommerce',
				repo: 'all-plugins',
				tree_sha: data[0].commit.tree.sha,
			}).then(async ({ data }) => {
				var targetSha;
				for (var index in data.tree) {
					if ("undefined" != typeof data.tree[index] && "product-packages" === data.tree[index].path) {
						targetSha = data.tree[index].sha;
						break;
					}
				}
				await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
					owner: 'woocommerce',
					repo: 'all-plugins',
					tree_sha: targetSha,
				}).then(async ({ data }) => {
					for (var index in data.tree) {
						if ("tree" === data.tree[index].type) {
							pluginSlugs[index] = data.tree[index].path;
							premiumPluginSelections.push({ name: data.tree[index].path, value: index });
						}
					}
					premiumPluginInfo = data.tree;
				}, function (err) {
					LocalMain.sendIPCEvent("debug-message", err);
				});
			}, function (err) {
				LocalMain.sendIPCEvent("debug-message", err);
			});
		}, function (err) {
			LocalMain.sendIPCEvent("debug-message", err);
		});
	}

	const downloadZipFromGitHub = (fileUrl: string, outputFile: string) => {
		return new Promise((resolve, reject) => {
			try {
				context.request.get(fileUrl, {
					'auth': {
						'bearer': process.env.GITHUB_TOKEN
					}
				}).on("error", function (err) {
					LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
					reject(err);
				}).pipe(fs.createWriteStream(outputFile)).on('finish', () => {
					resolve(outputFile);
				});
			} catch (err) {
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
				reject(err);
			}
		});
	};

	const getDownloadUrl = (pluginSlug) => {
		const path = `product-packages/${pluginSlug}`;
		const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
		return new Promise((resolve, reject) => {
			octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: 'woocommerce',
				repo: 'all-plugins',
				path: path,
			}).then(async ({ data }) => {
				await data.every(async (element) => {
					if (pluginSlug + '.zip' === element.name) {
						resolve(element.download_url);
					}
				});
			}, function (err) {
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
				reject(err);
			});
		});
	}

	const downloadPlugins = async (pluginsToInstall) => {
		let zipFiles = [];
		for (const pluginSlug of pluginsToInstall) {
			const outputFile = context.environment.userDataPath + `/addons/wizard-hat-toolkit/${pluginSlug}.zip`;
			await getDownloadUrl(pluginSlug).then(async (fileUrl: string) => {
				await downloadZipFromGitHub(fileUrl, outputFile).then((result) => {
					zipFiles.push(result);
				}, function (err) {
					LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
				});
			}, function (err) {
				LocalMain.getServiceContainer().cradle.localLogger.log('error', err);
			});

		}
		return zipFiles;
	};
}
