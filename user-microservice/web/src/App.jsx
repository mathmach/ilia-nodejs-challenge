import { Auth, API } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [screen, setScreen] = useState('signup');

  // Get the current logged in user info
  const getUser = async () => {
    const user = await Auth.currentUserInfo();
    if (user) setUser(user);
    setLoading(false);
  };

  // Logout the authenticated user
  const signOut = async () => {
    await Auth.signOut();
    setUser(null);
  };

  // Send an API call to the /wallets endpoint.
  const walletsRequest = async () => {
    try {
      const response = await API.get('api', '/wallets');
      setWallets(response);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  // Send an API call to the /wallet endpoint with authentication details.
  const walletRequest = async () => {
    try {
      const response = await API.get('api', '/wallet', {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
        queryStringParameters: {
          userID: user.username,
        },
      });
      setWallets(response);
    } catch (error) {
      alert(error);
    }
  };

  const createWalletRequest = async (e) => {
    try {
      e.preventDefault();

      const fd = new FormData(e.currentTarget);
      const value = Number(fd.get('value').toString());

      if (!isNaN(value) && value != 0) {
        e.currentTarget.reset();
        const response = await API.post('api', '/wallet', {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          },
          body: { value },
        });
        setWallets([...wallets, response]);
        alert('Created');
      } else {
        alert('Invalid number!');
      }
    } catch (error) {
      alert(error);
    }
  };

  // Check if there's any user on mount
  useEffect(() => {
    getUser();
  }, []);

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>SST + Cognito + React</h2>
      {user ? (
        <div className="profile">
          <p>Welcome {user.attributes.given_name}!</p>
          <p>{user.attributes.email}</p>
          <button onClick={signOut}>logout</button>
        </div>
      ) : (
        <div>
          {screen === 'signup' ? (
            <Signup setScreen={setScreen} />
          ) : (
            <Login setScreen={setScreen} setUser={setUser} />
          )}
        </div>
      )}
      <div className="api-section">
        {user ? <button onClick={walletRequest}>Get my wallet</button> : null}
        <button onClick={walletsRequest}>Get all wallets</button>
      </div>
      {user ? (
        <form onSubmit={createWalletRequest}>
          <input type="number" name="value" placeholder="Value" />
          <button type="submit">Save</button>
        </form>
      ) : null}

      <table>
        <tr>
          <th>Value</th>
          <th>Time</th>
        </tr>
        {wallets.map((wallet) => (
          <tr key={wallet.id}>
            <td>{wallet.value}</td>
            <td>({wallet.created})</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default App;
