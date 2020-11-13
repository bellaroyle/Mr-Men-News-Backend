const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';
console.log(DB_URL)

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
    }
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
//console.log(ENV)

module.exports = { ...customConfig[ENV], ...baseConfig };
