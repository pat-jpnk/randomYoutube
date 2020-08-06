"use strict"

const fetch = require('node-fetch');

 /**
   * Generate a random Id
   * @returns {string}
  **/
 const generateId = () => {
   let id = ""
   const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"

   for(let i = 0; i < 11; i++) {
     let index = Math.floor((Math.random() * 63) + 1)
     id = id + alphabet[index]
   }
   return id;
 }

/**
 * Check if the video exists
 * @param {string} data
 * @returns {string|null} result
 */
const checkResponse = (data) => {
   const regex = /"playabilityStatus":\{"status":"ERROR"/
   return data.match(regex);
}

/**
 * Send request for url
 * @param {string} id
 * @returns {string|Promise<T>} response
 */
 const getUrl = async (id) => {
   // let v_id = "MZJ0GI8fo4Q" -> valid Id
   let url = "https://youtube.com/watch?v=" + id

   const response = await fetch(url)
       .then((res) => {
         return res.text()
       }).then((data) => {
         if(checkResponse((data)) === null) {
           return "Success: " + url;
         }else {
           return "Failure: " + url;
         }
       }).catch((error) => {
           throw new Error(error.message);
       });

   return response;
}

/**
 * Try a million random Id's
 * (a million request from a single client
    are not possible due to rate-limiting)
 * @returns {string}
 */
const run = async () => {
  let counter = 0
  let successes = 0
  for(let j = 1000000; j > 0; j++) {
      try {
          await getUrl(generateId()).then((res) => {
              if(res.includes("Success")) {
                successes++
              }
              console.log(res + " counter: " + counter + " successes: " + successes)
          })
        } catch (e) {
          console.log("Error:", e.message);
          break;
      }
      counter++
  }
}


run();
