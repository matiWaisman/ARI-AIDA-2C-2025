  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { apiClient } from "@/apiClient/apiClient";

  export function LoginFeature() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        await apiClient("/app/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });

        router.push("/");
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    return { username, password, setUsername, setPassword, handleLogin, error, loading };
  }
