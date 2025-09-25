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
    useEffect(() => { LogsAPI.get("/logs").then((res) => setLogs(res.data)); }, []); 
    return ( <div className="p-4"> <h2 className="text-2xl font-bold mb-4">📜 Activity Logs</h2> {logs.length === 0 ? ( <p>No logs yet.</p> ) : ( logs.map((log) => ( <div key={log._id} className="border p-2 rounded mb-2"> <p> 👤 <b>{log.user?.username || "Unknown User"}</b> ({log.user?.email || "No email"}) <br /> 🛠️ {log.action} → <b>{log.product?.name || "Deleted Product"}</b> <br /> ⏰ {log.createdAt ? new Date(log.createdAt).toLocaleString() : "No Date"} </p> </div> )) )} </div> ); }

