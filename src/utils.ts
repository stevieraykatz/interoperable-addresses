/**
 * Utility functions for ERC-7930 Interoperable Addresses
 * Uses @noble/hashes for cryptographic operations
 */

import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex as nobleToHex, hexToBytes as nobleFromHex, concatBytes as nobleConcatBytes } from '@noble/hashes/utils';

/**
 * Keccak256 hash function
 * @param data - The data to hash
 * @returns The keccak256 hash of the data
 */
export function keccak256(data: Uint8Array): Uint8Array {
  return keccak_256(data);
}

/**
 * Concatenates multiple Uint8Arrays into a single Uint8Array
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  return nobleConcatBytes(...arrays);
}

/**
 * Converts a number to a big-endian byte array of specified length
 */
export function numberToBytes(num: number, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = length - 1; i >= 0; i--) {
    bytes[i] = num & 0xff;
    num = num >> 8;
  }
  return bytes;
}

/**
 * Converts a hex string to Uint8Array
 * Handles both 0x-prefixed and non-prefixed hex strings
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex;
  return nobleFromHex(cleanHex);
}

/**
 * Converts a Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array, prefix: boolean = true): string {
  const hex = nobleToHex(bytes).toUpperCase();
  return prefix ? '0x' + hex : hex;
}

