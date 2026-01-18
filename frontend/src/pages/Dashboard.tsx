import { useEffect, useMemo, useState } from "react";
import {
  createFeedback,
  myFeedback,
  allFeedback,
  reviewFeedback,
} from "../api/api";
import type { Feedback } from "../types";
import { getUserRole } from "../auth/auth";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loader, setLoader] = useState(true);

  const role = useMemo(() => getUserRole(), []);


  const loadData = async () => {
    setLoader(true);
    try {
      if (role === "admin") {
        const data = await allFeedback(); // ✅ admin only
        setFeedbacks(data || []);
        setIsAdmin(true);
      } else {
        const data = await myFeedback(); // ✅ user only
        setFeedbacks(data);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Failed to load feedbacks", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const submit = async () => {
    await createFeedback(message, rating);
    setMessage("");
    setRating(1);
    loadData();
  };

  // const submit = useCallback(async () => {
  //   await createFeedback(message, rating);
  //   loadData();
  // }, [message, rating, loadData]);


  const review = async (id: number) => {
    await reviewFeedback(id);
    loadData();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Feedback Dashboard
            </h2>

            <button
              onClick={onLogout}
              type="button"
              className="flex items-center gap-2.5  px-4 py-2 text-sm rounded-md bg-red-400/30 text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* User: Add Feedback Form */}
          {!isAdmin && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="bg-white rounded-lg shadow p-6 mb-6 mt-5"
            >
              <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>

              <div className="flex gap-3">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <input
                  type="number"
                  min={1}
                  max={5}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-20"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Feedback List */}
          <div className="bg-white rounded-lg shadow p-6 mt-5  w-full">
            <h3 className="text-lg font-semibold mb-4">
              {isAdmin ? "All Feedback" : "My Feedback"}
            </h3>
            {loader ? (
              <div className="h-10 w-10 border-2  border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <p className="text-gray-800">{f.message}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Rating: {f.rating}/5</span>
                        <span
                          className={`font-medium ${f.status === "Reviewed" ? "text-green-600" : "text-yellow-600"}`}
                        >
                          {f.status}
                        </span>
                      </div>
                    </div>

                    {/* Admin Only */}
                    {isAdmin && f.status !== "Reviewed" && (
                      <button
                        onClick={() => review(f.id)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition ml-4"
                      >
                        Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
