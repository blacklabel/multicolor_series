# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.0](https://github.com/blacklabel/multicolor_series/pull/48) (2025-01-07)

### Bug fixes

* Resolved a compatibility issue with with Highcharts v12.0.0+, which prevented the module from working properly.

### Upgrade notes

* Imports are now retrieved from global Highcharts object.

### [3.0.0](https://github.com/blacklabel/multicolor_series/pull/44) (2024-11-18)

### Features

* Refactored to Typescript-compatible version.
* Removed unused, legacy code related to the old Highcharts versions.
* Added snapshot testing for both coloredline/coloredarea series.