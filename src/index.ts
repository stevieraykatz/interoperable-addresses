/**
 * ERC-7930 Interoperable Addresses
 * 
 * A minimal TypeScript implementation for creating and managing
 * Interoperable Addresses according to the ERC-7930 specification.
 */

// Export types
export type {
  InteroperableAddress,
  InteroperableName,
  CreateInteroperableAddressParams,
} from './types';

// Export constants
export { VERSION_1, ChainType } from './constants';
export type { ChainTypeValue } from './constants';

// Export encoder functions
export {
  createInteroperableAddress,
  encodeInteroperableAddress,
  calculateChecksum,
  toInteroperableName,
  formatInteroperableName,
  createAndEncode,
} from './encoder';

// Export utilities
export {
  concatBytes,
  numberToBytes,
  numberToMinBytes,
  hexToBytes,
  bytesToHex,
  keccak256,
} from './utils';

