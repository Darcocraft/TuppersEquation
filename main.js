// https://damnsoft.org/others/tupper.html

var plotCanvas = document.getElementById('tupperCanvas');
const plotCols = 106;
const plotRows = 17;
const plotScl = 15;
plotCanvas.width = plotCols * plotScl;
plotCanvas.height = plotRows * plotScl;
var plotCtx = plotCanvas.getContext('2d');

function refreshCanvas() {
  plotCtx.clearRect(0, 0, plotCanvas.width, plotCanvas.height);
  for (let x = 0; x < plotCols; x++) {
    for (let y = 0; y < plotRows; y++) {
      if (plotPixels[x][y]) {
        plotCtx.fillRect(x * plotScl, y * plotScl, plotScl, plotScl);
      }
    }
  }
  findK();
}

// Buttons
// Clear
var clearBtn = document.getElementById('clearButton');
clearBtn.addEventListener('click', clearPlot, false)

// Undo
var findKBtn = document.getElementById('undoButton');
findKBtn.addEventListener('click', undo, false);

function undo() {
  if (pplotPixels.length > 0) {
    plotPixels = copy2DArray(pplotPixels[pplotPixels.length - 1]);
    pplotPixels.splice(pplotPixels.length - 1, 1);
    refreshCanvas();
  }
}

function copy2DArray(array) {
  var copy = [];
  for (let x = 0; x < array.length; x++) {
    copy[x] = [];
    for (let y = 0; y < array[x].length; y++) {
      copy[x][y] = array[x][y];
    }
  }
  return copy;
}

function backupPlot() {
  pplotPixels.push(copy2DArray(plotPixels));
}

var ktxt = document.getElementById('kTextarea');

var copyKBtn = document.getElementById('copyKButton');
copyKBtn.addEventListener('click', copyK, false);

function copyK() {
  // Copy to Clipboard;
  ktxt.select();
  document.execCommand('copy');
  setTimeout(() => alert('K copied to Clipboard!'), 100)
}

function findK() {
  var result = bigInt(0);
  var i = 0;
  for (let x = plotCols - 1; x >= 0; x--) {
    for (let y = 0; y < plotRows; y++) {
      if (plotPixels[x][y]) {
        result = result.add(bigInt(2).pow(i));
      }
      i++
    }
  }
  result = result.multiply(17);
  ktxt.value = result;
  resizeTextArea(ktxt)
}

function getPlotFromK() {
  if (ktxt.value != '') {
    console.log("k inputed")
    var remainding = bigInt(ktxt.value).divide(17);
    var binary = '';
    while (remainding >= 2) {
      const c = remainding.divmod(2);
      remainding = c.quotient;
      binary += c.remainder.value[0]
    }
    binary += remainding;
    // Reverse String
    binary = binary.split('').reverse().join('')

    backupPlot();

    // Covert Binary to plot Pixels
    var i = binary.length - 1;
    for (let x = plotCols - 1; x >= 0; x--) {
      for (let y = 0; y < plotRows; y++) {
        plotPixels[x][y] = (binary.charAt(i) == '1');
        i--
      }
    }
    refreshCanvas();
  }
}

function resizeTextArea(elm) {
  elm.rows = 6;
}

// Invert
var invertBtn = document.getElementById('invertButton');
invertBtn.addEventListener('click', invert, false);

function invert() {
  for (let x = 0; x < plotCols; x++) {
    for (let y = 0; y < plotRows; y++) {
      plotPixels[x][y] = !plotPixels[x][y];
    }
  }
  refreshCanvas();
}

// Mouse Functions
plotCanvas.addEventListener('contextmenu', rightClick, false)
plotCanvas.addEventListener('mousedown', mouseDown, false);
plotCanvas.addEventListener('dblclick', fillSection, false);
document.addEventListener('mouseup', mouseReleased, false);
plotCanvas.addEventListener('mousemove', mouseMoved, false);

var buttonPressed = false;

function mouseMoved(event) {
  // Effectivly translates the mouse pos to be in refrence to the upper left of the canvas.
  // Then the pos is divided by the size of each scaled pixel to find the index pos of the plot pixel that the mouse is over
  if (buttonPressed !== false) {
    const pos = pixelMouseOver(event)
    // If left click it draws in black else white
    setPlotPixel(pos.x, pos.y, buttonPressed == 0);
  }
}

function rightClick(event) {
  // Disables Context Menu
  event.preventDefault();
  // Accounts for constext menu double firing
  if (buttonPressed == 2) {
    buttonPressed = false;
  } else {
    mouseDown(event)
  }
}

function mouseDown(event) {
  console.log('mouse down')
  buttonPressed = event.button
  // copies current image in pplotPixels for undo
  mouseMoved(event)
}

function mouseReleased(event) {
  if (buttonPressed != 2) {
    buttonPressed = false;
  }
}

function fillSection(event) {
  console.log('fill')
  // Removes unchanged plot state from undo stack that was created with first click in the double click
  // pplotPixels.splice(pplotPixels.length - 1, 1);
  undo();
  undo();

  const pos = pixelMouseOver(event);
  fillAround(pos.x, pos.y, !plotPixels[pos.x][pos.y]);
  refreshCanvas();

  function fillAround(x, y, val) {
    plotPixels[x][y] = val;
    if (x < plotCols - 1) {
      if (plotPixels[x + 1][y] == !val) {
        fillAround(x + 1, y, val)
      }
    }
    if (x > 0) {
      if (plotPixels[x - 1][y] == !val) {
        fillAround(x - 1, y, val)
      }
    }
    if (y < plotRows - 1) {
      if (plotPixels[x][y + 1] == !val) {
        fillAround(x, y + 1, val)
      }
    }
    if (y > 0) {
      if (plotPixels[x][y - 1] == !val) {
        fillAround(x, y - 1, val)
      }
    }
  }
}

// Keyboard Functions
document.addEventListener('keydown', logKey, false);

function logKey(event) {
  if (event.key == 'z' && event.ctrlKey) {
    undo();
  }
}

// Plot Pixels
// Init plot with tupper formula value;
/*
3238991802145102779004918071710451192763798118998169118359430370165080229025303832866077848407988641704237685068802496495121423632547030425422675136921126523901069782816896638918251979952628223862468915665406986490654107954411331891712208378993292207529748573324414252822803686643594727928835525666955188574842273764546780959470939259678418635953949336822190303762155164582600136746691038114478332890081660608043796421956901534785734738758627849922041257014803602645062002133182385968418523435225975663351860459688096234219540532957838725961034
*/
var plotPixels = [];
var pplotPixels = [];
clearPlot();
ktxt.value = '960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719'
getPlotFromK();
resizeTextArea(ktxt)
refreshCanvas();

function clearPlot() {
  for (let x = 0; x < plotCols; x++) {
    plotPixels[x] = [];
    for (let y = 0; y < plotRows; y++) {
      plotPixels[x][y] = false;
    }
  }
  refreshCanvas();
}

function pixelMouseOver(event) {
  return {
    x: Math.floor((event.clientX - plotCanvas.getBoundingClientRect().left) / plotScl),
    y: Math.floor((event.clientY - plotCanvas.getBoundingClientRect().top) / plotScl)
  }
}

function setPlotPixel(x, y, val) {
  if (x >= 0 && x < plotCols && y >= 0 && y < plotRows) {
    backupPlot();
    plotPixels[x][y] = val;
    refreshCanvas();
  }
}