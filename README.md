# connection-middleware

> Get connection rules based on document download time.

Web performance is an important aspect of caring for the end-user. It is important to have your application progressively enhance based on the connection abilities of your end-user. Connection middleware returns an HTML document with an IIFE that will get a rough guess at the connection speed and assign content rules to the window. In addition, the completion of the function will fire a `siteready` event.

## Install

```
$ yarn add connection-middleware
``` 

## Usage

```js
const polka = require('polka');
const connectionMiddleware = require('connection-middleware');

const someHtml = require('./some/html');

polka()
    .use(connectionMiddleware())
    .get('/', (req, res) => {
      res.render(someHtml);
    })
    .listen(8080);
```

## API

### connectionMiddleware([options])

Returns a Node middleware function which assigns a [render](#render) method to the `response` interface.

#### options

##### ads

Type: `'3g' | true`

Default: `false`

Ads suck, especially when they are driven by 3rd-parties. By default ads are turned off on all connection types, with the lowest connection type that will allow addes being 3G.
When `true`, only 4G will allow ads to load.

[But what about my ad revenue?](#but-what-about-my-ad-revenue)

##### adTracking

Type: `'3g' | true`

Default `false`

Letting ad companies float random trackers around your site is border-line irresponsible, but if you insist, we'll only let you do that on 3G and 4G. The lowest connection type that will allow ad-tracking is 3G, with 4G being the default when `true`.

##### analytics

Type: `'2g' | '3g' | '4g' | false`

Default: 3g & 4g `true`; et al `false`

Analytics can be super useful (though I highly recommend something like [Simple Analytics](https://simpleanalytics.com/) because letting an ad company do all your analytics seems like a really bad idea). So we allow them as low as 2G, but use them wisely. If you're doing anything beyond basic page visit tracking I recommend lumping that in with adTracking. 

##### hdVideo

Type: `boolean`

Default: `true`

HD Video's are sweet, but we only allow them at 4G, for obvious reasons. If you think it's better for your users to not pull HD content, or your video content isn't super important, you can disable it. 

##### js 

Type: `boolean`

JavaScript is awesome, but it can readily bloat your site and harm your user all in an effort to make a developer's life a little bit easier. If you want to use the same content code in multiple contexts (like [text.npr.org](https://text.npr.org)) you may want to disable all JavaScript.  

### render(html)

An HTML document that includes at least a valid `<head>` section and a valid `<body>` section.

### Window.serverConnection

When the page loads the IIFE will fire, assigning server connection settings to the window based on the browser connection and the options you provided to the server.

#### Slow 2G

```
{
    ads: false,
    audio: false,
    css: false,
    img: false,
    js: false,
    tracking: false,
    video: false,
}
```

#### 2G

```
{
    ads: false,
    audio: false,
    css: {
    type: 'enhanced'
    },
    img: {
    resolution: 'sd',
    fileTypes: ['lossy'],
    },
    js: {
    type: 'enhanced',
    },
    tracking: {
    analytics: true,
    ads: false,
    },
    video: false,
}
```

#### 3G

```
{
    ads: false,
    css: {
        type: 'enhanced'
    },
    img: {
        resolution: 'hd',
        fileTypes: ['lossy', 'lossless', 'animated'],
    },
    js: {
        type: 'app',
    },
    tracking: {
        analytics: true,
        ads: false,
    },
    video: {
        resolution: 'sd'
    },
}
```

#### 4G

```
{
    ads: false,
    css: {
        type: 'app'
    },
    img: {
        resolution: 'hd',
        fileTypes: ['lossy', 'lossless', 'animated'],
    },
    js: {
        type: 'app',
    },
    tracking: {
        analytics: true,
        ads: false,
    },
    video: {
        resolution: 'hd'
    },
}
```
