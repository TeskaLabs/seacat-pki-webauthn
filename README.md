# FIDO2/Authn Component for TeskaLabs SeaCat PKI

A React-based web component that provides FIDO2/WebAuthn authentication for _TeskaLabs SeaCat PKI_.
This component allows secure authorization of configured actions using biometric authentication, security keys, or other FIDO2-compatible authenticators.

## Features

- **FIDO2/WebAuthn Support**: Secure authentication using biometrics, security keys, or other FIDO2-compatible devices
- **Multi-tenant Support**: Configurable tenant-based authentication
- **Authorization Flow**: Secure authorization of specific actions within _TeskaLabs SeaCat PKI_
- **Modern React**: Built with React 19 and modern JavaScript features
- **JSON Data Display**: Built-in JSON editor for viewing authorization data
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Clean, modern UI that works across devices

## Prerequisites

- Node.js 18+ 
- `pnpm` package manager
- Modern browser with WebAuthn support (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd seacat-pki-auth-webui
```

2. Install dependencies:
```bash
pnpm install
```

## Development

### Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Linting
```bash
pnpm lint
```

## Usage

### URL Parameters

The component expects the following URL parameters:

- `authid` (required): 64-character hexadecimal authorization ID
- `tenant` (required): 2-64 character alphanumeric tenant identifier
- `next` (optional): URL to redirect to after successful authorization

### Example URL
```
https://fido2.example.com/?authid=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef&tenant=mytenant&next=https://app.example.com/success
```

### Authentication Flow

1. **Authorization Request**: User accesses the component with valid `authid` and `tenant` parameters
2. **Data Display**: Authorization data is fetched and displayed in a JSON editor
3. **FIDO2 Challenge**: User clicks "Authorize" to initiate FIDO2 authentication
4. **Credential Verification**: Browser prompts for FIDO2 authenticator (biometric, security key, etc.)
5. **Authorization**: Credential is verified and authorization is completed
6. **Redirect**: User is redirected to the `next` URL if provided

## API Integration

### Embedding in Other Applications

To integrate this component into other web applications:

1. **Build the component**:
```bash
pnpm build
```

2. **Include the built files** in your application

3. **Navigate to the component** with required parameters:
```javascript
const authUrl = `/auth-component/?authid=${authid}&tenant=${tenant}&next=${encodeURIComponent(nextUrl)}`;
window.location.href = authUrl;
```

### CORS Configuration

Ensure your TeskaLabs SeaCat PKI backend allows CORS requests from your application domain.


### Key Dependencies

- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and development server
- **json-edit-react**: JSON editor component for data display
- **ESLint**: Code linting and formatting

### Customization

#### Styling
Modify `src/index.css` for global styles or add component-specific styles in `App.jsx`.

#### Error Messages
Customize error messages in the `App.jsx` component's error handling sections.

#### API Endpoints
Update API endpoint URLs in `App.jsx` to match your TeskaLabs SeaCat PKI configuration.


## Troubleshooting

### Common Issues

1. **"Invalid authorization" error**
   - Ensure `authid` is exactly 64 hexadecimal characters
   - Check that the authorization hasn't expired

2. **"Invalid tenant" error**
   - Ensure `tenant` is 2-64 alphanumeric characters (including `-` and `_`)

3. **FIDO2 authentication fails**
   - Verify browser supports WebAuthn
   - Check that FIDO2 authenticator is properly configured
   - Ensure HTTPS is used in production (WebAuthn requires secure context)

4. **API errors**
   - Verify SeaCat PKI backend is running and accessible
   - Check CORS configuration
   - Ensure API endpoints are correctly configured


### Browser Compatibility

- **Chrome**: Full WebAuthn support
- **Firefox**: Full WebAuthn support
- **Safari**: Full WebAuthn support (macOS 10.15+, iOS 13.3+)
- **Edge**: Full WebAuthn support


## License

BSD 3-Clause License, (C) TeskaLabs Ltd.


## Support

For support and questions, contact us at [support@teskalabs.com](mailto:support@teskalabs.com).
