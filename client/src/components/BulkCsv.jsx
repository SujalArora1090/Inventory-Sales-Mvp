import { useState } from "react";
import Papa from "papaparse"
import API from "../utils/api";

export default function BulkCsv(){
   const [file, setFile] = useState(null)

   const handleImport=()=>{
    
    if(!file){
        return alert("Select CSV file")
    }
    Papa.parse(file,{
        skipEmptyLines:true,
        header:true,
        complete:async({data})=>{
            console.log(data)
            try{
            await API.post("/import",data)
            alert("Import Done")
        }catch(err){
            console.log(err)
            alert("Import failed")
        }
    }
    })
}
    

   


const handleExport=async()=>{
    try{
        const res=await API.get("/export",{responseType:"blob"})
        const url=URL.createObjectURL(res.data)
        const a=document.createElement("a")
        a.href=url
        a.download="products.csv"
        a.click()
    }catch(err){
        console.error(err)
        alert("export failed")
    }
}

  return (
    <div>
      <h2>📂 Bulk Import / Export</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleImport}>📥 Import</button>
      <button onClick={handleExport}>📤 Export</button>
    </div>
  );
}
