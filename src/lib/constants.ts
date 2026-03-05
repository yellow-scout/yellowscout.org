import { parseAbi, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';

export const CHAIN = sepolia;
export const TOKEN_SYMBOL = 'YELLOW';
export const TOKEN_DECIMALS = 18;
export const DRIP_AMOUNT = '1000';
export const DRIP_AMOUNT_BASE_UNITS = parseUnits(DRIP_AMOUNT, TOKEN_DECIMALS);
export const COOLDOWN_SECONDS = 86_400; // 24 hours, matches on-chain
export const IP_LIMIT_PER_HOUR = 3;
export const FINGERPRINT_LIMIT_PER_HOUR = 5;
export const GLOBAL_LIMIT_PER_HOUR = 50;

export const TOKEN_ADDRESS = '0x236eB848C95b231299B4AA9f56c73D6893462720' as const;
export const FAUCET_CONTRACT_ADDRESS = '0x914abaDC0e36e03f29e4F1516951125c774dBAc8' as const;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export const TOKEN_ABI = parseAbi([
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

export const FAUCET_ABI = parseAbi([
  'function drip()',
  'function dripTo(address recipient)',
  'function setCooldown(uint256 _cooldown)',
  'function setDripAmount(uint256 _dripAmount)',
  'function setOwner(address _owner)',
  'function withdraw(uint256 amount)',
  'function TOKEN() view returns (address)',
  'function owner() view returns (address)',
  'function dripAmount() view returns (uint256)',
  'function cooldown() view returns (uint256)',
  'function lastDrip(address) view returns (uint256)',
]);

export const ETHERSCAN_TOKEN_URL = `https://sepolia.etherscan.io/token/${TOKEN_ADDRESS}`;
export const ETHERSCAN_CONTRACT_URL = `https://sepolia.etherscan.io/address/${FAUCET_CONTRACT_ADDRESS}`;
export const ETHERSCAN_TX_URL = (txHash: string) => `https://sepolia.etherscan.io/tx/${txHash}`;
export const ETHERSCAN_ADDRESS_URL = (address: string) =>
  `https://sepolia.etherscan.io/address/${address}`;
