# Explanation

Idk why I am doing this. But this "guide" shows how to serialize js values into
their v8 binary representation and how to deserialize the v8 binary
representation back to a js value used by the [V8 Engine](https://v8.dev).

## General Format

The format always starts with 2 header bytes `0xFF 0x0F` Then it will use a
indicator byte to tell the deserializer on how to deserialize the next section
of bytes. None of the format examples include the 2 header bytes but these are
needed at the beginning of the serialized data. The reference serializers and
deserializers don't include these bytes. But the `serialize` and `deserialize`
api's in `references/mod.ts` do add these bytes

## Primitive Types

Primitive values are the following values:

- [string](#string-formats)
- [integers](#integer-format)
- [float](#float-format)
- [bigint](#bigint-format)
- [boolean](#boolean-format)
- [null](#null-format)
- [undefined](#undefined-format)

Null is also included in this list eventho they're technically objects. The
difference between a primitive and a object is for example how they're passed as
function argument. It is handy to know the difference because objects have a few
quirks that primitives don't. But we'll get into that later in the
[Object Types](#object-types) section.

### String Formats

V8 has 3 types of strings. `Utf8String`, `OneByteString` and `TwoByteString`.
The first one I have no idea what it is used for.

The One byte string is the most common one and is used in places where every
character in the string is part of the extended ascii table (0x00 up to 0xFF)

The Two Byte string is used for characters that need 2 bytes to be represented.
This would include character sets like arabic and emoji's

All format's all start with a type indicator and then a varint encoded length
and then the raw data

#### Utf8 String Format

Seems to only be used internally. (maybe found with JIT compiled functions.
Needs triage)

#### One Byte String Format

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

#### Two Byte String Format

Two byte strings start off with a `c` (0x63) to indicate the two byte string
datatype. Then uses a LEB128 encoded varint to indicate the length of the raw
data of the string and then the raw data.

This format is used for when we have characters that need to be represented as
multiple bytes. Like emoji's or non-latin languages like arabic

serializing `Hi!😃`

```
0xFF  0x0F    Magic bytes
0x63  0x0A    String indicator byte and varint encoded length
0x48  0x00    H (UTF-8 characters don't need a second byte. Therefore null byte)
0x69  0x00    i
0x21  0x00    !
0x3D  0xD8    =Ø (these 4 bytes are the emoji)
0x03  0xDE    0x03 Þ
```

### Integer Format

V8 has 2 integer formats one is unsigned integer and the other one signed. It
appears that usually signed integers are used even when unsigned integers can be
used.

I am not entirely sure when unsigned integers are used. Not only is this a small
quirk but due to the max value of a varint we don't get the full i32 range to
work with. But rather a range of `-1_073_741_824` (inclusive) up to
`1_073_741_823` (inclusive) Outside of this range the float format will be used!

#### Signed Integer Format

The integer format of v8 is quite simple but confusing at first. It uses varint
encoding for all signed integers. If you have ever worked with varint then you
know that this is not possible with varint. So to avoid this trouble we first
zigzag encode integers and then we encode it into a varint.

some examples

Negative Integer -12

```
0xFF  0x0F    Magic bytes
0x49  0x17    Indicator byte then zigzag encoded + varint encoded value
```

Positive Integer 12

```
0xFF  0x0F    Magic bytes
0x49  0x18    Indicator byte then zigzag encoded + varint encoded value
```

#### Unsigned Integer Format

Eventho I have not found out where v8 uses this. It is essentially the same as
the signed int format but a different indicator byte `U` (0x) and the value does
not get zig-zag encoded unlike the signed integers.\
Do note that this format is not compatible with the Signed integer format
because positive integers in that format also get zigzag encoded.

(this still needs a example once I know where v8 uses this format (selfnote:
Might be found when using JIT compiled functions. Needs triage))

### BigInt Format

The bigint format does not have multiple variants and only has one. It has a
indicator byte which is `Z` (0x5A) and after that a varint bitfield specifying
how many u64 integers are used for the bigint and if the value is positive or
negative. It is alot more complex than either a float or integer because it has
a unknown size

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

### Float Format

The float format is like the integer format, quite easy to understand. It's a
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

### Boolean Format

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

### Null Format

The null format is effectively the same as the boolean format. Just that the
indicator byte changed to `0` (0x30).

```
0xFF  0x0F    Magic bytes
0x30          Indicator byte Null
```

### Undefined Format

Let's repeat the easiest format once again. For `undefined` the format is still
the same as null and booleans but the byte changed once again to `_` (0x5F)

```
0xFF  0x0F    Magic bytes
0x5F          Indicator byte Undefined
```

## Referable Types

Referable types are a lot more complex than meets the eye. It looks fairly
simple until you realise that javascript is a quirky language that allows things
like associative arrays and arrays where there are empty elements or referencing
a object in itself creating recursive references. This makes (de)serializing
referable types a lot more complex than a simple primitive. For external use of
the v8 format the following referable types work with it.

- [Object References](#object-references)
- [Array](#array)
- Object literals
- User created classes
- ArrayBuffer
- Uint*Array (where * is 8, 16, 32 or 64)
- Int*Array (where * is 8, 16, 32 or 64)
- Map
- Set
- Date
- Regex
- Error

These do not work outside of v8 or v8 bindings due to them serializing into a ID
that v8 holds the value for.

- SharedArrayBuffer (not usable outside v8)
- WebAssembly.Module (not usable outside v8)
- WebAssembly.Memory (not usable outside v8)

### Object References

Object's are used for complex data structures. But it would be a waste of space
and time to serialize the exact same object multiple time. This is what a object
reference is used for. It is indicated by `^` (0x5E)and the best way to explain
how a reference works is with a example. So let's say we got a object with 2
keys and their value is the same object literal like here below

```ts
const innerObject = {};

const object = {
  key1: innerObject,
  key2: innerObject,
};
```

Then what happens is that `object` get's serialized as key value pairs. `key1`
will be serialized as a string and the value here as a empty object. Then `key2`
will also be serialized as a string but it's value will be serialized as a
reference to a object serialized earlier. Do note that this is only for this
specific example because both values reference the same object. If the object
has 2 identical objects like 2x `{}` then it will not use a reference because
they're not the same object but rather 2 individuals that have the same inner
values and structure.

### Array

Arrays are a lot more complex than meets the eye. They can do quite a few quirky
things like indexing then with strings `myArray["HelloWorld"] = 12;`. But they
also allow empty slots. An empty slot is unique. It's not filled with anything
like `null` or `undefined` (it does map to undefined) but there is nothing.
Which we need to keep in mind when (de)serializing an array. We effectively got
4 types of arrays to keep in mind (you could argue that there are 5. Which is
only a associated array without any regular slots. But this would be the same as
a dense associated array)

1. Dense Array (all allocated slots are occupied)
2. Sparse Array (some allocated slots are not used)
3. Dense Associated Array (all allocated slots are occupied & some values are
   indexed by strings)
4. Sparse Associated Array (some allocated slots are not used & some values are
   indexed by strings)

Dense Array `[null, null]`

```
0xFF  0x0F    Magic bytes
0x41  0x02    Indicator byte + varint encoded array length
0x30  0x30    null null
0x24  0x00    Ending byte + varint encoded kv pair length
0x02          Varint encoded slot count (array length)
```

Sparse Array `[null, ,null]`

```
0xFF  0x0F    Magic bytes
0x61  0x03    Indicator byte + varint encoded array length
0x49  0x00    Integer indicator byte + varint encoded index
0x30  0x49    null + Integer indicator byte
0x04  0x30    varint encoded index + null
0x40  0x02    Ending byte + varint encoded kv pairs length
0x03          Varint encoded slot count (array length)
```

Dense Associated Array `const arr = [null, null]; arr["k"] = null;`

```
0xFF  0x0F    Magic bytes
0x41  0x02    Indicator byte + varint encoded array length
0x30  0x30    null null
0x22  0x01    string indicator byte + varint encoded string length
0x6B  0x30    key "k" + null
0x24  0x01    Ending byte + varint encoded kv pair length
0x02          Varint encoded slot count (array length)
```

Sparse Array `const arr = [null, ,null]; arr["k"] = null;`

```
0xFF  0x0F    Magic bytes
0x61  0x03    Indicator byte + varint encoded array length
0x49  0x00    Integer indicator byte + varint encoded index
0x30  0x49    null + Integer indicator byte
0x04  0x30    varint encoded index + null
0x22  0x01    string indicator byte + varint encoded string length
0x6B  0x30    key "k" + null
0x40  0x03    Ending byte + varint encoded kv pairs length
0x03          Varint encoded slot count (array length)
```
