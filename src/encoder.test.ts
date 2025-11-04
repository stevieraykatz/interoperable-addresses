/**
 * Tests for ERC-7930 Interoperable Addresses
 * Using examples from the ERC-7930 specification
 */

import { describe, it, expect } from 'vitest';
import { base58 } from '@scure/base';
import {
  createInteroperableAddress,
  encodeInteroperableAddress,
  calculateChecksum,
  toInteroperableName,
  formatInteroperableName,
  createAndEncode,
} from './encoder';
import { ChainType } from './constants';
import { hexToBytes, bytesToHex } from './utils';

describe('ERC-7930 Interoperable Addresses', () => {
  describe('Example 1: Ethereum mainnet address', () => {
    const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const chainId = 1; // Ethereum mainnet
    const expectedBinary = '0x00010000010114D8DA6BF26964AF9D7EED9E03E53415D37AA96045';
    const expectedChecksum = '4CA88C9C';
    const expectedName = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155:1#4CA88C9C';

    it('should create interoperable address', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: chainId,
        address,
      });

      expect(interopAddress.version).toBe(0x0001);
      expect(interopAddress.chainType).toBe(ChainType.EIP155);
      expect(interopAddress.chainReference).toEqual(new Uint8Array([1]));
      expect(interopAddress.address).toEqual(hexToBytes(address));
    });

    it('should encode to correct binary format', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: chainId,
        address,
      });

      const encoded = encodeInteroperableAddress(interopAddress);
      expect(bytesToHex(encoded)).toBe(expectedBinary);
    });

    it('should calculate correct checksum', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: chainId,
        address,
      });

      const checksum = calculateChecksum(interopAddress);
      expect(checksum).toBe(expectedChecksum);
    });

    it('should create correct interoperable name', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: chainId,
        address,
      });

      const name = toInteroperableName(
        interopAddress,
        'eip155:1',
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      );

      expect(formatInteroperableName(name)).toBe(expectedName);
    });

    it('should create and encode in one step', () => {
      const encoded = createAndEncode({
        chainType: ChainType.EIP155,
        chainReference: chainId,
        address,
      });

      expect(bytesToHex(encoded)).toBe(expectedBinary);
    });
  });

  describe('Example 2: Solana mainnet address', () => {
    // Solana uses base58 encoding for addresses
    const solanaAddress = 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2';
    const solanaGenesisHash = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
    
    // Convert base58 to binary
    const addressBytes = base58.decode(solanaAddress);
    const chainReferenceBytes = base58.decode(solanaGenesisHash);
    
    // Using uppercase to match our implementation
    const expectedBinary = '0x000100022045296998A6F8E2A784DB5D9F95E18FC23F70441A1039446801089879B08C7EF02005333498D5AEA4AE009585C43F7B8C30DF8E70187D4A713D134F977FC8DFE0B5';
    const expectedChecksum = '88835C11';
    const expectedName = `${solanaAddress}@solana:${solanaGenesisHash}#${expectedChecksum}`;

    it('should create interoperable address', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
        address: addressBytes,
      });

      expect(interopAddress.version).toBe(0x0001);
      expect(interopAddress.chainType).toBe(ChainType.SOLANA);
      expect(interopAddress.chainReference.length).toBe(32);
      expect(interopAddress.address.length).toBe(32);
    });

    it('should encode to correct binary format', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
        address: addressBytes,
      });

      const encoded = encodeInteroperableAddress(interopAddress);
      expect(bytesToHex(encoded)).toBe(expectedBinary);
    });

    it('should calculate correct checksum', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
        address: addressBytes,
      });

      const checksum = calculateChecksum(interopAddress);
      expect(checksum).toBe(expectedChecksum);
    });

    it('should create correct interoperable name', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
        address: addressBytes,
      });

      const name = toInteroperableName(
        interopAddress,
        `solana:${solanaGenesisHash}`,
        solanaAddress
      );

      expect(formatInteroperableName(name)).toBe(expectedName);
    });
  });

  describe('Example 3: EVM address without chainid', () => {
    const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const expectedBinary = '0x000100000014D8DA6BF26964AF9D7EED9E03E53415D37AA96045';
    const expectedChecksum = 'B26DB7CB';
    const expectedName = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#B26DB7CB';

    it('should create interoperable address without chain reference', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        address,
      });

      expect(interopAddress.version).toBe(0x0001);
      expect(interopAddress.chainType).toBe(ChainType.EIP155);
      expect(interopAddress.chainReference.length).toBe(0);
      expect(interopAddress.address).toEqual(hexToBytes(address));
    });

    it('should encode to correct binary format', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        address,
      });

      const encoded = encodeInteroperableAddress(interopAddress);
      expect(bytesToHex(encoded)).toBe(expectedBinary);
    });

    it('should calculate correct checksum', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        address,
      });

      const checksum = calculateChecksum(interopAddress);
      expect(checksum).toBe(expectedChecksum);
    });

    it('should create correct interoperable name', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        address,
      });

      const name = toInteroperableName(
        interopAddress,
        'eip155',
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      );

      expect(formatInteroperableName(name)).toBe(expectedName);
    });
  });

  describe('Example 4: Solana mainnet network, no address', () => {
    const solanaGenesisHash = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
    const chainReferenceBytes = base58.decode(solanaGenesisHash);
    
    // Using uppercase to match our implementation
    const expectedBinary = '0x000100022045296998A6F8E2A784DB5D9F95E18FC23F70441A1039446801089879B08C7EF000';
    const expectedChecksum = '2EB18670';
    const expectedName = `@solana:${solanaGenesisHash}#${expectedChecksum}`;

    it('should create interoperable address without address field', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
      });

      expect(interopAddress.version).toBe(0x0001);
      expect(interopAddress.chainType).toBe(ChainType.SOLANA);
      expect(interopAddress.chainReference.length).toBe(32);
      expect(interopAddress.address.length).toBe(0);
    });

    it('should encode to correct binary format', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
      });

      const encoded = encodeInteroperableAddress(interopAddress);
      expect(bytesToHex(encoded)).toBe(expectedBinary);
    });

    it('should calculate correct checksum', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
      });

      const checksum = calculateChecksum(interopAddress);
      expect(checksum).toBe(expectedChecksum);
    });

    it('should create correct interoperable name', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.SOLANA,
        chainReference: chainReferenceBytes,
      });

      const name = toInteroperableName(
        interopAddress,
        `solana:${solanaGenesisHash}`,
        ''
      );

      expect(formatInteroperableName(name)).toBe(expectedName);
    });
  });

  describe('Validation', () => {
    it('should throw error when both chainReference and address are empty', () => {
      expect(() => {
        createInteroperableAddress({
          chainType: ChainType.EIP155,
        });
      }).toThrow('At least one of chainReference or address must be provided');
    });

    it('should throw error when chainReference exceeds 255 bytes', () => {
      expect(() => {
        createInteroperableAddress({
          chainType: ChainType.EIP155,
          chainReference: new Uint8Array(256),
        });
      }).toThrow('Chain reference length cannot exceed 255 bytes');
    });

    it('should throw error when address exceeds 255 bytes', () => {
      expect(() => {
        createInteroperableAddress({
          chainType: ChainType.EIP155,
          address: new Uint8Array(256),
        });
      }).toThrow('Address length cannot exceed 255 bytes');
    });

    it('should throw error when chainType is invalid', () => {
      expect(() => {
        createInteroperableAddress({
          chainType: -1,
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        });
      }).toThrow('Chain type must be a 2-byte value (0-65535)');

      expect(() => {
        createInteroperableAddress({
          chainType: 0x10000,
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        });
      }).toThrow('Chain type must be a 2-byte value (0-65535)');
    });
  });

  describe('Number to bytes conversion', () => {
    it('should convert small chain IDs correctly', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: 1,
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(interopAddress.chainReference).toEqual(new Uint8Array([1]));
    });

    it('should convert larger chain IDs correctly', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: 137, // Polygon
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(interopAddress.chainReference).toEqual(new Uint8Array([137]));
    });

    it('should convert multi-byte chain IDs correctly', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: 42161, // Arbitrum (0xA4B1)
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(interopAddress.chainReference).toEqual(new Uint8Array([0xA4, 0xB1]));
    });

    it('should accept hex string addresses', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: 1,
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(interopAddress.address.length).toBe(20);
    });

    it('should accept addresses without 0x prefix', () => {
      const interopAddress = createInteroperableAddress({
        chainType: ChainType.EIP155,
        chainReference: 1,
        address: 'd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(interopAddress.address.length).toBe(20);
    });
  });

  describe('Utility functions', () => {
    it('should handle hex strings with and without 0x prefix', () => {
      const withPrefix = hexToBytes('0xABCD');
      const withoutPrefix = hexToBytes('ABCD');
      
      expect(withPrefix).toEqual(withoutPrefix);
      expect(bytesToHex(withPrefix)).toBe('0xABCD');
      expect(bytesToHex(withPrefix, false)).toBe('ABCD');
    });

    it('should preserve case in address conversion', () => {
      const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
      const bytes = hexToBytes(address);
      const result = bytesToHex(bytes);
      
      // bytesToHex returns uppercase
      expect(result.toUpperCase()).toBe(address.toUpperCase());
    });
  });
});

