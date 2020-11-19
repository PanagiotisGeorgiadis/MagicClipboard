## Magic Clipboard

In many cases I've wished that my clipboard would keep more data than a single entry and I've also
witnessed more people having this same exact problem.<br />
This project is a chrome extension aimed in creating a clipboard suitable for the digital age.

The way it works is simple:

- Create a `JSON` out of the data that you'd like to store.
- Install the **Magic Clipboard** extension.
- Paste your data into the **Magic Clipboard** extension pop up.
- Right-click on the input that you'd like to paste info and select the key that you'd like to paste from the **Magic Clipboard context menu**.

### Demo and examples

In order to see what `Magic Clipboard` can do follow the installation steps below:

- Clone the repo
- Run `setup.sh`
- [Load the unpacked extension](https://developer.chrome.com/extensions/getstarted) ( located inside `./chrome-extension` )

**OR**

- [Install the extension](https://chrome.google.com/webstore/detail/magic-clipboard/hpcejjdpbbkhhomlngbiloifbkdaagpg/related?hl=en) from the chrome webstore
- Enable any extra permission you'd like to provide the extension with, such as `Allow in incognito` or `Allow access to file URLs`

After you've loaded the extension have a look into the examples folder which contains example forms and data that you can load into the `Magic Clipboard` and fill out the forms.

### Development

The chrome extension consists of 3 parts:

- The `background` script. [See more](https://developer.chrome.com/extensions/background_pages)
- The `content` script. [See more](https://developer.chrome.com/extensions/content_scripts)
- The `popup` mini-app. [See more](https://developer.chrome.com/extensions/user_interface#popup)

### Disclaimer

All the addresses used on the `address-history` example were automatically generated using [doogal.co.uk](https://www.doogal.co.uk/RandomAddresses.php).
