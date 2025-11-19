  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { apiClient } from "@/apiClient/apiClient";
  import { useUser } from "@/contexts/UserContext";

  export function LoginFeature() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { checkSession } = useUser();

    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      setError("");
      setLoading(true);

    try {
      await apiClient("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

        await checkSession();
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
