"use client"
import Navbar from "@/components/navbar";
import { useData } from "@/context";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [file,setFile] = useState<File |null>(null);
  const {setJsonData,setLLMData} = useData();
  const handleFileChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const selectedFile = e.target.files?.[0];
    if(selectedFile){
      setFile(selectedFile);
      const formdata = new FormData();
      formdata.append("file",selectedFile);

      const response = await axios.post("/api/extract",formdata,{
        headers:{
          'Content-Type':'mutipart/form-data'
        }
      });

      if(response.status===200){
        console.log("Everything went fruitfull");
      }else{
        console.log("Debug it!!..Something went wrong!")
      }
    }
  }
  const router = useRouter();
  const uploadFileData = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!file){
      console.log("upload the file...");
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("file",file);

      const response = await axios.post("/api/preprocess",formdata,{
        headers:{
          'Content-Type':'mutipart/form-data'
        }
      });

      if(response.status===200){
        const jsondata = response.data.data;
        const llmdata = response.data.llmdata;
        // setMyJson(jsondata)
        setJsonData(jsondata);
        setLLMData(llmdata);
        console.log("LLMData");
        for(const data in llmdata){
          console.log(data)
        }
        console.log('Successfully data uploaded');
        router.push('/ChartRenderer')
      }else{
        console.log("Something went wrong...")
      }

    } catch (error) {
      console.log('Failed to upload the file '+error)
    }
  }

  return (
    <>
   <Navbar/>
    <div className="flex flex-col justify-center items-center">
      <section className="p-10 flex flex-col justify-center items-center">
        <h2 className="p-2 text-center text-2xl tracking-tight">
          Welcome to <span className="font-bold text-yellow-500">Dexora</span>
        </h2>
      <p className="p-2 text-center">An AI based Business Analyst which can help you scale your Business to next level</p>
      
      </section>
      <section className="flex flex-col justify-center items-center">
        <div className="flex flex-col mb-3">
          <label htmlFor="input" className="font-light text-sm p-1">Upload an Excel file</label>
          <input
          onChange={handleFileChange}
          className="border flex w-[75vw] p-2 justify-center items-center rounded-md hover:scale-95 cursor-pointer"  type="file" placeholder="Enter the excel file..."/>
        </div>
        <div className="flex flex-col justify-center items-center p-2 gap-4">
          <button
          onClick={uploadFileData}
          className="flex justify-center items-center tracking-tight bg-yellow-600 p-2 rounded-xl hover:bg-yellow-800 cursor-pointer">Generate the Insights</button>
          <div className="">
            Or
          </div>
              <Link href={"/DexoraAI"} className="flex justify-center items-center tracking-tight p-2 hover:text-blue-800 hover:underline">Any anything about your data to AI</Link>
          
        </div>
      </section>
      <div className="w-full p-2 ">
        <hr className="font-extralight bg-white opacity-20"/>
      </div>
      
    </div>
    </>
  );
}
