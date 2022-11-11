export interface Notary {
  id: string;
  infoUrl: string;
  network: string;
  addressId: string;
}

export interface NotaryConnectionInfo {
  address: string;
  port: string;
}

export const notaryServerInfo = {
  'algorand-testnet': {
    address: 'https://testnet-algorand.api.purestake.io/idx2',
    port: '',
  },
  'algorand-mainnet': {
    address: 'https://mainnet-algorand.api.purestake.io/idx2',
    port: '',
  },
};

export interface AlgorandNotaryAccessInfo {
  network: string;
  account: string;
  token: Record<string, string>;
}

export const requiredTrustedNotaries = {
  traent: {
    network: 'algorand-mainnet',
    account: 'MXIH6O3WOTPW5EGMBQ76PDGKM55OPJUENYGPSWP2AW66M7QEPYH2L4GUJU',
    token: { 'X-API-key': '1JgDy8s4GK41zwd4saktM6JavUnxDH0y8AO1Sfi8' },
  },
};
