import { google } from 'googleapis';
import secret from '../../client_secret.json';

const oauth2Client = new google.auth.OAuth2(
	secret.web.client_id,
	secret.web.client_secret,
	secret.web.redirect_uris[0],
)

const scopes = [
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

export const authorizationUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  /** Pass in the scopes array defined above.
    * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
  scope: scopes,
  // Enable incremental authorization. Recommended as a best practice.
  include_granted_scopes: true
});

export default function Login() {
	return (
		<h3>Hello World</h3>
	)
}