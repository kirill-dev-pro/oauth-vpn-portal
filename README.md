[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkirill-dev-pro%2Foauth-vpn-portal)

# OAuth VPN Portal

A Next.js application that provides OAuth-based authentication for Marzban VPN service. This portal automatically creates new VPN subscriptions for authenticated users through OAuth. After loging in users will see your subscription template from your marzban server.

## Features

- OAuth-based authentication using BetterAuth
- Automatic VPN subscription creation for authenticated users
- Modern UI built with Next.js and Tailwind CSS
- PostgreSQL database integration for user management
- Secure configuration management
- TypeScript support

## Screenshots

### Login Page
![Login Page](public/screenshots/login_page.png)

### Main Page
![Main Page](public/screenshots/main_page.png)

## Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database 
- Marzban VPN server instance

## Installation

1. Clone the repository:

2. Install dependencies:
```bash
bun i
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - `BETTER_AUTH_SECRET`: Secret key for auth. It is recomenended to generate new random string with `openssl rand -hex 32`
     - `DATABASE_URL`: PostgreSQL connection string
     - `OPENID_CLIENT_ID`: Your OAuth client ID
     - `OPENID_CLIENT_SECRET`: Your OAuth client secret
     - `OPENID_DISCOVERY_URL`: Well-known OpenID configuration URL
     - `MARZBAN_API_URL`: API URL of your Marzban VPN server. Usually the same as `NEXT_PUBLIC_MARZBAN_INSTANCE_URL`
     - `MARZBAN_USERNAME`: Marzban admin username
     - `MARZBAN_PASSWORD`: Marzban admin password
     - `NEXT_PUBLIC_LOGIN_BUTTON_TEXT`: Custom text for the login button
     - `NEXT_PUBLIC_MARZBAN_INSTANCE_URL`: Optional. Public URL of your Marzban instance. Without trailing slash.
     - `NEXT_PUBLIC_PAGE_TITLE`: Title of the portal page

4. Migrate the database
```bash
bunx @better-auth/cli migrate
```

## Database

Optional, by default app will save authenticated users in `users-db.sqlite` db on the disk. You can have voulume for this file.

If you want you can have a PostgreSQL database running somewhere to store logined users. You can run free postgres on https://neon.tech/, it will be enought.

## Development

Start the development server:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun start
```

## Docker

```
docker run demostar/oauth-vpn-portal
```

## Vercel

Easiest deployment methed is just pushing it to vercel.com. You can clone this repo and use `vercel deploy` cli or you can use this button bellow to fork repo and create vercel integration
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkirill-dev-pro%2Foauth-vpn-portal)

You can create free database with Neon for app. It will provide DATABASE_URL env var automatically in the vercel.

You will need to specify environment variables. You can copy this snippet to code editor, fill with actual data, and then copy and paste to vercel all together

```
NEXT_PUBLIC_APP_URL=
BETTER_AUTH_SECRET=
# OAuth provider details
OPENID_CLIENT_ID=
OPENID_CLIENT_SECRET=
OPENID_DISCOVERY_URL=
PANEL_API_URL=
PANEL_TYPE=remnawave # OR marzban
# Optional traffic limit for each new user. From 0.001 to 1000000
PANEL_USER_TRAFFIC_LIMIT_GB=100
# Remanwave API
REMNAWAVE_API_KEY=
# OR Marzban API
MARZBAN_USERNAME=
MARZBAN_PASSWORD=
# UI
NEXT_PUBLIC_LOGIN_BUTTON_TEXT=
NEXT_PUBLIC_PAGE_TITLE=
```

The easiest way to create your OAuth provider and manage users — [klaud.me](https://klaud.me). You can create a free group, invite people and those people will be authorized to access this app. You will need to create new OAuth app integration for your group and copy `OPENID_CLIENT_ID`, `OPENID_CLIENT_SECRET` and `OPENID_DISCOVERY_URL` from there.

## License

This project is licensed under the MIT License - see the LICENSE file for details.