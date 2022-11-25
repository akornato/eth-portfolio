This app hits [Ethplorer](https://ethplorer.io/) API to show ETH and tokens for a given address.

You can view the portfolio of any address by appending `address` query param to the url, like so:

https://eth-portfolio.vercel.app/?address=0xbdfa4f4492dd7b7cf211209c4791af8d52bf5c50

Once you've connected with the connect button, the `address` query param is synced to your selected account address, even on reloads. Disconnect with the connect button to return to "any address" mode.

## Local dev

- `yarn web:dev` starts the web app at [http://localhost:3000](http://localhost:3000)
