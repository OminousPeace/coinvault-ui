# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c9ad58d7-e1dd-45e9-a384-a308c31d9a2a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c9ad58d7-e1dd-45e9-a384-a308c31d9a2a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c9ad58d7-e1dd-45e9-a384-a308c31d9a2a) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Where can i find all the doce that use smart contracts (for dev to verify)?

I'll provide you with a list of all the code files that interact with smart contracts and their dependencies.

1. src/utils/contractHelpers.ts
This is the primary file that handles direct interactions with the Ethereum smart contracts.

Dependencies:

ethers library (version 5.7.2)
Functions:

getVaultContract - Creates contract instance
getVaultMetadata - Gets vault information
getUserVaultData - Gets user vault data
depositToVault - Handles deposits
withdrawFromVault - Handles withdrawals
approveVault - Handles token approvals
2. src/context/Web3Context.tsx
This context manages the web3 connection state and provides smart contract data to the rest of the application.

Dependencies:

react
ethers
sonner (for toast notifications)
@/utils/contractHelpers (imports contract interaction functions)
Functions:

connect - Connects to web3 wallet
disconnect - Disconnects wallet
refreshVaultData - Updates contract data
3. src/components/ConnectWalletButton.tsx
This component provides UI for connecting to the wallet.

Dependencies:

react
@/components/ui/button
@/context/Web3Context (uses wallet connection functions)
lucide-react (for Wallet icon)
4. src/components/DepositForm.tsx
This component handles the deposit form UI and interacts with the smart contract for deposits.

Dependencies:

react
@/components/ui/slider
@/components/ui/button
@/components/ui/popover
TokenLogo and InfoTooltip components
lucide-react icons
sonner (for toast notifications)
@/context/Web3Context (for web3 connection)
@/utils/contractHelpers (for deposit function)
5. src/pages/Index.tsx
The main page that displays vault information and contains the deposit form.

Dependencies:

react
@/components/VaultHeader
@/components/ui/tabs
@/components/StatCard
@/components/DepositForm
@/components/InfoTooltip
@/components/ConnectWalletButton
sonner (for toast notifications)
@/context/Web3Context (for web3 and contract data)
6. src/App.tsx
The root component that wraps the application with the Web3Provider.

Dependencies:

Various UI components
@tanstack/react-query
react-router-dom
@/context/Web3Context (provides web3 connection to the app)
Summary of Smart Contract Integration Flow
Web3Context provides the connection state and methods
contractHelpers.ts contains the actual contract interaction code
User-facing components like ConnectWalletButton and DepositForm use the context
The main page (Index.tsx) displays contract data and contains the deposit form
All these components work together to create a complete smart contract integration that allows users to connect their wallets, view vault data, and make deposits.
