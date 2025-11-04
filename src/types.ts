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
  /** 
   * Chain reference (e.g., chain ID)
   * - Can be a number (will be encoded as minimum bytes needed, big-endian)
   * - Can be a Uint8Array for custom binary representations
   */
  chainReference?: number | Uint8Array;
  /** 
   * Address
   * - Can be a hex string (with or without 0x prefix)
   * - Can be a Uint8Array for custom binary representations
   */
  address?: string | Uint8Array;
}

