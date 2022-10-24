// An event listener to submit button
const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  var image = document.getElementById("image").files[0];

  var reader = new FileReader();
  var hash;

  reader.onload = async () => {
    console.log("This is event.js");
    hash = await MD5.generate(reader.result).toString();
    console.log(hash);
    // Check cache to see if image has been processed
    try {
      const response = await fetch(`/redis?hash=${hash}`);
      const data = await response.json();
      if (data.hashExists) {
        console.log("image exists!");
      } else {
        const response = await fetch(`/s3request?name=${image.name}&hash=${hash}`);
        const data = await response.json();
        await fetch(data.s3Url, {
          method: 'PUT',
          headers: {
            'Content-Type': `${image.type}`
          },
          body: image
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  reader.readAsBinaryString(image);

  var formData = new FormData();
  formData.append("image", image);

  //md5
  //check with redis
  //true ==> s3 url, key = md5has
  //false ==> loop four link with ?=md5hash-1024x720, ?=md5-800x640....
  // const reponse = fetch('http://localhost:3000/result', {
  // method: 'POST',
  //   body: formData
  // })

  //const json =  response.json()
  //console.log(json);

  //location.href=`/result`;
});
