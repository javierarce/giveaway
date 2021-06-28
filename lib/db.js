'use strict'
require('dotenv').config()
const compromise = require('compromise')

const fs = require('fs')
const fetch = require('node-fetch')

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_ENDPOINT = process.env.AIRTABLE_ENDPOINT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME

class DB {
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

  getAirTableURL (query = '', tableName = AIRTABLE_TABLE_NAME) {
    return `${AIRTABLE_ENDPOINT}/v0/${AIRTABLE_BASE_ID}/${tableName}${query}`
  }

  getAirTableHeaders () {
    return {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': "application/json"
    }
  }

  getAll () {
    return new Promise((resolve, reject) => {

      let URL = this.getAirTableURL()
      const headers = this.getAirTableHeaders()

      URL = URL+`?sort%5B0%5D%5Bfield%5D=updated_at&sort%5B0%5D%5Bdirection%5D=desc`

      fetch(URL, { headers })
        .then(res => res.json())
        .then((json) => {
          if (json.error) {
            return reject({ error: true, ...json.error })
          }
          console.log(json.records)
          resolve(json.records.map(r => r.fields))
        }).catch((error) => {
          reject({ error: true , message: `Error: getting records: ${error}` })
        })
    })
  }

  getFieldByUsername (username, tableName = AIRTABLE_TABLE_NAME) {
    return new Promise((resolve, reject) => {

      const URL = this.getAirTableURL(`?filterByFormula={username}='${username}'&maxRecords=1`, tableName)
      const headers = this.getAirTableHeaders()

      fetch(URL, { headers })
        .then(res => res.json())
        .then((json) => {
          resolve(json.records[0])
        }).catch((error) => {
          reject({ error: true , message: `Error: getting record ${id}` })
        })
    })
  }

 findOrCreate ({ twitterID, username, displayName, profileImage }) {
    return new Promise(async (resolve, reject) => {

      let record = await this.getFieldByUsername(username)

      if (record) {
        return resolve(record.fields)
      }

      const headers = this.getAirTableHeaders()

      let body = JSON.stringify({ fields: { twitterID, username, displayName, profileImage }, typecast: true })

      fetch(this.getAirTableURL(), { method: 'POST', headers, body })
        .then(res => res.json())
        .then((response) => {
          resolve(response.fields)
        }).catch((error) => {
          reject({ error: true , message: error })
        })
    })
  }
}

module.exports = new DB()
