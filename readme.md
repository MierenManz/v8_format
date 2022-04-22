# Explaination

Idk why I am doing this. But this "guide" explains the v8 internal binary format
used by the (V8 Engine)[https://v8.dev]

## General Format

The format always starts with 2 magic bytes `0xFF 0x0F` Then it will use a
indicator byte to tell the deserializer on how to deserialize the next section
of bytes.

| Datatype       | Indicator |
| -------------- | --------- |
| string         | " (0x21)  |
| Int            | I (0x49)  |
| Float          | N (0x4E)  |
| Null           | 0 (0x30)  |
| Undefined      | _ (0x5F)  |
| Array          | A (0x41)  |
| Object Literal | { (0x7B)  |

Note to self. Add binary data like Uint8Array aswell

## String Format

Each string starts off with a `"` (0x21) to indicate the string datatype. Then
uses a LEB128 encoded varint to indicate the length of the data of the string.
Then the string data comes in.

serializing a string like `HelloWorld` this will look like this.

```
0xFF  0x0F    Magic bytes
0x21  0x0A    String indicator byte and varint encoded length
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
