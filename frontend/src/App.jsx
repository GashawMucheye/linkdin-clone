import React from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Define your routes here */}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn />} />
      </Routes>
    </Layout>
  );
}

export default App;
