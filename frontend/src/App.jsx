import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';
import './index.css';
import OrganizationList from './pages/OrganizationList';
import RegisterOrganization from './pages/RegisterOrganization';

const App = () => {
  const assignMemberIds = (organizations) => {
    let idCounter = 1; // Initialize a counter for unique IDs
    organizations.forEach((org) => {
      org.teams.forEach((team) => {
        team.members.forEach((member) => {
          member.id = idCounter++; // Assign a unique ID and increment the counter
        });
      });
    });
    return organizations;
  };
  const organizationsDataWithIds = assignMemberIds([
    {
      name: "Tech Corp",
      email: "contact@techcorp.com",
      location: "San Francisco",
      teams: [
        {
          name: "Development",
          members: [{ name: "Alice" }, { name: "Bob" }],
        },
        {
          name: "Marketing",
          members: [{ name: "Charlie" }],
        },
      ],
    },
    {
      name: "Innovate Ltd.",
      email: "info@innovate.com",
      location: "New York",
      teams: [
        {
          name: "Design",
          members: [{ name: "Dave" }, { name: "Eve" }],
        },
      ],
    },
  ]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/organizations" element={<OrganizationList organizations={organizationsDataWithIds} />} />
        <Route path="/register" element={<RegisterOrganization />} />
      </Routes>
    </Router>
  );
};

export default App;
