import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { BigNumber, providers, Wallet } from "ethers";

// goerli network
const CHAIN_ID = 5;
const GWEI = BigNumber.from(10).pow(8);
const FLASHBOTS_RELAY_ENDPOINT = "https://relay-goerli.flashbots.net"
const provider = new providers.InfuraProvider(CHAIN_ID);
if (process.env.WALLET_PROVIDER_KEY === undefined) {
  process.exit(1);
}
const wallet = new Wallet(process.env.WALLET_PROVIDER_KEY, provider);

async function main() {
  const flashBotProvider = await FlashbotsBundleProvider.create(provider, Wallet.createRandom(), FLASHBOTS_RELAY_ENDPOINT)
  provider.on('block', (blockNumber) => {
    console.log(blockNumber);
    flashBotProvider.sendBundle(
      [{
        transaction: {
          chainId: CHAIN_ID,
          type: 2, //eip1559 transaction
          value: BigNumber.from(0),
          gasLimit: 50000,
          data: "0x",
          maxFeePerGas: GWEI.mul(3), // 3 ether
          maxPriorityFeePerGas: GWEI.mul(2),
          to: "0x"
        },
        signer: wallet
      }], blockNumber + 1
    )
  });
}

main();