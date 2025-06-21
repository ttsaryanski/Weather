import { Route, Routes } from "react-router";

import { ReqDataProvider } from "./contexts/ReqDataContext";
import { ErrorProvider } from "./contexts/ErrorContext";

import Weather from "./components/Weather";
import CurrentDayDetails from "./components/CurrentDayDetails";
import ForecastDetails from "./components/ForecastDetails";
import Footer from "./components/Footer";

import "./App.css";

function App() {
    return (
        <ErrorProvider>
            <ReqDataProvider>
                <main>
                    <Routes>
                        <Route path="/" element={<Weather />} />

                        <Route
                            path="/currentDay/:dt"
                            element={<CurrentDayDetails />}
                        />

                        <Route
                            path="/forecast/:dt"
                            element={<ForecastDetails />}
                        />
                    </Routes>
                    <Footer />
                </main>
            </ReqDataProvider>
        </ErrorProvider>
    );
}

export default App;
