# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2022-12-08

### Added

- Add basic integration for XMCyber that handle auth verification, paginated
  requests and rate limit
- Ingest new entity `xmcyber_entity`

## [1.1.0] - 2023-01-12

### Added

- Ingest new entity `xmcyber_account`
- Added relationship `xmcyber_account_has_entity`

## [1.2.0] - 2023-01-13

### Added

- Add new github action to automate the deployment of the released version in
  the integration-deployments repo.
