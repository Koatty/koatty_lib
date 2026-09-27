# Changelog

## 1.6.0

### Minor Changes

- Phase B security hardening (koatty-hardening-and-ai-evolution-plan.md, ADR-101/102/103). Fail-closed defaults with a `security.legacyDefaults: true` rollback switch; see docs/migration/4.3.0.md for the full migration guide.

  Highlights:

  - SecurityProfile (strict/standard/development) exposed read-only as `app.security`, with a startup summary and per-item WARN when rolling back
  - body parsing failures return 400/413/415 instead of silently producing `{}`; body size limit follows the security profile (1mb in production)
  - DTO validation whitelist on by default (strict profile rejects unknown fields); `__proto__`/`constructor` keys never reach DTO instances
  - AOP aspect failures abort the business method unless opted out via `{ onError: 'log' }` or `app.security.aop.onAspectError`
  - After/AfterEach aspects receive the business result via `options.result`
  - GraphQL: profile-driven playground/introspection/depth limits, built-in depth rule, optional complexity package fails startup when configured but missing, CDN-free GraphiQL
  - uploads: profile-driven maxFiles/maxFields/maxFieldsSize, keepExtensions defaults off, array-aware temp cleanup, new `safeFilename` export
  - ops endpoints: minimal liveness body, /ready 503 while draining, /metrics behind the exposeMetrics policy (loopback/RFC1918/allowCidrs/token), Prometheus bound to 127.0.0.1, rateLimit middleware wired (default off)
  - request IDs validated (`[A-Za-z0-9._:-]{1,128}`), query fallback disabled, structured access logs, topology service header opt-in
  - WebSocket: profile maxPayload, perMessageDeflate off, Origin check, connection limits, error-message redaction, slow-consumer guard, timer cleanup on destroy
  - TLS minVersion TLSv1.2 by default; TypeORM production logs errors only with sensitive-parameter redaction; Swagger disabled in production by default
  - defect fixes: escapeHtml (&-escaping, valid entities), ReDoS-safe isNumberString, plugin run() executes once, bootstrap failures propagate, Redis default port 6379, gRPC ListServices, koatty_cli bin (CJS build), RedLocker.resetInstance, config() write loss, CLI sandbox + `apply` dry-run by default

## 1.5.0

### Minor Changes

- build
- build

## 1.4.9

### Patch Changes

- build

## 1.4.8

### Patch Changes

- build

## 1.4.7

### Patch Changes

- build

## 1.4.6

### Patch Changes

- patch version bump for koatty, koatty_cacheable, koatty_config, koatty_container, koatty_core, koatty_exception, koatty_graphql, koatty_lib, koatty_loader, koatty_logger, koatty_proto, koatty_router, koatty_schedule, koatty_serve, koatty_store, koatty_trace, koatty_typeorm, koatty_validation

## 1.4.5

### Patch Changes

- build

## 1.4.4

### Patch Changes

- build

## 1.4.3

### Patch Changes

- build

## 1.4.2

### Patch Changes

- Test changeset for version management system optimization

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.1](https://github.com/koatty/koatty_lib/compare/v1.4.0...v1.4.1) (2025-03-15)

## [1.4.0](https://github.com/koatty/koatty_lib/compare/v1.3.4...v1.4.0) (2024-11-05)

### Bug Fixes

- script ([e7a1aee](https://github.com/koatty/koatty_lib/commit/e7a1aee47924a233357ea8f4193d3ef63f761d52))

### [1.3.4](https://github.com/koatty/koatty_lib/compare/v1.3.3...v1.3.4) (2023-08-17)

### Bug Fixes

- deprecated fs.rmdir ([f33734c](https://github.com/koatty/koatty_lib/commit/f33734cbe837d4a5e88e8b734dc1389324f2e221))

### [1.3.3](https://github.com/koatty/koatty_lib/compare/v1.3.2...v1.3.3) (2023-07-22)

### [1.3.2](https://github.com/koatty/koatty_lib/compare/v1.3.0...v1.3.2) (2023-02-26)

### [1.3.1](https://github.com/koatty/koatty_lib/compare/v1.3.0...v1.3.1) (2023-02-26)

## [1.3.0](https://github.com/koatty/koatty_lib/compare/v1.2.12...v1.3.0) (2023-01-09)

### [1.2.12](https://github.com/koatty/koatty_lib/compare/v1.2.10...v1.2.12) (2022-07-27)

### [1.2.10](https://github.com/koatty/koatty_lib/compare/v1.2.8...v1.2.10) (2022-02-15)

### [1.2.8](https://github.com/koatty/koatty_lib/compare/v1.2.6...v1.2.8) (2021-12-15)

### [1.2.6](https://github.com/koatty/koatty_lib/compare/v1.2.5...v1.2.6) (2021-07-07)

### [1.2.5](https://github.com/koatty/koatty_lib/compare/v1.2.4...v1.2.5) (2021-06-22)

### 1.2.4 (2021-06-21)
