import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import Clients from "./pages/Clients.jsx";
import ContractGenerator from "./pages/ContractGenerator.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmailTemplates from "./pages/EmailTemplates.jsx";
import ExportCenter from "./pages/ExportCenter.jsx";
import InvoiceGenerator from "./pages/InvoiceGenerator.jsx";
import Projects from "./pages/Projects.jsx";
import ProposalGenerator from "./pages/ProposalGenerator.jsx";
import Upgrade from "./pages/Upgrade.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="projects" element={<Projects />} />
        <Route path="proposal" element={<ProposalGenerator />} />
        <Route path="invoice" element={<InvoiceGenerator />} />
        <Route path="contract" element={<ContractGenerator />} />
        <Route path="email-templates" element={<EmailTemplates />} />
        <Route path="export-center" element={<ExportCenter />} />
        <Route path="upgrade" element={<Upgrade />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
