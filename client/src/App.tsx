import { useState, type FormEvent } from "react";

interface Result {
  bloomFilter: boolean | null;
  database: boolean | null;
  falsePositive: boolean;
}

const DEFAULT_RESULT_STATE = {
  bloomFilter: null,
  database: null,
  falsePositive: false,
};

function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<Result>(DEFAULT_RESULT_STATE);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sumbitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsPending(true);

      // api call
      const res = await fetch(
        // `${import.meta.env.VITE_API_BASE_URL}/password/check`,
        `http://localhost:3000/password/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: password }),
        }
      );

      if (!res.ok) {
        throw new Error("Api Request Failed!");
      }

      const data = await res.json();

      setResult(data);

      // reset
      setError(null);
    } catch (error) {
      console.error(error);
      setResult(DEFAULT_RESULT_STATE);
      setError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-20">
      <h1 className="text-4xl font-bold">Common Password Detector 🕵️</h1>
      <form
        action="post"
        onSubmit={sumbitPassword}
        className="flex flex-col gap-5 items-center"
      >
        <input
          className="p-2 border rounded-md text-lg"
          name="password"
          type="text"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={isPending}
          type="submit"
          className="bg-gray-800 text-white py-2.5 px-5 rounded-md cursor-pointer hover:shadow-md transition w-fit"
        >
          {isPending ? "Checking... 🔍" : "Check 🔍"}
        </button>
      </form>
      <div className="grid grid-cols-3 grid-rows-1 gap-5">
        <div className="border p-5 flex flex-col justify-center items-center gap-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Bloom Filter</h2>
          <p className="text-green-500 text-xl italic">
            {String(result.bloomFilter).toUpperCase()}
          </p>
        </div>
        <div className="border p-5 flex flex-col justify-center items-center gap-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Database</h2>
          <p className="text-green-500 text-xl italic">
            {String(result.database).toUpperCase()}
          </p>
        </div>
        <div className="border p-5 flex flex-col justify-center items-center gap-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">False Postive</h2>
          <p className="text-green-500 text-xl italic">
            {String(result.falsePositive).toUpperCase()}
          </p>
        </div>
      </div>
      {error && (
        <div className="text-center text-red-600 text-lg">
          <h3 className="font-bold">Error:</h3>
          <p>{error.message ?? "An Error Occurred!"} 😢</p>
        </div>
      )}
    </div>
  );
}

export default App;
