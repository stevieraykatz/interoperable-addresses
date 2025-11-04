/**
 * ERC-7930 Interoperable Address Encoder
 * 
 * This module provides functions to create and encode Interoperable Addresses
 * according to the ERC-7930 specification.
 */

import { InteroperableAddress, InteroperableName, CreateInteroperableAddressParams } from './types';
import { VERSION_1 } from './constants';
import {
  concatBytes,
  numberToBytes,
  numberToMinBytes,
  bytesToHex,
  hexToBytes,
  keccak256,
} from './utils';

/**
 * Creates an Interoperable Address v1 in binary format
 * 
 * Binary format structure:
 * ┌─────────┬───────────┬──────────────────────┬────────────────┬───────────────┬─────────┐
 * │ Version │ ChainType │ ChainReferenceLength │ ChainReference │ AddressLength │ Address │
 * └─────────┴───────────┴──────────────────────┴────────────────┴───────────────┴─────────┘
 * 
 * @param params - Parameters for creating the interoperable address
 * @returns The interoperable address structure
 * @throws Error if both chainReference and address are empty
 */
export function createInteroperableAddress(
  params: CreateInteroperableAddressParams
): InteroperableAddress {
  const { chainType } = params;
  
  // Convert chainReference to Uint8Array if it's a number
  let chainReference: Uint8Array;
  if (params.chainReference === undefined) {
    chainReference = new Uint8Array(0);
  } else if (typeof params.chainReference === 'number') {
    chainReference = numberToMinBytes(params.chainReference);
  } else {
    chainReference = params.chainReference;
  }
  
  // Convert address to Uint8Array if it's a string
  let address: Uint8Array;
  if (params.address === undefined) {
    address = new Uint8Array(0);
  } else if (typeof params.address === 'string') {
    address = hexToBytes(params.address);
  } else {
    address = params.address;
  }

  // Validate: at least one of chainReference or address must be non-zero
  if (chainReference.length === 0 && address.length === 0) {
    throw new Error('At least one of chainReference or address must be provided');
  }

  // Validate: chainReferenceLength and addressLength must fit in 1 byte
  if (chainReference.length > 255) {
    throw new Error('Chain reference length cannot exceed 255 bytes');
  }
  if (address.length > 255) {
    throw new Error('Address length cannot exceed 255 bytes');
  }

  // Validate: chainType must fit in 2 bytes
  if (chainType < 0 || chainType > 0xffff) {
    throw new Error('Chain type must be a 2-byte value (0-65535)');
  }

  return {
    version: VERSION_1,
    chainType,
    chainReference,
    address,
  };
}

/**
 * Encodes an Interoperable Address to its binary representation
 * 
 * @param interopAddress - The interoperable address to encode
 * @returns The binary encoded address as Uint8Array
 */
export function encodeInteroperableAddress(interopAddress: InteroperableAddress): Uint8Array {
  const version = numberToBytes(interopAddress.version, 2);
  const chainType = numberToBytes(interopAddress.chainType, 2);
  const chainReferenceLength = numberToBytes(interopAddress.chainReference.length, 1);
  const addressLength = numberToBytes(interopAddress.address.length, 1);

  return concatBytes(
    version,
    chainType,
    chainReferenceLength,
    interopAddress.chainReference,
    addressLength,
    interopAddress.address
  );
}

/**
 * Calculates the checksum for an Interoperable Address
 * 
 * The checksum is calculated by:
 * 1. Taking the v1 binary representation WITHOUT the version field
 * 2. Computing keccak256 hash
 * 3. Taking the first 4 bytes
 * 
 * @param interopAddress - The interoperable address
 * @returns 4-byte checksum as hex string (8 characters, uppercase)
 */
export function calculateChecksum(
  interopAddress: InteroperableAddress
): string {
  // Encode without version field for checksum calculation
  const chainType = numberToBytes(interopAddress.chainType, 2);
  const chainReferenceLength = numberToBytes(interopAddress.chainReference.length, 1);
  const addressLength = numberToBytes(interopAddress.address.length, 1);

  const checksumInput = concatBytes(
    chainType,
    chainReferenceLength,
    interopAddress.chainReference,
    addressLength,
    interopAddress.address
  );

  // Calculate keccak256 hash
  const hash = keccak256(checksumInput);

  // Take first 4 bytes and convert to hex
  const checksum = hash.slice(0, 4);
  return bytesToHex(checksum, false);
}

/**
 * Converts an Interoperable Address to its human-readable name format
 * 
 * Format: <address>@<chain>#<checksum>
 * 
 * @param interopAddress - The interoperable address
 * @param chainString - The chain identifier string (e.g., "eip155:1", "solana:mainnet")
 * @param addressString - The human-readable address string
 * @returns The interoperable name
 */
export function toInteroperableName(
  interopAddress: InteroperableAddress,
  chainString: string,
  addressString: string
): InteroperableName {
  const checksum = calculateChecksum(interopAddress);

  return {
    address: addressString,
    chain: chainString,
    checksum,
  };
}

/**
 * Formats an Interoperable Name as a string
 * 
 * @param name - The interoperable name
 * @returns Formatted string: <address>@<chain>#<checksum>
 */
export function formatInteroperableName(name: InteroperableName): string {
  return `${name.address}@${name.chain}#${name.checksum}`;
}

/**
 * Complete workflow: Create and encode an ERC-7930 address to binary format
 * 
 * @param params - Parameters for creating the interoperable address
 * @returns The binary encoded address as Uint8Array
 */
export function createAndEncode(params: CreateInteroperableAddressParams): Uint8Array {
  const interopAddress = createInteroperableAddress(params);
  return encodeInteroperableAddress(interopAddress);
}

