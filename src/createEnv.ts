const fs = require("fs");
const path = require("path");

// Define the path for the .env file

export const createEnvFile = async ({
  projectName,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  AUTH_SECRET,
  DATABASE_URL,
  DIRECT_URL,
  RESEND_API_KEY,
}: {
  projectName: string;
  GITHUB_CLIENT_ID: string | undefined;
  GITHUB_CLIENT_SECRET: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  AUTH_SECRET: string | undefined;
  DATABASE_URL: string | undefined;
  DIRECT_URL: string | undefined;
  RESEND_API_KEY: string | undefined;
}) => {
  try {
    const envFilePath = path.join(process.cwd(), `/${projectName}/.env`);

    console.log(envFilePath);

    // Define the content you want to write to the .env file
    const envContent = `
# authorization
GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID ? GITHUB_CLIENT_ID : ""}"
GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET ? GITHUB_CLIENT_SECRET : ""}"

GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID : ""}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET ? GOOGLE_CLIENT_SECRET : ""}"

AUTH_SECRET="${AUTH_SECRET ? AUTH_SECRET : ""}"

# Database
DATABASE_URL="${DATABASE_URL ? DATABASE_URL : ""}"
DIRECT_URL="${DIRECT_URL ? DIRECT_URL : ""}"

# Resend
RESEND_API_KEY="${RESEND_API_KEY ? RESEND_API_KEY : ""}"
`;

    // Write the content to the .env file, creating or overwriting it as necessary
    fs.writeFileSync(envFilePath, envContent);
  } catch (error) {
    console.error(error);
  }
};
