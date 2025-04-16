'use client'

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

export default function Home() {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState("");
  const [formData, setFormData] = useState({ id: "", name: "", username: "" });
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (route) {
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: route,
        dotsOptions: {
          color: "#4267b2",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#e9ebee",
        },
      });

      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = "";
        qrCode.append(qrCodeRef.current);
      }
    }
  }, [route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Employee registered successfully!");
      } else {
        alert(data.error || "Failed to register employee.");
      }
    } catch (error) {
      console.error("Error registering employee:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleFetchQRCode = async () => {
    try {
      const response = await fetch(`/api/employee?username=${username}`);
      const data = await response.json();
      if (data.route) {
        setRoute(data.route);
      } else {
        alert(data.error || "Failed to fetch QR code route.");
      }
    } catch (error) {
      console.error("Error fetching QR code route:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Register Employee</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>

      <h1>Fetch QR Code</h1>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="button" onClick={handleFetchQRCode}>
          Fetch QR Code
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div ref={qrCodeRef}></div>
      </div>
    </div>
  );
}
