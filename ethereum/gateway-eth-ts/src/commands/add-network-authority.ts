import { Command, Flags } from "@oclif/core";
import { BigNumber, utils, Wallet } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { GatewayToken } from "../contracts/GatewayToken";
import {
  authorityKeypairFlag,
  gatekeeperNetworkPublicKeyFlag,
  clusterFlag,
  confirmationsFlag,
  gasPriceFeeFlag,
} from "../utils/flags";
import { TxBase } from "../utils/tx";
import { mnemonicSigner, privateKeySigner } from "../utils/signer";

export default class AddNetworkAuthority extends Command {
  static description = "Add a network authority to a GatewayToken contract";

  static examples = [
    `$ gateway add-network-authority 0x893F4Be53274353CD3379C87C8fd1cb4f8458F94
		`,
  ];

  static flags = {
    help: Flags.help({ char: "h" }),
    authorityKeypair: authorityKeypairFlag(),
    gatekeeperNetworkPublicKey: gatekeeperNetworkPublicKeyFlag(),
    cluster: clusterFlag(),
    gasPriceFee: gasPriceFeeFlag(),
    confirmations: confirmationsFlag(),
  };

  static args = [
    {
      name: "address",
      required: true,
      description: "The public key of the gatekeeper to add to the network",
      // ? Same as in add-gatekeeper... and same for most remaining commands
      // eslint-disable-next-line @typescript-eslint/require-await
      parse: async (input: string): Promise<string> =>
        utils.isAddress(input) ? input : null,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(AddNetworkAuthority);

    const pk = flags.authorityKeypair;
    const authority: string = args.address as string;
    const provider: BaseProvider = flags.cluster;

    const signer: Wallet = utils.isValidMnemonic(pk)
      ? mnemonicSigner(pk, provider)
      : privateKeySigner(pk, provider);

    const gatekeeperPublicKey: string = flags.gatekeeperNetworkPublicKey;
    const confirmations = flags.confirmations;

    this.log(`Adding:
			network authority ${authority} 
			to GatewayToken ${gatekeeperPublicKey}`);

    const gatewayToken = new GatewayToken(signer, gatekeeperPublicKey);

    const gasPrice = flags.gasPriceFee;
    const gasLimit =
      await gatewayToken.contract.estimateGas.addNetworkAuthority(authority);

    const txParams: TxBase = {
      gasLimit: gasLimit,
      gasPrice: BigNumber.from(utils.parseUnits(String(gasPrice), "gwei")),
    };

    const tx = await gatewayToken.addNetworkAuthority(authority, txParams);
    let hash = tx.hash;
    if (confirmations > 0) {
      hash = (await tx.wait(confirmations)).transactionHash;
    }

    this.log(`Added gatekeeper to Gateway Token contract. TxHash: ${hash}`);
  }
}
