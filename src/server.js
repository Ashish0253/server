const express = require("express");
const cors = require("cors");
const fetch = require("cross-fetch");
// import fetch from "node-fetch";

const serverless = require("serverless-http");

const app = express();
const router = express.Router();

app.use(express.json());

app.use(cors());

app.use("/.netlify/functions/server", router);

// app.listen(5000, () => {
//   console.log("Server started on port 5000");
// });

router.get("/", (req, res) => {
  res.status(203).send("Server is running");
});

//ye wala code h
router.post("/yelp", express.json(), (req, res) => {
  const term = req.body.term;
  const location = req.body.location;
  const sortBy = req.body.sortBy;

  async function apiCall() {
    res.json(await search(term, location, sortBy));
  }

  apiCall();
});

//Yelp API-key
const apiKey =
  "AjzyRB-KQX6Lzeag34sMpxMEwNMkkWjYC5VfQaBlmOQvcbB_0E9g1YQq92hmGrC16W9ouG9_zMJIA-LZ3BG07h3Up3jZQ9M62ArA_YjCEzLkJTK6T6gDAOcX_BEOY3Yx";

async function search(term, location, sortBy) {
  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  if (response.ok) {
    const jsonResponse = await response.json();

    if (jsonResponse.businesses) {
      const yelpResponse = jsonResponse.businesses.map((business) => {
        return {
          id: business.id,
          imageSrc: business.image_url,
          name: business.name,
          address: business.location.address1,
          city: business.location.city,
          state: business.location.state,
          zipCode: business.location.zip_code,
          category: business.categories[0].title,
          rating: business.rating,
          reviewCount: business.review_count,
        };
      });

      // console.log(yelpResponse);
      return {
        statusCode: 203,
        headers: {
          "Content-Type": "application/json",
        },
        body: yelpResponse,
      };
    }
  }
}

module.exports = app;
module.exports.handler = serverless(app);
