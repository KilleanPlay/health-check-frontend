import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css"; // Özel font için bu dosyada font-face tanımı yapacaksın

function App() {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect && window.VANTA) {
            const effect = window.VANTA.WAVES({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x0d6efd,
                shininess: 50,
                waveHeight: 20,
                waveSpeed: 1.0,
                zoom: 1.0,
            });
            setVantaEffect(effect);
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const checkHealth = async () => {
        if (!url) {
            setStatus("Lütfen kontrol etmek için bir URL girin.");
            return;
        }

        setLoading(true);
        setStatus("");

        try {
            const response = await fetch("http://localhost:5000/api/healthcheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: url }),
            });

            const data = await response.json();

            if (data.isSuccess) {
                setStatus(`✅ Başarılı! Durum Kodu: ${data.statusCode}`);
            } else {
                setStatus(`❌ Başarısız. Mesaj: ${data.message || "Bilinmeyen hata"}`);
            }
        } catch (error) {
            setStatus("❌ API çağrısı başarısız: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={vantaRef}
            className="d-flex justify-content-center align-items-center flex-column min-vh-100 text-white text-center"
        >
            <motion.h1
                className="display-3 fw-bold mb-4"
                style={{ fontFamily: "Foobar Pro, sans-serif" }}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Health Check Pro
            </motion.h1>

            <motion.div
                className="w-100 px-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.input
                    className="form-control mt-3 mx-auto fs-5 py-3 px-4 shadow"
                    style={{ maxWidth: "500px", borderRadius: "1rem" }}
                    type="text"
                    placeholder="Kontrol edilecek URL'yi girin"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                />

                <motion.button
                    className="btn btn-warning mt-4 px-5 py-3 fs-5 rounded-pill shadow"
                    onClick={checkHealth}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    {loading ? "Checking..." : "Check"}
                </motion.button>

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            key="loader"
                            className="d-flex justify-content-center align-items-center mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    border: "4px solid #fff",
                                    borderTop: "4px solid transparent",
                                    borderRadius: "50%",
                                }}
                            ></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {status && !loading && (
                        <motion.div
                            className="alert alert-light mt-4 fw-semibold fs-5 mx-auto"
                            style={{ maxWidth: "600px", borderRadius: "1rem" }}
                            role="alert"
                            key="status"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                        >
                            {status}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default App;
