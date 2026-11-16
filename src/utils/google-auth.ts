/**
 * Google Identity Services (GIS) OAuth utility.
 * Prompts the user with Google's authentic account chooser / consent dialog
 * and retrieves verified profile information (email, name, picture).
 */

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUserProfile {
  email: string;
  name: string;
  avatar?: string;
  sub: string;
}

/**
 * Loads the official Google Identity Services SDK asynchronously if not already loaded.
 */
export const loadGoogleGsiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    if (window.google?.accounts?.oauth2) {
      return resolve();
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Identity Services library.'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services library.'));
    document.head.appendChild(script);
  });
};

/**
 * Triggers Google OAuth prompt using Google Identity Services (GIS) Token Client.
 * Displays the authentic Google account selection / permission prompt,
 * and fetches the verified user profile from Google.
 */
export const triggerGoogleOAuth = (clientId: string): Promise<GoogleUserProfile> => {
  return new Promise(async (resolve, reject) => {
    if (!clientId || clientId.trim() === '') {
      return reject(
        new Error(
          'Google Client ID is missing. Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID.'
        )
      );
    }

    try {
      await loadGoogleGsiScript();

      if (!window.google?.accounts?.oauth2) {
        return reject(
          new Error(
            'Google Identity Services is not available. Please ensure third-party scripts are not blocked.'
          )
        );
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            if (tokenResponse.error === 'access_denied') {
              return reject(new Error('Google sign-in was cancelled.'));
            }
            return reject(
              new Error(
                tokenResponse.error_description ||
                  tokenResponse.error ||
                  'Google authentication failed.'
              )
            );
          }

          if (!tokenResponse.access_token) {
            return reject(new Error('No access token received from Google.'));
          }

          try {
            // Retrieve authentic user profile from Google userinfo API
            const userInfoRes = await fetch(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              }
            );

            if (!userInfoRes.ok) {
              return reject(
                new Error(
                  `Failed to retrieve Google profile: HTTP ${userInfoRes.status}`
                )
              );
            }

            const profile = await userInfoRes.json();

            if (!profile.email) {
              return reject(
                new Error('No email address provided by Google account.')
              );
            }

            resolve({
              email: profile.email,
              name: profile.name || profile.given_name || profile.email.split('@')[0],
              avatar: profile.picture,
              sub: profile.sub || profile.id || '',
            });
          } catch (err: any) {
            reject(
              new Error(
                err?.message || 'Failed to fetch verified user details from Google.'
              )
            );
          }
        },
      });

      // Launch the authentic Google account picker popup
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(err);
    }
  });
};
