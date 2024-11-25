fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android buildRelease

```sh
[bundle exec] fastlane android buildRelease
```



### android build

```sh
[bundle exec] fastlane android build
```

Build and upload a new version to the Google Play with selected track

### android upload

```sh
[bundle exec] fastlane android upload
```



### android distribute

```sh
[bundle exec] fastlane android distribute
```

Deploy a new version to the Firebase App Distribution

### android beta

```sh
[bundle exec] fastlane android beta
```

Deploy a new beta version to the Google Play

### android alpha

```sh
[bundle exec] fastlane android alpha
```

Deploy a new alpha version to the Google Play

### android internal

```sh
[bundle exec] fastlane android internal
```

Deploy a new internal version to the Google Play

### android production

```sh
[bundle exec] fastlane android production
```

Deploy a new version to the Google Play

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
