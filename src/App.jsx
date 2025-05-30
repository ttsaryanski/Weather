import { ErrorProvider } from "./contexts/ErrorContext";

import Weather from "./components/Weather";
import Footer from "./components/Footer";

import "./App.css";

function App() {
    return (
        <ErrorProvider>
            <main>
                <Weather />

                <Footer />
            </main>
        </ErrorProvider>
    );
}

export default App;
