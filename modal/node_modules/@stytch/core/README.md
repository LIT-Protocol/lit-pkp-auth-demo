# Stytch Javascript SDK Core Components

## Stytch Overview

[Stytch](https://stytch.com/) is an authentication platform for developers.
Onboard, authenticate, and engage your users with Stytch’s APIs.
Improve security and user experience with flexible, passwordless authentication solutions.
Let us build the infrastructure, so you can focus on your product.

## Overview

This package provides core implementations for the Javascript SDKs - `@stytch/vanilla-js`, `@stytch/react-native`.
Application code should never refer to this package directly.

### Internals

This package contains shared types, errors, and utilities for the Stytch Javascript SDKs.

This package has two entrypoints -

```javascript
// All publicly consumed types - requests, responses, UI config, etc
export * from '@stytch/core/public'

// All internal utilities
import { logger, InternalErrorType, ... } from '@stytch/core'
```
