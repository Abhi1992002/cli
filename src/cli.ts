#!/usr/bin/env node

import * as p from "@clack/prompts";
import { select } from "@clack/prompts";
import colors from "colors";
import figlet from "figlet";
const { execSync } = require("child_process"); // to run bash commmand from node
import { createEnvFile } from "./createEnv";

const runCommand = (command: string) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const intializedCli = async () => {
  // Introducation
  p.intro(
    `Creating a template for nextjs , stripe , prisma , next-auth and shadcn\n\n`
  );

  //   ASCII Art
  await figlet.text(
    "Create Template",
    {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    await function(err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );

  // Basic Project Information
  const projectInfo = await p.group(
    {
      projectName: () => p.text({ message: "What is your project name?" }),
    },
    {
      onCancel: ({ results }) => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  const s = p.spinner();

  // cloning the github repo
  const cloneGithubRepo = async () => {
    s.start(`🎉 Clonning the repositry with name ${projectInfo.projectName}`);
    const gitCheckoutCommand = `git clone --depth 1 https://github.com/Abhi1992002/Advanced-Authentication ${projectInfo.projectName}`;
    const checkedOut = runCommand(gitCheckoutCommand);
    if (!checkedOut) process.exit(-1);
    s.stop("🎊 Clonning Completed!!");
  };
  await cloneGithubRepo();

  //asking package manager
  const packageManager = await p.select({
    message: "Choose a Package manager",
    options: [
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "bun", label: "bun" },
    ],
  });

  //   Installing Dependencies
  const installDependencies = async () => {
    s.start(`Installing dependencies for ${projectInfo.projectName}`);
    const installDepsCommands = `cd ${projectInfo.projectName} && ${packageManager} install`;
    const installedDeps = runCommand(installDepsCommands);
    if (!installedDeps) process.exit(-1);
    s.stop("🥳 Installing Completed!!");
  };
  await installDependencies();

  // Want to initialize env variable
  const envPermission = await select({
    message: "Want to setup environment variable?",
    options: [
      { value: "empty", label: "template .env (recommended)" },
      { value: "yes", label: "yes" },
      { value: "no", label: "No" },
    ],
  });

  // add env variables
  if (envPermission === "yes") {
    console.log(
      colors.yellow(
        "\n\nIf you choose to leave any variable blank, simply press Enter without typing anything; this will create the variable with an empty value. Be aware that certain functionalities may rely on these variables \n\n"
      )
    );

    const envInfo = await p.group(
      {
        GITHUB_CLIENT_ID: () =>
          p.text({ message: "Please enter github client id? (auth)" }),
        GITHUB_CLIENT_SECRET: () =>
          p.text({ message: "Please enter github client secret? (auth)" }),
        GOOGLE_CLIENT_ID: () =>
          p.text({ message: "Please enter google client id? (auth)" }),
        GOOGLE_CLIENT_SECRET: () =>
          p.text({ message: "Please enter google client secret? (auth)" }),
        AUTH_SECRET: () =>
          p.text({
            message: "Please enter auth secret? (use openssl rand -hex 32)",
          }),
        DATABASE_URL: () =>
          p.text({ message: "Please enter database url? (database)" }),
        DIRECT_URL: () =>
          p.text({
            message: "Please enter direct url of your database? (database)",
          }),
        RESEND_API_KEY: () =>
          p.text({
            message: "please enter resend api key? (email verification)",
          }),
      },
      {
        onCancel: ({ results }) => {
          p.cancel("Operation cancelled.");
          process.exit(0);
        },
      }
    );

    s.start(`Creating .env file`);
    await createEnvFile({
      projectName: projectInfo.projectName,
      GITHUB_CLIENT_ID: envInfo.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: envInfo.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: envInfo.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: envInfo.GOOGLE_CLIENT_SECRET,
      DATABASE_URL: envInfo.DATABASE_URL,
      DIRECT_URL: envInfo.DIRECT_URL,
      RESEND_API_KEY: envInfo.RESEND_API_KEY,
      AUTH_SECRET: envInfo.AUTH_SECRET,
    });
    s.stop("🥳 .env file created successfully");
  }
  if (envPermission === "empty") {
    console.log(
      colors.yellow(
        "\n\nIf you choose to leave any variable blank, simply press Enter without typing anything; this will create the variable with an empty value. Be aware that certain functionalities may rely on these variables \n\n"
      )
    );

    s.start(`Creating .env file`);
    await createEnvFile({
      projectName: projectInfo.projectName,
      GITHUB_CLIENT_ID: undefined,
      GITHUB_CLIENT_SECRET: undefined,
      GOOGLE_CLIENT_ID: undefined,
      GOOGLE_CLIENT_SECRET: undefined,
      DATABASE_URL: undefined,
      DIRECT_URL: undefined,
      RESEND_API_KEY: undefined,
      AUTH_SECRET: undefined,
    });
    s.stop("🥳 .env file created successfully");
  }

  const gitInitializtion = await select({
    message: "Want to Initialize git",
    options: [
      { value: "yes", label: "yes" },
      { value: "no", label: "No" },
    ],
  });

  if (gitInitializtion === "yes") {
    const initializeGit = async () => {
      const gitInitialzationCommand = `git init`;
      const runGitCommand = runCommand(gitInitialzationCommand);
      if (!runGitCommand) process.exit(-1);
    };

    await initializeGit();
  }

  p.outro("🎉 Project created successfully!!");
  console.log(colors.green(`cd ${projectInfo.projectName} && npm run dev`));
};

intializedCli();
