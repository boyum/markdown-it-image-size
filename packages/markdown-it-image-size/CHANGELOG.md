# Changelog

## [14.5.1](https://github.com/boyum/markdown-it-image-size/compare/v14.5.0...v14.5.1) (2024-12-26)

### Code Refactoring

* use original renderer to render img tags ([#768](https://github.com/boyum/markdown-it-image-size/issues/768)) ([0b556eb](https://github.com/boyum/markdown-it-image-size/commit/0b556ebe9b8e745d408499063019bd9b3dabc1bb)). Notable differences: `&` in `src` attribute will now be escaped as `&amp;` instead of `&`.

### Tests

* delete cache before we're using it again ([b843f1b](https://github.com/boyum/markdown-it-image-size/commit/b843f1b7c0cf480b28a9b70452cf039674278dba))

### Build System

* add run-script for publishing to npm ([be20f57](https://github.com/boyum/markdown-it-image-size/commit/be20f57de4bf6342817d42dd2cb40934c3746ff4))

## [14.5.0](https://github.com/boyum/markdown-it-image-size/compare/v14.4.0...v14.5.0) (2024-12-25)

### Features

* option `overwriteAttrs` ([#767](https://github.com/boyum/markdown-it-image-size/issues/767)) ([0430fb4](https://github.com/boyum/markdown-it-image-size/commit/0430fb4984258ba21cb60886d7a8fb0cbd149968))

### Documentation

* add development instructions ([151ce39](https://github.com/boyum/markdown-it-image-size/commit/151ce39f5fa2eecea64451eece310ea067a00beb))

## [14.4.0](https://github.com/boyum/markdown-it-image-size/compare/v14.3.0...v14.4.0) (2024-12-23)

### Features

* cache to file between runs ([#758](https://github.com/boyum/markdown-it-image-size/issues/758)) ([44eef2e](https://github.com/boyum/markdown-it-image-size/commit/44eef2e45e619ecb080cc41c9efc36c3c415753a))

## [14.3.0](https://github.com/boyum/markdown-it-image-size/compare/v14.2.0...v14.3.0) (2024-12-23)

### Features

* add publicDir option ([#757](https://github.com/boyum/markdown-it-image-size/issues/757)) ([1ac30c5](https://github.com/boyum/markdown-it-image-size/commit/1ac30c5ddc014652df22a47142b0c6e290b84a84))

### Styles

* use recommended settings for biome lint ([#747](https://github.com/boyum/markdown-it-image-size/issues/747)) ([d90e5ba](https://github.com/boyum/markdown-it-image-size/commit/d90e5baec91cde75971187731d8c921962882a99))

### Continuous Integration

* update workflow name ([bc703e3](https://github.com/boyum/markdown-it-image-size/commit/bc703e3788f4f0865b93d8029aa880fbd66f4474))

## [14.2.0](https://github.com/boyum/markdown-it-image-size/compare/v14.1.2...v14.2.0) (2024-11-17)

### Features

* cache output if the same image is repeated ([#741](https://github.com/boyum/markdown-it-image-size/issues/741)) ([3bee935](https://github.com/boyum/markdown-it-image-size/commit/3bee935591022469f013afce9c92030b91f2b6a2))

## [14.1.2](https://github.com/boyum/markdown-it-image-size/compare/v14.1.1...v14.1.2) (2024-11-15)

### Documentation

* add readme to npm package ([163a5ba](https://github.com/boyum/markdown-it-image-size/commit/163a5ba575ca445a92eaa941d7b0a498c5784cf1))

### Styles

* Biome ignore generated files ([888c619](https://github.com/boyum/markdown-it-image-size/commit/888c619b09a5784fb974a0722166b78dc8c514cb))

### Continuous Integration

* add rw permissions to create prs ([cc4b629](https://github.com/boyum/markdown-it-image-size/commit/cc4b629e012e856afd9da16c545f83da94ebfa85))

## [14.1.1](https://github.com/boyum/markdown-it-image-size/compare/v14.1.0...v14.1.1) (2024-06-18)


### Styles

* replace prettier and eslint with biome ([#617](https://github.com/boyum/markdown-it-image-size/issues/617)) ([9948c09](https://github.com/boyum/markdown-it-image-size/commit/9948c09c67ef6d805e34d70610bca5c5dadd226d))


### Build System

* upgrade turbo to v2 ([#616](https://github.com/boyum/markdown-it-image-size/issues/616)) ([24a2c77](https://github.com/boyum/markdown-it-image-size/commit/24a2c776c99478e80df556317439ae30d96b382c))

## [14.1.0](https://github.com/boyum/markdown-it-image-size/compare/v14.0.1...v14.1.0) (2023-12-29)


### Features

* update image-size, add support for HEIF, HEIC and AVIF ([7f2d463](https://github.com/boyum/markdown-it-image-size/commit/7f2d463004e2d1363d7120382ef7e9a295d6cd59))


### Documentation

* link to markdown-it ([6c43ba5](https://github.com/boyum/markdown-it-image-size/commit/6c43ba5744ce84a1182aebf392f7f8b38afd4600))


### Tests

* use vitest ([#426](https://github.com/boyum/markdown-it-image-size/issues/426)) ([61025e8](https://github.com/boyum/markdown-it-image-size/commit/61025e8f6f8952b644158b0c90b01c4c669c6bb6))


### Build System

* move `@vitest/coverage-v8` to correct package ([4b1a934](https://github.com/boyum/markdown-it-image-size/commit/4b1a934b6bfef78e4eaacdc85797e97f9363358e))


### Continuous Integration

* automatically create pr if there are changes to dist ([#427](https://github.com/boyum/markdown-it-image-size/issues/427)) ([fcdfa0e](https://github.com/boyum/markdown-it-image-size/commit/fcdfa0ebbbdb2f11f83eb93f630799a87c368dcb))
* update test coverage after push to main ([#425](https://github.com/boyum/markdown-it-image-size/issues/425)) ([3c8fb7a](https://github.com/boyum/markdown-it-image-size/commit/3c8fb7a3a35e2d418e032ac9882cb15bd7908886))

## [14.0.1](https://github.com/boyum/markdown-it-image-size/compare/v14.0.0...v14.0.1) (2023-12-11)


### Tests

* increase coverage ([#424](https://github.com/boyum/markdown-it-image-size/issues/424)) ([77c1a42](https://github.com/boyum/markdown-it-image-size/commit/77c1a42f9969c4866a4e61d623ce8fbb62f91d77))


### Build System

* use tsup, add more tests ([#423](https://github.com/boyum/markdown-it-image-size/issues/423)) ([efb7693](https://github.com/boyum/markdown-it-image-size/commit/efb7693b99f7426192d3bae1b29506afae7b26fe))

## [14.0.0](https://github.com/boyum/markdown-it-image-size/compare/v13.3.3...v14.0.0) (2023-12-11)

### Build System

- change structure to monorepo ([#415](https://github.com/boyum/markdown-it-image-size/issues/415)) ([a7ab2b8](https://github.com/boyum/markdown-it-image-size/commit/a7ab2b8b612f350d367f2c04fd3180d58266b083))
- release with `release-it` instead of `np` ([b358908](https://github.com/boyum/markdown-it-image-size/commit/b358908d8f98be8cbd0f1f2a015961aed5c1ca91))
- release with `release-it` instead of `np` ([e3ee838](https://github.com/boyum/markdown-it-image-size/commit/e3ee838b298f6c52641f45eb2fd4c56168083c9c))
