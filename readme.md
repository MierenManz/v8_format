# Explaination

Idk why I am doing this. But this "guide" explains the v8 internal binary format
used by the (V8 Engine)[https://v8.dev]

## General Format

The format always starts with 2 magic bytes `0xFF 0x0F` Then it will use a
indicator byte to tell the deserializer on how to deserialize the next section
of bytes.

| Datatype       | Indicator            |
| -------------- | -------------------- |
| string         | " (0x22)             |
| Int            | I (0x49)             |
| BigInt         | Z (0x5A)             |
| Float          | N (0x4E)             |
| Boolean        | T (0x54) or F (0x46) |
| Null           | 0 (0x30)             |
| Undefined      | _ (0x5F)             |
| Array          | A (0x41)             |
| Object Literal | o (0x7B)             |

Note to self. Add binary data like Uint8Array aswell

## String Format

Each string starts off with a `"` (0x22) to indicate the string datatype. Then
uses a LEB128 encoded varint to indicate the length of the data of the string.
Then the string data comes in.

serializing a string like `HelloWorld` this will look like this.

```
0xFF  0x0F    Magic bytes
0x22  0x0A    String indicator byte and varint encoded length
0x48  0x65    He
0x6C  0x6C    ll
0x6F  0x57    oW
0x6F  0x72    or
0x6C  0x64    ld
```

## Integer Format

The integer format of v8 is quite simple but confusing at first. It uses varint
encoding for all signed integers. If you have ever worked with varint then you
know that this is not possible with varint. So to avoid this trouble we first
zigzag encode integers and then we encode it into a varint

some examples

Negative Integer -12

```
0xFF  0x0F    Magic bytes
0x49  0x17    Indicator byte and varint encoded value
```

Positive Integer 12

```
0xFF  0x0F    Magic bytes
0x49  0x18    Indicator byte and varint encoded value
```

## BigInt Format

The bigint format is a mix between the integer format and float format. It has a
indicator byte which is `Z` (0x5A) and after that a varint bitfield specifying
how many bytes it uses and if the value is positive or negative. It is alot more
complex than either a float or integer because it has a unknown size

Negative BigInt -12

```
0xFF  0x0F    Magic bytes
0x5A  0x11    BigInt indicator byte and Varint bitfield.
0x0C  0x00    Bigint value...
0x00  0x00
0x00  0x00
0x00
```

Positive BigInt 12

```
0xFF  0x0F    Magic bytes
0x5A  0x10    BigInt indicator byte and Varint bitfield.
0x0C  0x00    Bigint value...
0x00  0x00
0x00  0x00
0x00
```

As you can see both are the same and the only difference is the bitfield. In the
negative it changed the LSB (Least significant byte) from a 0 to a 1 making it a
negative value

## Float Format

The float format is by far the easiest one to understand. You only have an
indicator byte `N` (0x4E) and then the float value as 64 bit float (or double)

```
0xFF  0x0F    Magic bytes
0x4E  0x00    Indicator byte and first byte of the 64 bit float
0x00  0x00    bytes of the float
0x00  0x00
0x00  0x29
0x40
```

## Boolean Format

Booleans are the easiest format to serialize. The indicator byte is both the
value and type. `F` (0x46) and `T` (0x54) Are the boolean type indicators where
`F` (0x46) is false and `T` (0x54) is true

False

```
0xFF  0x0F    Magic bytes
0x46          Indicator byte False
```

True

```
0xFF  0x0F    Magic bytes
0x54          Indicator byte True
```

## Null Format

The null format is effectively the same as the boolean format. Just that the
indicator byte changed to `0` (0x30).

```
0xFF  0x0F    Magic bytes
0x30          Indicator byte Null
```

## Undefined Format

Let's repeat the easiest format once again. For `undefined` the format is still
the same as null and booleans but the byte changed once again to `_` (0x5F)

```
0xFF  0x0F    Magic bytes
0x5F          Indicator byte Undefined
```
