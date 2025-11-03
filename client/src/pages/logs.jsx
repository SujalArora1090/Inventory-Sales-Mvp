// import { useEffect,useState } from "react";
// import API from "../utils/api";

// export default function Logs(){
//     const [logs, setLogs] = useState([])

//     useEffect(() => {
//   API.get("http://localhost:5000/api/logs")
//      .then((res) => {
//       console.log("Logs data:", res.data);
//       setLogs(res.data);
//     })
//     .catch((err) => {
//       console.error(err);
//       setLogs([]);  
//     });
// }, []);

   


// //   return (
// //     <div>
// //       <h2>Activity Logs</h2>
// //       {logs.map((log) => (
// //         <div key={log._id}>
// //           {log.user?.name} did {log.action} on {log.product?.name} at {new Date(log.timestamp).toLocaleString()}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// return (
//   <div>
//     <h2>Activity Logs</h2>
//     {Array.isArray(logs) && logs.length > 0 ? (
//       logs.map((log) => (
//         <div key={log._id}>
//           {log.user?.name} did {log.action} on {log.product?.name} at{" "}
//           {new Date(log.timestamp).toLocaleString()}
//         </div>
//       ))
//     ) : (
//       <p>No logs available</p>
//     )}
//   </div>
// );
// }


import { useEffect, useState } from "react";
import LogsAPI from "../utils/logsapi";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    LogsAPI.get("/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        📜 Activity Logs
      </h2>

      {logs.length === 0 ? (
        <p className="text-center text-gray-500">No logs yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <p className="text-sm sm:text-base break-words">
                👤 <b>{log.user?.username || "Unknown User"}</b>{" "}
                <span className="text-gray-500">
                  ({log.user?.email || "No email"})
                </span>
                <br />
                🛠️ {log.action} →{" "}
                <b className="text-indigo-600">
                  {log.product?.name || "Deleted Product"}
                </b>
                <br />
                ⏰{" "}
                {log.createdAt
                  ? new Date(log.createdAt).toLocaleString()
                  : "No Date"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


