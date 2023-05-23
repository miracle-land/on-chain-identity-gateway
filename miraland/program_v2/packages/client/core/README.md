# `Solana Gateway` Client

A typescript client library for interacting with Identity.com's On-Chain Identity Gateway

## Features

The `gateway-solana-client` library provides the following features:

1. AdminService provides create, update, close, and retrieve Network account methods.
2. NetworkService provides create, update, close, retreive and setState of Gatekeeper methods.
3. GatekeeperService provides issue, refresh, setState, setData, change the associated gatekeeper, expire, and verify of pass account methods.
4. Typescript Client library for AdminService, NetworkService, and GatewayService.
5. It is built on Solana blockchain and is based on the versatile Anchor framework.
6. Supports multiple networks (devnet, testnet, mainnet-beta, etc) and multiple wallets (sollet, solflare, etc).
7. On a Network and Gatekeeper level, the Gateway Protocol offers flexible payment configuration for Gateway Passes (e.g. pay for pass on issue, pay for pass on refresh, pay for pass on verify, etc).
8. The Gateway Protocol enables the usage of non-transferrable permissioned Gateway passes (mirroring properties of SBTs) that convey some property to the pass holder. 
9. Requirements and characteristics of a pass are defined within a Gatekeeper Network. Gatekeepers, belonging to Gatekeeper Networks are authoritative Issuers of Gateway Passes.

## Client library

### Installation

In TS/JS project:

```shell
yarn add @identity.com/gateway-solana-client # or npm install @identity.com/gateway-solana-client
```

### Usage - Setup and Resolution

#### AdminService

The AdminService class controls all network operations within the client. It can be built with or without Anchor, though the build methods differ slightly.

```ts
    const program = anchor.workspace.SolanaAnchorGateway as anchor.Program<SolanaAnchorGateway>;
    const programProvider = program.provider as anchor.AnchorProvider;
    const authorityKeypair = Keypair.generate();
    const guardianAuthority = new anchor.Wallet(authorityKeypair);
    const networkAuthority = Keypair.generate();

    // with anchor 
    const service = await AdminService.buildFromAnchor(
        program,
        networkAuthority.publicKey,
        {
            clusterType: 'localnet',
            wallet: guardianAuthority,
        },
        programProvider
    );
    
    // without anchor
    const service = await AdminService.build(
        network: PublicKey,
        options: GatewayServiceOptions = {
            clusterType: SOLANA_MAINNET,
        }
    );
```

#### NetworkService

The NetworkService class controls all gatekeeper operations within the client. It can be built with or without Anchor, though the build methods differ slightly. Must be built with an existing network already in place.

```ts
    const program = anchor.workspace.SolanaAnchorGateway as anchor.Program<SolanaAnchorGateway>;
    const programProvider = program.provider as anchor.AnchorProvider;
    const guardianAuthority = Keypair.generate();
    const networkAuthority = Keypair.generate();
    const gatekeeperAuthority = Keypair.generate();

    // PDA for a gatekeeper — derived from network's account and a provided authority
    [gatekeeperDataAccount] = await NetworkService.createGatekeeperAddress(
      gatekeeperAuthority.publicKey,
      networkAuthority.publicKey
    );

    // with anchor 
    const networkService = await NetworkService.buildFromAnchor(
      program,
      gatekeeperAuthority.publicKey,
      gatekeeperDataAccount,
      {
        clusterType: 'devnet',
        wallet: new anchor.Wallet(gatekeeperAuthority),
      },
      programProvider
    );

    // without anchor
    const service = await AdminService.build(
      gatekeeperAuthority.publicKey,
      gatekeeperDataAccount,
      options: GatewayServiceOptions = {
        clusterType: SOLANA_MAINNET,
      }
    );
```

#### GatekeeperService

The GatekeeperService class controls all pass operations within the client. It can be built with or without Anchor, though the build methods differ slightly. Must be built with both an existing network and gatekeeper in place.

```ts
    const program = anchor.workspace.SolanaAnchorGateway as anchor.Program<SolanaAnchorGateway>;
    const programProvider = program.provider as anchor.AnchorProvider;
    const guardianAuthority = Keypair.generate();
    const networkAuthority = Keypair.generate();
    const gatekeeperAuthority = Keypair.generate();

    // Built AdminService
    const adminService: AdminService;
    // Built NetworkService
    const networkService: NetworkService;
    // pre-existing network
    const networkPDA: PublicKey;
    // pre-existing gatekeeper
    const gatekeeperPDA: PublicKey

    // with anchor
    const gatekeeperService = await GatekeeperService.buildFromAnchor(
        program,
        networkPDA,
        gatekeeperPDA,
        options: GatewayServiceOptions = {
            clusterType: 'devnet',
        },
        programProvider
    );

    // without anchor
    const gatekeeperService = await GatekeeperService.build(
        networkPDA,
        gatekeeperPDA,
        options: GatewayServiceOptions = {
            clusterType: SOLANA_MAINNET,
        }
    );
```

## Usage - `network` Manipulation

The following are instructions that can be executed against a network.

When manipulating a network one generally needs two authoritative elements:

1. An `authority`, a (native) Verification Method with a `Capability Invocation` flag, that is allowed to manipulate the network.
2. A `fee payer`, a Solana account that covers the cost of the transaction execution.

### Create a Network Account

creates a new network account

```ts
    await adminService.createNetwork(data: CreateNetworkData, authority?: PublicKey).rpc();
```

In order to use createNetwork instruction, you need to pass in the parameter, CreateNetworkData. 

```ts
    export type CreateNetworkData = {
      // the number of keys needed to change the `auth_keys`.  
      authThreshold: number;
      // the length of time a pass lasts in seconds. `0` means does not expire. 
      passExpireTime: number;
      // The fees for this network, it's type feeStructure is defined below. 
      fees: FeeStructure[]; 
      // Keys with permissions on the network, it's type AuthKeyStructure is defined below.
      authKeys: AuthKeyStructure[]; 
      // A set of all supported tokens on the network, it's type supportedToken is defined below.
      supportedTokens: SupportedToken[]; 
    };
```

```ts
    export type FeeStructure = {
      token: PublicKey;
      issue: number;
      refresh: number;
      expire: number;
      verify: number;
    };
```

```ts
    export type AuthKeyStructure = {
      flags: number;
      key: PublicKey;
    };
```

```ts
    export type SupportedToken = {
      key: PublicKey;
      settlementInfo: SettlementInfo;
    };
```

### Update a Network Account

updates an existing network account with new data (e.g. new guardian authority)

```ts
    await adminService.updateNetwork(data: UpdateNetworkData, authority?: PublicKey).rpc();
```
In order to use updateNetwork instruction, you need to pass in the parameter, UpdateNetworkData. 

```ts
    export type UpdateNetworkData = {
      // The number of keys needed to change the `auth_keys`.  
      authThreshold: number;
      // The length of time a pass lasts in seconds. `0` means does not expire.
      passExpireTime: number; 
      // The fees for this network, it's type feeStructure is defined below.
      fees: UpdateFeeStructure; 
      // Keys with permissions on the network, it's type AuthKeyStructure is defined below.
      authKeys: UpdateAuthKeytructure; 
      // Features on the network, index relates to which feature it is. 
      // There are 32 bytes of data available for each feature.
      networkFeatures: number; 
      // A set of all supported tokens on the network, it's type UpdateSupportedToken is defined below.
      supportedTokens: UpdateSupportedTokens; 
    };
```

```ts
    export type AuthKeyStructure = {
      flags: number;
      key: PublicKey;
    };
```

```ts
    export type UpdateSupportedTokens = {
      add: SupportedToken[];
      remove: PublicKey[];
    };
```
 
### Close a Network Account

Close a network account. This will also close all gatekeepers associated with the network.

```ts
    // destination - account that receives the rent back.
    await adminService.closeNetwork(destination: PublicKey, authority?: PublicKey).rpc();
     
```

### Retrieve a Network Account

Retrieves a network account information 

```ts
    await adminService.getNetworkAccount(account: PublicKey).rpc();
```

Below is the return types.

```ts
    export type NetworkAccount = {
      version: number;
      authority: PublicKey;
      networkIndex: number;
      authThreshold: number;
      passExpireTime: number;
      fees: FeeStructure[];
      authKeys: AuthKeyStructure[];
      networkFeatures: number;
      // Hash Set
      supportedTokens: SupportedToken[];
      // Hash Set
      gatekeepers: PublicKey[];
    };
```

## Usage - `gatekeeper` Manipulation

The following are instructions that can be executed against a gatekeeper.

When manipulating a DID one generally needs two authoritative elements:

1. An `authority`, a (native) Verification Method with a `Capability Invocation` flag, that is allowed to manipulate the network.
2. A `fee payer`, a Solana account that covers the cost of the transaction execution.

### Create a Gatekeeper Account

creates a new gatekeeper account 

```ts
    await networkService.createGatekeeper(
      network: PublicKey, 
      stakingAccount: PublicKey, 
      payer: PublicKey, 
      data: CreateGatekeeperData
    ).rpc();
```

In order to use createGatekeeper instruction, you need to pass in the parameter, CreateGatekeeperData.

```ts
    export type CreateGatekeeperData = {
      // The fees for this gatekeeper  
      tokenFees: FeeStructure[];
      // The number of keys needed to change the `auth_keys`
      authThreshold: number;
      // The keys with permissions on this gatekeeper
      authKeys: AuthKeyStructure[]; 
    };
```

### Update a Gatekeeper Account

updates an existing gatekeeper account 

```ts
    await networkService.updateGatekeeper(
        data: UpdateGatekeeperData,
        stakingAccount: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

In order to use updateGatekeeper instruction, you need to pass in the parameter, UpdateGatekeeperData.

```ts
    export type UpdateGatekeeperData = {
      // The fees for this gatekeeper, it's type UpdateFeeStructure is defined below.  
      tokenFees: UpdateFeeStructure;
      // The number of keys needed to change the `auth_keys` 
      authThreshold: number;
      // The keys with permissions on this   gatekeeper, it's type UpdateAuthKeytructure is defined below.
      authKeys: UpdateAuthKeytructure; 
    };
```

```ts
    export type UpdateFeeStructure = {
      add: FeeStructure[];
      remove: PublicKey[];
    };
```

```ts
    export type UpdateAuthKeytructure = {
      add: AuthKeyStructure[];
      remove: PublicKey[];
    };
```

### Set a Gatekeeper Account's State

sets the state of an existing gatekeeper account 0,1,2 = active, frozen, halted

```ts
    await networkService.setGatekeeperState(
        state: GatekeeperState,
        stakingAccount: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

```ts
    await networkService.setGatekeeperState(
        state: GatekeeperState,
        authority?: PublicKey
    ).rpc();
```

### Close a Gatekeeper Account

Close a gatekeeper account. This will also close all passes associated with the gatekeeper.

```ts
    await networkService.closeNetwork(
        network: PublicKey,
        destination?: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

### Retrieve a Gatekeeper Account

Retrieves a gatekeeper account information

```ts
    await networkService.getGatekeeperAccount(account: PublicKey).rpc();
```
Below is the return types.

```ts
    export type GatekeeperAccount = {
      // The version of this struct, should be 0 until a new version is released  
      version: number; 
      // The initial authority key
      authority: PublicKey; 
      // The [`GatekeeperNetwork`] this gatekeeper is on
      gatekeeperNetwork: PublicKey;
      // The staking account of this gatekeeper 
      stakingAccount: PublicKey;
      // The fees for this gatekeeper
      tokenFees: FeeStructure[]; 
      // The keys with permissions on this gatekeeper
      authKeys: AuthKeyStructure[]; 
      // The state of gatekeeper, default is   Active, it can be frozen or be revoked.
      state: GatekeeperState; 
    };
```

```ts
    export enum GatekeeperState {
      Active,
      Frozen,
      Halted,
    };
```

## Usage - `pass` Manipulation

### Issue a Pass Account

issues a new pass account

```ts
    await gatekeeperService.issuePass(
        data: IssuePassData,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

TODO: IssuePassData 

### Refresh a Pass Account

refreshes an existing pass account

```ts
    await gatekeeperService.refreshPass(
        data: RefreshPassData,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

TODO: RefreshPassData 

### Set State for a Pass Account

sets the state of an existing pass account 0,1,2 = active, frozen, halted

```ts
    await gatekeeperService.setPassState(
        state: PassState,
        pass: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```
TODO: PassState

### Set Data for a Pass Account

sets the data of an existing pass account

```ts
    await gatekeeperService.setPassData(
        data: SetPassData,
        pass: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
``` 
TODO: SetPassData

### Change the Associated Gatekeeper for a Pass Account

changes the associated gatekeeper of an existing pass account

```ts
    await gatekeeperService.changePassGatekeeper(
        gatekeeper: PublicKey,
        pass: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

### Expire a Pass Account

expires an existing pass account

```ts
    await gatekeeperService.expirePass(
        pass: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

### Verify a Pass Account

verifies an existing pass account

```ts
    await gatekeeperService.verifyPass(
        pass: PublicKey,
        payer?: PublicKey,
        authority?: PublicKey
    ).rpc();
```

## Contributing

Note: Before contributing to this project, please check out the code of conduct and contributing guidelines.

Gateway uses [yarn](https://yarnpkg.com/)

```shell
yarn
```

## Running the tests

### E2E tests

Install Solana locally by following the steps described [here](https://docs.solana.com/cli/install-solana-cli-tools).
Also, install Anchor by using the information found [here](https://book.anchor-lang.com/getting_started/installation.html)

```shell
yarn test
```
