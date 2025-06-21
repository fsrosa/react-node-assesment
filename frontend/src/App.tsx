import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { DataProvider } from './context';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';  
import Tasks from './pages/Tasks';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
