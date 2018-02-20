function success(msg) {
  return $(`<div class="alert alert-success" role="alert">
              ${msg}
            </div>`);
}

function fail(msg) {
  return $(`<div class="alert alert-danger" role="alert">
              ${msg}
            </div>`);
}

export { success };
export { fail };  