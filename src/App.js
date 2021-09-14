import {useState,useEffect} from "react";
import {connect,StringCodec} from "../node_modules/nats.ws/lib/src/mod.js";

const sc=StringCodec();


function App() {

  const [nc,setConnection]=useState(undefined);
  const [conClosed,setConClosed]=useState(undefined);
  const [lastError,setError]=useState("");

  
  const handleOnOff = (event)=>{
    const command=event.target.value
    if(nc){
      let subject="RPI.EVENTS."+command;
      nc.publish(subject,sc.encode(command));
      }
  }

  useEffect(()=>{
    if(!nc){
      (async ()=>{
        try{
          const nc=await connect({servers:["ws://127.0.0.1:9090"]})

          const done=nc.closed();
          console.log("Connected to server: "+nc.getServer());
          setConClosed(done);
          setConnection(nc);
        }catch(err){
          console.error(err);
        }
      })();
    }
  },[nc])

  return (
    <>
      <div className="w-9/12 py-4 px-6 mx-auto flex justify-center items-center">
        <button
            type="button"
            onClick={handleOnOff}
            value="ON"
            className="inline-flex items-center mx-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-400 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            ON
        </button>

        <button
          type="button"
          onClick={handleOnOff}
          value="OFF"
          className="inline-flex items-center mx-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          OFF
        </button>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col mt-6">
        <div className="flex flex-row self-center">
          <h1 className="text-3xl px-4">Messages</h1>
          {nc
          ?(<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            ONLINE
            </span>)
          :(<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            OFFLINE
          </span>)
          }
        </div>
      </div>
    </>
  );
}

export default App;
