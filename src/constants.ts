/**
 * ERC-7930 Constants
 * Chain types based on CAIP-350
 */

/**
 * Version 1 of the Interoperable Address format
 */
export const VERSION_1 = 0x0001;

/**
 * CAIP-350 Chain Type identifiers (2-byte values)
 * TODO: Populate with complete CAIP-350 chain type registry
 * 
 * These are namespace identifiers that correspond to CAIP-2 namespaces.
 * Each chain type defines how to serialize/deserialize chain references and addresses.
 */
export const ChainType = {
  /**
   * EIP-155 namespace for EVM-compatible chains
   * Ethereum and EVM-compatible chains
   */
  EIP155: 0x0000,

  /**
   * Solana namespace
   */
  SOLANA: 0x0002,

  // TODO: Add more chain types from CAIP-350 specification
  // Examples to be added:
  // - Bitcoin
  // - Cosmos
  // - Polkadot
  // - etc.
} as const;

export type ChainTypeValue = typeof ChainType[keyof typeof ChainType];

