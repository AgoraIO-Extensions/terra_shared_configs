## terra_shared_configs

Shared configs of `terra` across the AgoraIO-Extensions's projects.

## Custom header checks

`OverrideNodeParser` checks custom headers before applying overrides. Native-only
generators such as Iris can run the exported `ValidateCustomHeadersParser` after
`CXXParser`, passing the same `includeHeaderDirs`. It reuses the Native AST and
reads the adjacent `custom_headers/*.h`; it does not run another C++ parse.

- A hashed `@iris_api_id` absent from the Native API IDs stops generation with
  the custom filename and invalid ID. The hash uses the existing Iris parameter
  type fingerprint, not a new signature parser.
- Native overloads without a custom selection produce a review warning. Neither
  overloads nor custom files are changed automatically.
- Unhashed IDs can refer to handwritten Iris adapters and are not rejected.
  This check does not prove return types, defaults, custom type validity or
  runtime semantics, and does not inspect released Iris binaries.

The check runs during generation. It does not prevent the separate header-sync
workflow from committing changes before generation starts.

## License

The project is under the MIT license.
