# KBGB

_Seth Meyers\: Stefon, do you have any recommendations for us for this weekend?_

_Stefon: Yes yes yes yes yes...this weekend, New York's hottest club is KBGB. It's like CBGB, but for JavaScript nerds instead of punk rockers. It's a keyboard utility for people who haven't done enough googling to find a better one._

# Usage

This library is mainly meant for games, so we assume there is a render function of some kind called in a loop.

```JavaScript

const kbgb = new KBGB()

function render(args) {
    // first call flush to update the keyboard state since the last iteration
    kbgb.flush()

    // now, the current state of the keyboard can be queried
    if (kbgb.isDown('ArrowLeft')) {
        // do something
    }

    // ...
} 
```