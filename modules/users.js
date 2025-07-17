// function MIMIMI() {
// 	while(1)
// 		console.log('MIMIMI');
// };


function mimimi(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { mimimi };


