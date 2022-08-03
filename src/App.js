import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect,useState, useCallback } from 'react';
import './App.css';
import mondaySdk from "monday-sdk-js"


const monday = mondaySdk()
monday.setToken(
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE2MDg0Njc5MCwidWlkIjozMDMxOTI1MCwiaWFkIjoiMjAyMi0wNS0xN1QwMToxNzowNC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NzcxNzE2NywicmduIjoidXNlMSJ9.X7R9ymORVX0CcbbBotMLdk_VjPmjfBWszsrkAvhUa3s"
)

export default function App() {  
  const [context, setContext] = useState({})
  const [settings, setSettings] = useState({})    
  
  useEffect(() => {    
      monday.listen("settings", res => setSettings(res.data))
      monday.listen("context", res => setContext(res.data))         
    },[])
      
  return (    
    <div className="App">     
      <WeathersCards context={context} settings={settings} className="col-md-4" />      
    </div>
  );
}

function WeathersCards({context, settings}){
  const [weathers, setWeathers] = useState([])
  const [locationIds,setLocationIds] = useState("")
  
  useEffect(() => {      
      const board= context.boardIds || [context.boardIds]     
      console.log(board)
      monday.api(`query{boards(ids: [${board}] ) { items(limit:1) { column_values { type id } } } }`)
      .then(res => res.data.boards[0].items[0].column_values.map((values) => {
        if (values.type === "location") {   
          setLocationIds(values.id)
      }}))  

      monday.api(`query{ boards( ids: [${board}] ) { items { column_values(ids:"${locationIds}") { text } } } }`)
      .then((res) => {   
        console.log(res)     
          res.data.boards[0].items.map((item) => {
            console.log(item)
            fetch(`https://api.weatherapi.com/v1/current.json?key=c156f7f2a3d84ae0861121630223006&q=${item.column_values[0].text}&aqi=no`)
            .then(result => result.json())
            .then(json => {
                let weather = {
                  name:json.location.name,
                  temp_c: json.current.temp_c,
                  temp_f: json.current.temp_f,
                  time: json.location.localtime,
                  condition: json.current.condition.text,
                  icon: json.current.condition.icon,
                };
                console.log(weather)
                setWeathers((weathers) => [...weathers, weather])              
              }
          )})
      }) 
      
    }, [context]) 

  return(
    <div className="container">
      <div className="row">            
        <div className="col-md-4">
        {weathers.length === 0 ? (<h2>Cargando...</h2>) : weathers.map((city) => 
        (            
          <WeathersCard name={city.name} temp_f={city.temp_f} temp_c={city.temp_c} time={city.time} 
                        condition={city.condition} icon={city.icon}  tempMeasure={settings.AlterTempButton}/>
        ))}
        </div>
      </div>  
    </div>
  )
}

function WeathersCard({name, temp_c, temp_f, time, condition,icon, tempMeasure}){
    
  return(
    
          <div className="cards">     
            <div className="card" style={{width: "12rem"}}>
              <img src={icon} className="card-img-top" alt={condition}/>
                <div className="card-body">
                  <div>                                    
                    <h2 className="card-title" >{name}</h2>                
                    <p className="card-text">{condition}</p>                        
                      { tempMeasure === 'C' ? (<h3 className="card-text"> {temp_c} C°</h3>) : (<h3 className="card-text"> {temp_f} F°</h3>)}                      
                    <p className="card-text">{time} </p>
                  </div>            
              </div>
            </div>
          </div> 
  )
}