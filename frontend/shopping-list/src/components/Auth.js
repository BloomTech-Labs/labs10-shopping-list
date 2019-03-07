import auth0 from 'auth0-js';

let callbackURL;

if(process.env.NODE_ENV === 'development'){
    callbackURL = `http://localhost:3000/callback`
} else if (process.NODE_ENV === 'production' || process.NODE_ENV !== 'development'){
    callbackURL = `https://labs10-shopping-list.netlify.com/callback`
}

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      audience: 'https://shoptrak.auth0.com/api/v2/',
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: `${callbackURL}`,
      responseType: 'id_token',
      scope: 'openid email profile'
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    console.log('callback URL:', callbackURL); // sanity check for callback URL
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
          // console.log('auth result', authResult)
          // console.log('profile', authResult.idTokenPayload);
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;

        // assign gathered values to localStorage for persistence in the application
        localStorage.setItem('jwt', authResult.idToken);
        localStorage.setItem('email', authResult.idTokenPayload.email);
        localStorage.setItem('name', authResult.idTokenPayload.name);
        localStorage.setItem('img_url', authResult.idTokenPayload.picture);
        localStorage.setItem('isLoggedIn', true);
    
        resolve();
      });
    })
  }

  signOut() {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;

    // clear local storage
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('jwt');
    localStorage.removeItem('img_url');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
  }
}

const auth0Client = new Auth();

export default auth0Client;