# select-switch

Convert select box into switch.
No need to move around your cursor :)

☞ [Demo]

![](http://c.mnmly.com/LpYK/Image%202012.12.28%2012:44:30%20PM.png) ![](http://c.mnmly.com/LppL/select-switch.gif)

This simply hides selectbox, so you can always reference to `select` element to retrieve value.

[Demo]: http://mnmly.github.com/select-switch/

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

(The MIT License)

Copyright (c) 2012 Hiroaki Yamane &lt;i.am@mnmly.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
