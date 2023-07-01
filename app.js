const express = require("express")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing")
require('dotenv').config()
// const { dirname } = require("path")


const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/signup.html`)
})

mailchimp.setConfig({
  apiKey: process.env.KEY,
  server: "us11"
})

app.post("/", function (req, res) {
  // console.log(req.body)
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email
  const listId = "75da8665dc"
  console.log(firstName + lastName + email)

  const run = async () => {
    const response = await mailchimp.lists.batchListMembers(listId, {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    });
    console.log(response)
    res.sendFile(`${__dirname}/success.html`)
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }

  run().catch(e => res.sendFile(`${__dirname}/failure.html`));
})

app.post("/failure", function (req, res) {
  res.redirect(`/`)
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port 3000")
})

// api key
// 6b0c40888766c6fe75d8bf9ee69befdb-us11
// us11

//list id
// 75da8665dc