'use server'

import Airtable from "airtable";

export const reportError = async (e: string) => {
  console.log("reporting error")
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY, endpointUrl: process.env.AIRTABLE_ENDPOINT_URL }).base('appTeNFYcUiYfGcR6');

  base('non_user_in_slack').create([
    {
      "fields": {
        'error': e
      }
    },
  ], function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
  });
}