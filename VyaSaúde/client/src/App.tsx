import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
	return (
		<Router>
			<AppRoutes />
			<ToastContainer />
		</Router>
	);
}
