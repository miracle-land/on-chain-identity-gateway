/* Autogenerated file. Do not edit manually. */
// @ts-nocheck
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IGatewayTokenVerifier,
  IGatewayTokenVerifierInterface,
} from "../../../contracts/interfaces/IGatewayTokenVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "network",
        type: "uint256",
      },
    ],
    name: "verifyToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "verifyToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IGatewayTokenVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): IGatewayTokenVerifierInterface {
    return new utils.Interface(_abi) as IGatewayTokenVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGatewayTokenVerifier {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IGatewayTokenVerifier;
  }
}
