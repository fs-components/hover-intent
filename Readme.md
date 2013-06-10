
# hoverintent

[jquery.hoverIntent](http://cherne.net/brian/resources/jquery.hoverIntent.html) ported to component land

hoverIntent is similar to jQuery's built-in "hover" method except that
instead of firing the handlerIn function immediately, hoverIntent checks
to see if the user's mouse has slowed down (beneath the sensitivity
threshold) before firing the event. The handlerOut function is only
called after a matching handlerIn.

## Installation

    $ component install fs-components/hoverintent

## API

### basic usage
```js
hoverIntent( element, handlerIn, handlerOut )
hoverIntent( element, handlerInOut )
```

### using a basic configuration object
```js
hoverIntent( element, config )
```

## License

  MIT
