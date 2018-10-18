# Peatio Development Auth Service

AuthZ dummy server for Peatio development environment.

## Usage

Install dependencies:
```shell
yarn
```

Start the auth server:
```shell
yarn start
```

To use AuthZ with Peatio, make sure you have the right public key in `config/application.yml`.

## TODO

1. Move the JWT generator to a separated file.
2. Add jest tests for auth.
