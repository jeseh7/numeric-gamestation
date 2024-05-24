// initializeDatabase.js

import { supabase } from "./supabase";


export const createTable = async () => {
  try {
    await supabase
      .from('attempts')
      .create({
        tableName: 'attempts',
        ifNotExists: true,
        schema: {
          username: 'TEXT PRIMARY KEY',
          attempts: 'TEXT'
        }
      });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error.message);
  }
};
