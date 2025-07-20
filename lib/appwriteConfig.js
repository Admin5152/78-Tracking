// appwriteConfig.js
import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // e.g. 'https://cloud.appwrite.io/v1'
  .setProject('683f5658000ba43c36cd'); // Replace with your Appwrite project ID

const account = new Account(client);

const DB_ID = '687859ea000c5d56e145'; // replace this




export { client, account };
