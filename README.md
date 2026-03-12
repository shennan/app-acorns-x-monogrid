Built with VendOS App Builder™

## Setup VendOS

Clone VendOS Apps adjacent to the VendOS App:

```
$ git clone git@github.com:vendOS-io/vendos-apps.git
```

Switch to latest branch:

```
$ cd vendos-apps && gco v-0.1.0
```

Install VendOS Apps:

```
$ yarn install
```

## Setup VendOS JS (if this is your first time)

Clone VendOS and take not of its' location according to this VendOS App:

```
$ git clone git@github.com:vendOS-io/vendos.git
```

Switch to latest branch:

```
$ cd vendos-apps && gco v1.0.0
```

Install VendOS Apps:

```
$ yarn install
```

Make sure all packages are built:

```
$ yarn workspace @vendos/core build
```
```
$ yarn workspace @vendos/app-components build
```
```
$ yarn workspace @vendos/js build
```

Make sure VendOS App Components (a child package of the VendOS monorepo) is linked:

```
$ yarn workspace @vendos/app-components link
```

Make sure VendOS JS (a child package of the VendOS monorepo) is linked:

```
$ yarn workspace @vendos/js link
```

## Now this VendOS App

Navigate to this VendOS App.

Make sure that the `@vendos/app-components` and `@vendos/js` dependencies in `package.json` link to the correct place where those exist on the file-system.

> **Note**
>
> When Apps are built they assume that the VendOS monorepo resides `../../vendos-io/` folder relative to the VendOS App. If this isn't the case you need to

Now install dependencies:

```
$ yarn install
```

With the VendOS App Components and VendOS JS packages linked, everything should work together and be able to be built and run locally:

```
$ yarn start

OR

$ yarn build
```

## VendOS DevTools

DevTools is constantly being updated. To make sure you have the latest, make sure you build it.

In the VendOS repo:

```
$ yarn workspace @vendos/devtools build
```