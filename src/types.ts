/**
 * ERC-7930 Interoperable Address Types
 * Based on the ERC-7930 specification
 */

/**
 * Represents an Interoperable Address in binary format
 */
export interface InteroperableAddress {
  version: number;
  chainType: number;
  chainReference: Uint8Array;
  address: Uint8Array;
}

/**
 * Represents an Interoperable Name in human-readable format
 */
export interface InteroperableName {
  address: string;
  chain: string;
  checksum: string;
}

/**
 * Input parameters for creating an Interoperable Address
 */
export interface CreateInteroperableAddressParams {
  /** Chain type identifier from CAIP-350 (2 bytes) */
  chainType: number;
  /** Binary representation of chain reference (e.g., chain ID) */
  chainReference?: Uint8Array;
  /** Binary representation of the address */
  address?: Uint8Array;
}

