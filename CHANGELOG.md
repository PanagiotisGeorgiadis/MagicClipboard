## [1.0.2] - 2020-27-11

### Added

- Added `KeyboardEvent` dispatchers on the `content_script` in order to mitigate for `SPAs` that depend on `event listeners` rather than `values`.

## [1.0.1] - 2020-19-11

### Added

- Added some basic error handling for us to debug

### Changed

- Improved the "get active element" functionality on the `content_script` in order to find `activeElements` inside `iframes` or `Shadow DOMs`
- Restraining the `popup` textarea `resize` to `vertical` only

## [1.0.0] - 2020-11-13

- Initial release
