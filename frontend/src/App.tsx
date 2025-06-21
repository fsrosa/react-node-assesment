import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import { NotificationSystem } from './components/ui/NotificationSystem';
import './index.css';

function App() {
  return (
    <DataProvider>
      <NotificationSystem>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationSystem>
    </DataProvider>
  );
}

export default App;
