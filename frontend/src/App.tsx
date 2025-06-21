import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';  
import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
