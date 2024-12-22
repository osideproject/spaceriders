const t = Date.now();
let loaded, asset = false;

$(function() {
  $('#find_button').click(loadTokenAsset);
});

const loadTokenAsset = function() {
  $('.error').hide();
  const options = { method: 'GET', headers: { accept: '*/*', xApiKey: 'eee8eadf-046b-5f38-ba21-145d40ca278e' } };
  var address = '0xc9d198089d6c31d0ca5cc5b92c97a57a97bbfde2';
  var token_id = $('#token_id').val();

  url = `https://api.reservoir.tools/tokens/v7?tokens=${address}:${token_id}`;
  fetch(url)
    .then(response => response.json())
    //.then(response => setMainAsset(response['tokens'][0].token.imageLarge))
    .then(response => setMainAsset(response['tokens'][0].token.imageLarge))
    .catch(err => raiseError(err));

  $('#download_button').click(function() {
    if (loaded) {
      canvas = document.getElementById('pfp');
      downloadCanvas(canvas);
    }
  });
}

const setMainAsset = function(url) {
  console.log(url);
  asset = url.replace('width=250', 'width=2400');
  console.log(url)
  loadImage();
  loaded = true;
  $('.pfp').show();
}

const raiseError = function(err) {
  console.log(err);
  $('.error').show();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  ctx.reset();
}

const loadImage = async function() {
  canvas = await generatePfpImage();
  const dataURL = canvas.toDataURL('image/png');
  const pfp = document.getElementById('pfp');
  const ctx = pfp.getContext('2d');
  pfp.width = 500;
  pfp.height = 500;
  img = newImage(dataURL);
  await preload(dataURL)
  .then(function() {
    ctx.drawImage(
      img, 0, 0, 1000, 1000
    );
  });
}

const preload = function(src) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      resolve(src);
    }
    img.onerror = function() {
      console.error('Failed to load image: ' + src);
    }
    img.src = src;
  });
}

const generatePfpImage = async function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  var images = [newImage(asset)];

  images.push(newImage('./images/guxmas.png'));

  canvas.width = 1000;
  canvas.height = 1000;

  return Promise.all(images.map(img => new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Failed to load image: ' + img.src));
  }))).then(() => {
    images.forEach(img => {
      ctx.drawImage(
        img, 0, 0, 500, 500
      );
    });
    return canvas;
  }).catch(error => {
    console.error(error);
  });
}

const newImage = function(f) {
  const img = new Image();
  img.crossOrigin="anonymous";
  img.src = f;
  return img;
}

const downloadCanvas = function(canvas) {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'image.png';
  link.click();
}
