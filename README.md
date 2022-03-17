# WooCommerce Wizard Hat Toolkit

This [Local addon](https://localwp.com) provides a home base for learning how to troubleshoot and support WooCommerce. 

## Installation

### Pre built

Download the .tgz file from the most recent release tag and "Install from disk" on your instance of local.


### Build yourself

### Requirements

* [Local](https://localwp.com/) 5.x ⚡️
* [NPM](https://www.npmjs.com/)

#### Clone

Clone the repository into the following directory depending on your platform:

-   macOS: `~/Library/Application Support/Local/addons`
-   Windows: `C:\Users\username\AppData\Roaming\Local\addons`
-   Debian Linux: `~/.config/Local/addons`

#### Install Add-on Dependencies

`yarn install` or `npm install`

#### Add Add-on to Local

1. Clone repo directly into the add-ons folder (paths described above)
2. `yarn install` or `npm install` (install dependencies)
2. `yarn build` or `npm run build`
3. Open Local and enable add-on

## Post Install

Some of the tools require access to private GitHub repos. When you first start the addon, you will be presented with an interface to enter a GitHub token. Once a valid token has been entered in that interface, the features requiring a token will be enabled for as long as the token remains valid. To bring the interface back, you can revoke the token from your [GitHub account token management page](https://github.com/settings/tokens). When [creating a new token](https://github.com/settings/tokens/new) for this app, ensure that the `repo` scope is selected. Feel free to set the expiration for whatever you'd like. Tokens are easy to create and the app will automatically prompt for a new one on expiry.
## License

GPL
