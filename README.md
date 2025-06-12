# SMPClient SDK

SMPClient SDK is a powerful TypeScript library for managing application and user authentication in a distributed system. It integrates with a GraphQL API and manages token lifecycles for both applications and users, supporting token refresh, scheduled refreshes, and secure local storage of credentials.

## Features

- Application and user authentication using GraphQL.
- Automatic token refresh for both application and user tokens.
- Token storage in local storage, cookies, or in-memory (configurable).
- Support for refresh token rotation and scheduling of token refresh before expiration.
- Integration with WebSocket for real-time notifications and updates (optional).
- Rate limiting for requests (optional).
- Easy to configure for B2B, B2C, or B2B2C platforms.

## Installation

You can install the SMPClient SDK using npm or yarn:

```bash
npm install smp-sdk-ts
```

or

```bash
yarn add smp-sdk-ts
```

## Getting Started

### 1. Initialize SMPClient

To use the SDK, you need to initialize the `SMPClient` with the application ID, secret, and configuration options.

```typescript
import { SMPClient } from 'smpclient-sdk';

const smpClient = new SMPClient({
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  appRefreshDuration: 3600,   // in seconds
  userRefreshDuration: 1800,  // in seconds
  storage: new AuthTokenStorage(),  // or implement your own TokenStorage
});
```

### 2. Application Token Initialization

Before making any requests, the application needs to authenticate and retrieve an access token.

```typescript
async function initApp() {
  try {
    await smpClient.authenticateApp();
    console.log('App token initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize app token:', error);
  }
}

initApp();
```

### 3. User Authentication

To authenticate a user, use the `loginUser` method with the user's email and password. This will retrieve an access token and a refresh token for the user, and automatically schedule token refresh before expiration.

```typescript
async function loginUser(email: string, password: string) {
  try {
    await smpClient.authenticateUser(email, password);
    console.log('User logged in successfully!');
  } catch (error) {
    console.error('User login failed:', error);
  }
}

loginUser('user@example.com', 'password123');
```

### 4. Access Token Management

The SDK will automatically refresh tokens, but you can manually retrieve the current access token using the following method:

```typescript
async function getAccessToken() {
  const accessToken = await smpClient.getAccessToken();
  console.log('Current Access Token:', accessToken);
}

getAccessToken();
```

### 5. User Logout

To log out the user and clear all tokens from storage, use the `logout` method:

```typescript
async function logoutUser(userId: string) {
  try {
    await smpClient.logout(userId);
    console.log('User logged out successfully!');
  } catch (error) {
    console.error('User logout failed:', error);
  }
}

logoutUser('user-id-123');
```

## Token Refreshing and Scheduling

The SDK handles the automatic refreshing of tokens before they expire. You can configure the refresh duration for both application and user tokens during the initialization of `SMPClient`. 

The `scheduleTokenRefresh` method is called internally by the SDK to ensure that the tokens are refreshed at the appropriate time.

### Example of a scheduled token refresh:

```typescript
smpClient.scheduleTokenRefresh(300, 'user');  // Refreshes the user token 300 seconds before it expires
```

## Configuration

The `SMPClient` constructor accepts the following configuration options:

| Option               | Type               | Description                                                                                |
|----------------------|--------------------|--------------------------------------------------------------------------------------------|
| `appId`              | `string`           | The application ID provided by the backend                                                 |
| `appSecret`          | `string`           | The application secret provided by the backend                                             |
| `appRefreshDuration` | `number`           | Time (in seconds) before the app's access token should be refreshed                        |
| `userRefreshDuration`| `number`           | Time (in seconds) before the user's access token should be refreshed                       |
| `storage`            | `TokenStorage`     | A token storage implementation (e.g., LocalStorageTokenStorage, CookieTokenStorage, etc.)  |

### Token Storage Example

You can use the provided `LocalStorageTokenStorage` implementation, or you can implement your own storage mechanism by following the `TokenStorage` interface.

Example using local storage:

```typescript
class LocalStorageTokenStorage implements TokenStorage {
  private accessTokenKey = 'smp_access_token';
  private refreshTokenKey = 'smp_refresh_token';

  saveAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
```

## GraphQL API Integration

The SDK works by interacting with a GraphQL backend. The following GraphQL mutations are required:

1. **`login(emailUser: String, passwordUser: String)`**:
   - Used for user authentication, returns an `accessToken` and `refreshToken`.

2. **`refreshUserToken(refreshUserToken: String)`**:
   - Used to refresh the user’s token when it is close to expiration.

3. **`refreshAppToken(refreshAppToken: String)`**:
   - Used to refresh the application’s token when it is close to expiration.

4. **`logout(userID: String)`**:
   - Used to log out the user and clear the session.

## Rate Limiting (Optional)

You can implement rate limiting on top of the SDK if needed. To do so, ensure that you track the number of requests and adjust accordingly to avoid hitting API limits.

## WebSocket Notifications (Optional)

The SMPClient SDK can be extended to support WebSocket notifications using GraphQL subscriptions. You can integrate real-time notifications from the GraphQL backend by setting up a WebSocket connection and managing events through the SDK.

## Contributing

If you'd like to contribute to the development of SMPClient, please open an issue or submit a pull request.

## License

This SDK is licensed under the MIT License.
