# Explanation

Idk why I am doing this. But this "guide" shows how to serialize js values into
their v8 binary representation and how to deserialize the v8 binary
representation back to a js value used by the (V8 Engine)[https://v8.dev]

## General Format

The format always starts with 2 header bytes `0xFF 0x0F` Then it will use a
indicator byte to tell the deserializer on how to deserialize the next section
of bytes. All format examples include the 2 header bytes but these are only
needed at the beginning of the whole serialized data, not per format. The
reference serializers and deserializers don't include these bytes and only have
to be checked to be valid.

## String Formats

V8 has 3 types of strings. `Utf8String`, `OneByteString` and `TwoByteString`.
The first one I have no idea what it is used for.

The One byte string is the most common one and is used in places where every
character in the string is part of the extended ascii table (0x00 up to 0xFF)

The Two Byte string is used for characters that need 2 bytes to be represented.
This would include character sets like arabic and emoji's

All format's all start with a type indicator and then a varint encoded length
and then the raw data

### Utf8 String Format

I have not looked into this yet.

### One Byte String Format

One byte strings start off with a `"` (0x22) to indicate the string datatype.
Then uses a LEB128 encoded varint to indicate the length of the raw data of the
string and then the raw data.

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

### Two Byte String Format

Two byte strings start off with a `c` (0x63) to indicate the two byte string
datatype. Then uses a LEB128 encoded varint to indicate the length of the raw
data of the string and then the raw data.

This format is used for when we have characters that need to be represented as
multiple bytes. Like emoji's or non-latin languages like arabic

(this still needs a example)

## Integer Format

V8 has 2 integer formats one is unsigned integer and the other one signed. It
appears that usually signed integers are used even when unsigned integers can be
used.

I am not entirely sure when unsigned integers are used. Not only is this a small
quirk but due to the max value of a varint we don't get the full i32 range to
work with. But rather a range of `-1_073_741_824` (inclusive) up to
`1_073_741_823` (inclusive) Outside of this range the float format will be used!

### Signed Integer Format

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

### Unsigned Integer Format

Eventho I have not found out how this works. It is essentially the same as the
signed int format but a different indicator byte `U` (0x) and the value does not
get zig-zag encoded like the signed int's do

(this still needs a example)

## BigInt Format

The bigint format does not have multiple variants and only has one. It has a
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

The float format is like the bigint format quite easy to understand. It's a
little bit simpler because we don't deal with a variable size of bytes. The
float format is by far the easiest one to understand. You only have an indicator
byte `N` (0x4E) and then the float value as 64 bit float (or double)

```
0xFF  0x0F    Magic bytes
0x4E  0x00    Indicator byte and first byte of the 64 bit float
0x00  0x00    bytes of the float(12.69)
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
