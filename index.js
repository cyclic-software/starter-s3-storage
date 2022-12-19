var express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

var AWS = require("aws-sdk");

app.post("/imageUpload", async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
    secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
    region: "eu-west-1", //Region,
    
  });

  const s3 = new AWS.S3();

  // Binary data base64
  console.log(req.files);

  const fileContent = Buffer.from(req.files.uploadedFileName.data, "binary");
  // Setting up S3 upload parameters
  const params = {
    acl: 'public-read',
    Bucket: "cyclic-nice-ruby-sea-urchin-garb-eu-west-1",
    Key: "test.jpg", // File name you want to save as  in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    res.send({
      response_code: 200,
      response_message: "Success",
      response_data: data,
    });
  });
});

const port = process.env.PORT || 3000


app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
