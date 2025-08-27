import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default "/" → redirect to /customers */}
        <Route path="/" element={<Navigate to="/customers" replace />} />

        {/* customers page */}
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
