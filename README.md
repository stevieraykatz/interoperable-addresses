# Interoperable Addresses (ERC-7930)

A minimal TypeScript implementation for creating and managing Interoperable Addresses according to the [ERC-7930 specification](./spec.md).

## Features

- ✅ Single lightweight dependency (`@noble/hashes` - audited cryptography library)
- ✅ Full TypeScript support with type definitions
- ✅ ERC-7930 v1 binary encoding
- ✅ Human-readable name format support with checksums
- ✅ Extensible chain type system (CAIP-350)

## Installation

```bash
npm install interoperable-addresses
# or
yarn add interoperable-addresses
```

## Usage

### Basic Example: Encoding an Ethereum Address

```typescript
import {
  createInteroperableAddress,
  encodeInteroperableAddress,
  ChainType,
  hexToBytes,
  bytesToHex,
} from 'interoperable-addresses';

// Create an interoperable address for Ethereum mainnet
const interopAddress = createInteroperableAddress({
  chainType: ChainType.EIP155,
  chainReference: new Uint8Array([1]), // Chain ID 1 (Ethereum mainnet)
  address: hexToBytes('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
});

// Encode to binary format
const encoded = encodeInteroperableAddress(interopAddress);
console.log(bytesToHex(encoded));
// Output: 0x00010000010114D8DA6BF26964AF9D7EED9E03E53415D37AA96045
```

### Creating Human-Readable Names (with checksum)

```typescript
import {
  createInteroperableAddress,
  toInteroperableName,
  formatInteroperableName,
  ChainType,
  hexToBytes,
} from 'interoperable-addresses';

const interopAddress = createInteroperableAddress({
  chainType: ChainType.EIP155,
  chainReference: new Uint8Array([1]),
  address: hexToBytes('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
});

const name = toInteroperableName(
  interopAddress,
  'eip155:1', // chain string
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // address string
);

console.log(formatInteroperableName(name));
// Output: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155:1#4CA88C9C
```

### Quick Encoding

```typescript
import { createAndEncode, ChainType, hexToBytes, bytesToHex } from 'interoperable-addresses';

const encoded = createAndEncode({
  chainType: ChainType.EIP155,
  chainReference: new Uint8Array([1]),
  address: hexToBytes('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
});

console.log(bytesToHex(encoded));
```

### Working with Different Chains

```typescript
import { createInteroperableAddress, ChainType, hexToBytes } from 'interoperable-addresses';

// Solana example (requires 32-byte address and chain reference)
const solanaAddress = createInteroperableAddress({
  chainType: ChainType.SOLANA,
  chainReference: hexToBytes('0x45296998a6f8e2a784db5d9f95e18fc23f70441a1039446801089879b08c7ef0'),
  address: hexToBytes('0x05333498d5aea4ae009585c43f7b8c30df8e70187d4a713d134f977fc8dfe0b5'),
});

// EVM address without chain ID
const evmAddress = createInteroperableAddress({
  chainType: ChainType.EIP155,
  address: hexToBytes('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
  // chainReference omitted
});
```

## API Reference

### Types

- `InteroperableAddress` - Binary representation of an interoperable address
- `InteroperableName` - Human-readable name format
- `CreateInteroperableAddressParams` - Input parameters for creating addresses

### Functions

- `createInteroperableAddress(params)` - Creates an interoperable address structure
- `encodeInteroperableAddress(address)` - Encodes to binary format
- `calculateChecksum(address)` - Calculates 4-byte checksum
- `toInteroperableName(address, chain, addressStr)` - Converts to human-readable format
- `formatInteroperableName(name)` - Formats name as string
- `createAndEncode(params)` - One-step create and encode

### Utilities

- `hexToBytes(hex)` - Converts hex string to Uint8Array
- `bytesToHex(bytes, prefix?)` - Converts Uint8Array to hex string
- `numberToBytes(num, length)` - Converts number to big-endian bytes
- `concatBytes(...arrays)` - Concatenates multiple Uint8Arrays
- `keccak256(data)` - Keccak256 hash function

### Constants

- `VERSION_1` - ERC-7930 version 1 identifier (0x0001)
- `ChainType` - CAIP-350 chain type constants
  - `ChainType.EIP155` - EVM-compatible chains
  - `ChainType.SOLANA` - Solana
  - More to be added based on CAIP-350

## Dependencies

This package uses `@noble/hashes` - a modern, audited, minimal-dependency cryptography library. This is the only runtime dependency and provides:

- Keccak256 hashing for checksums
- Byte manipulation utilities
- Well-tested, secure cryptographic primitives

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# The compiled output will be in ./dist
```

## Specification

See [EIP-7930](https://eips.ethereum.org/EIPS/eip-7930) for the complete ERC-7930 specification.

## License

CC0-1.0 - See [LICENSE](./LICENSE) for details

