
# select-switch

Convert select box into switch

Convert this
![](http://c.mnmly.com/LpYK/Image%202012.12.28%2012:44:30%20PM.png)

into:
![](http://c.mnmly.com/LppL/select-switch.gif)

This simply hides select box, so you can always reference to `select` element to retrieve value.

## Installation

    $ component install mnmly/select-switch


## Example

```js
var SelectSwitch = require('select-switch');

// Create the SelectSwitch with height of `50`
var selectSwitch = new SelectSwitch( $('select'), 50 );

// Return the value of selectbox
selectSwitch.value();

// Set the value of selectbox
selectSwitch.value( someOptionValue );

```

## License

  MIT
