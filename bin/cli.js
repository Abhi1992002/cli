#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p = __importStar(require("@clack/prompts"));
const prompts_1 = require("@clack/prompts");
const colors_1 = __importDefault(require("colors"));
const figlet_1 = __importDefault(require("figlet"));
const { execSync } = require("child_process"); // to run bash commmand from node
const createEnv_1 = require("./createEnv");
const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    }
    catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};
const intializedCli = async () => {
    // Introducation
    p.intro(`Creating a template for nextjs , stripe , prisma , next-auth and shadcn\n\n`);
    //   ASCII Art
    await figlet_1.default.text("Create Template", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
    }, await function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(data);
    });
    // Basic Project Information
    const projectInfo = await p.group({
        projectName: () => p.text({ message: "What is your project name?" }),
    }, {
        onCancel: ({ results }) => {
            p.cancel("Operation cancelled.");
            process.exit(0);
        },
    });
    const s = p.spinner();
    // cloning the github repo
    const cloneGithubRepo = async () => {
        s.start(`🎉 Clonning the repositry with name ${projectInfo.projectName}`);
        const gitCheckoutCommand = `git clone --depth 1 https://github.com/Abhi1992002/Advanced-Authentication ${projectInfo.projectName}`;
        const checkedOut = runCommand(gitCheckoutCommand);
        if (!checkedOut)
            process.exit(-1);
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
        if (!installedDeps)
            process.exit(-1);
        s.stop("🥳 Installing Completed!!");
    };
    await installDependencies();
    // Want to initialize env variable
    const envPermission = await (0, prompts_1.select)({
        message: "Want to setup environment variable?",
        options: [
            { value: "empty", label: "template .env (recommended)" },
            { value: "yes", label: "yes" },
            { value: "no", label: "No" },
        ],
    });
    // add env variables
    if (envPermission === "yes") {
        console.log(colors_1.default.yellow("\n\nIf you choose to leave any variable blank, simply press Enter without typing anything; this will create the variable with an empty value. Be aware that certain functionalities may rely on these variables \n\n"));
        const envInfo = await p.group({
            GITHUB_CLIENT_ID: () => p.text({ message: "Please enter github client id? (auth)" }),
            GITHUB_CLIENT_SECRET: () => p.text({ message: "Please enter github client secret? (auth)" }),
            GOOGLE_CLIENT_ID: () => p.text({ message: "Please enter google client id? (auth)" }),
            GOOGLE_CLIENT_SECRET: () => p.text({ message: "Please enter google client secret? (auth)" }),
            AUTH_SECRET: () => p.text({
                message: "Please enter auth secret? (use openssl rand -hex 32)",
            }),
            DATABASE_URL: () => p.text({ message: "Please enter database url? (database)" }),
            DIRECT_URL: () => p.text({
                message: "Please enter direct url of your database? (database)",
            }),
            RESEND_API_KEY: () => p.text({
                message: "please enter resend api key? (email verification)",
            }),
            STRIPE_SECRET_KEY: () => p.text({
                message: "please enter stripe secret key?",
            }),
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: () => p.text({
                message: "please enter stripe publishable key?",
            }),
            STRIPE_WEBHOOK_SECRET: () => p.text({
                message: "please enter stripe webhook secret? ",
            }),
            NEXT_PUBLIC_APP_URL: () => p.text({
                message: "please enter public app url?",
            }),
        }, {
            onCancel: ({ results }) => {
                p.cancel("Operation cancelled.");
                process.exit(0);
            },
        });
        s.start(`Creating .env file`);
        await (0, createEnv_1.createEnvFile)({
            projectName: projectInfo.projectName,
            GITHUB_CLIENT_ID: envInfo.GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET: envInfo.GITHUB_CLIENT_SECRET,
            GOOGLE_CLIENT_ID: envInfo.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: envInfo.GOOGLE_CLIENT_SECRET,
            DATABASE_URL: envInfo.DATABASE_URL,
            DIRECT_URL: envInfo.DIRECT_URL,
            RESEND_API_KEY: envInfo.RESEND_API_KEY,
            AUTH_SECRET: envInfo.AUTH_SECRET,
            STRIPE_SECRET_KEY: envInfo.STRIPE_SECRET_KEY,
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: envInfo.NEXT_PUBLIC_APP_URL,
            STRIPE_WEBHOOK_SECRET: envInfo.STRIPE_WEBHOOK_SECRET,
            NEXT_PUBLIC_APP_URL: envInfo.NEXT_PUBLIC_APP_URL,
        });
        s.stop("🥳 .env file created successfully");
    }
    if (envPermission === "empty") {
        console.log(colors_1.default.yellow("\n\nIf you choose to leave any variable blank, simply press Enter without typing anything; this will create the variable with an empty value. Be aware that certain functionalities may rely on these variables \n\n"));
        s.start(`Creating .env file`);
        await (0, createEnv_1.createEnvFile)({
            projectName: projectInfo.projectName,
            GITHUB_CLIENT_ID: undefined,
            GITHUB_CLIENT_SECRET: undefined,
            GOOGLE_CLIENT_ID: undefined,
            GOOGLE_CLIENT_SECRET: undefined,
            DATABASE_URL: undefined,
            DIRECT_URL: undefined,
            RESEND_API_KEY: undefined,
            AUTH_SECRET: undefined,
            STRIPE_SECRET_KEY: undefined,
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: undefined,
            STRIPE_WEBHOOK_SECRET: undefined,
            NEXT_PUBLIC_APP_URL: undefined,
        });
        s.stop("🥳 .env file created successfully");
    }
    const gitInitializtion = await (0, prompts_1.select)({
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
            if (!runGitCommand)
                process.exit(-1);
        };
        await initializeGit();
    }
    p.outro("🎉 Project created successfully!!");
    console.log(colors_1.default.green(`cd ${projectInfo.projectName} && npm run dev`));
};
intializedCli();
