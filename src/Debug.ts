import { screen, box } from 'blessed';

// Create a screen object.
const screen2 = screen({
  smartCSR: true,
});

screen2.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
const box2 = box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello {bold}terminal{/bold}!',
  tags: true,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0',
    },
    hover: {
      bg: 'green',
    },
  },
});

// Append our box to the screen.
screen2.append(box2);

// Add a png icon to the box
// var icon = blessed.image({
//   parent: box,
//   top: 0,
//   left: 0,
//   type: 'overlay',
//   width: 'shrink',
//   height: 'shrink',
//   file: __dirname + '/my-program-icon.png',
//   search: false
// });

// If our box is clicked, change the content.
box2.on('click', function (data) {
  box2.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
  screen2.render();
});

// If box is focused, handle `enter`/`return` and give us some more content.
box2.key('enter', function (ch, key) {
  box2.setContent(
    '{right}Even different {black-fg}content{/black-fg}.{/right}\n',
  );
  box2.setLine(1, 'bar');
  box2.insertLine(1, 'foo');
  screen2.render();
});

// Quit on Escape, q, or Control-C.
screen2.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

// Focus our element.
box2.focus();

// Render the screen.
screen2.render();
