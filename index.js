const express = require('express')
const app = express()
const AWS = require("aws-sdk");
const s3 = new AWS.S3()


// curl -i https://some-app.cyclic.app/myFile.txt
app.get('*', async (req,res) => {
  let filename = req.path.slice(1)

  try {
    let s3File = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()

    res.set('Content-type', s3File.ContentType)
    res.send(s3File.Body.toString()).end()
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`)
      res.sendStatus(404).end()
    } else {
      console.log(error)
      res.sendStatus(500).end()
    }
  }
})


// curl -i -XPUT https://some-app.cyclic.app/myFile.txt
app.put('*', async (req,res) => {
  let filename = req.path.slice(1)

  await s3.putObject({
    Body: JSON.stringify({"now":new Date().toString()}),
    Bucket: process.env.BUCKET,
    Key: filename,
  }).promise()

  res.set('Content-type', 'text/plain')
  res.send('ok').end()
})

// curl -i -XDELETE https://some-app.cyclic.app/myFile.txt
app.delete('*', async (req,res) => {
  let filename = req.path.slice(1)

  await s3.deleteObject({
    Bucket: process.env.BUCKET,
    Key: filename,
  }).promise()

  res.set('Content-type', 'text/plain')
  res.send('ok').end()
})


// (async () => {
//   // Store something
//   await s3.putObject({
//     Body: JSON.stringify({"now":new Date().toString()}),
//     Bucket: process.env.BUCKET,
//     Key: "some_files/my_file.json",
//   }).promise()

//   // Read the file
//   let my_file = await s3.getObject({
//     Bucket: process.env.BUCKET,
//     Key: "some_files/my_file.json",
//   }).promise()

//   // Log file content
//   console.log(JSON.parse(my_file.Body.toString()))

//   let res = await s3.deleteObject({
//     Bucket: process.env.BUCKET,
//     Key: "some_files/my_file.json",
//   }).promise()

//   console.log(res)
// })()


// /////////////////////////////////////////////////////////////////////////////
// Catch all handler for all other request.
app.use('*', (req,res) => {
  res.sendStatus(404).end()
})

// /////////////////////////////////////////////////////////////////////////////
// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening at http://localhost:${port}`)
})


