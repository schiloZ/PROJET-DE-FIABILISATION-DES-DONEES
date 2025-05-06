"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // 🔥 import toast

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Connexion en cours...");

    try {
      const response = await fetch("/api/connexion", {
        // Changed from /api/connexion
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || "Échec de la connexion");
        return;
      }

      // Store both token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        err.message || "Une erreur est survenue. Veuillez réessayer."
      );
      console.error("Erreur de connexion:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/assets/bag.jpg"
            alt="Login Background"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <Image
              src="/assets/logo.jpg"
              alt="logo"
              width={200}
              height={100}
              className="mx-auto opacity-90"
            />
            <p className="mt-2 text-gray-600">Accéder à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="vous@exemple.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de Passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            >
              Connexion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
