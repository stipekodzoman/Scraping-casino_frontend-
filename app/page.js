"use client"
import React,{useState,useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CleaningServices } from '@mui/icons-material';
export default function Home() {
  const [winOpen, setWinOpen] = React.useState(false);
  const [winOption,setWinOption]=useState("")
  const [galesOpen, setGalesOpen] = React.useState(false);
  const [galesOption,setGalesOption]=useState(0)
  const [lineNumbersOption,setLineNumbersOption]=useState(3)
  const [lineNumbersOpen,setLineNumbersOpen]=useState(false)
  const [bettingResults,setBettingResults]=useState([])
  const [displayedResults,setDisplayedResults]=useState([])
  const [total,setTotal]=useState(0)
  const [wins,setWins]=useState(0)
  const [losses,setLosses]=useState(0)
  const [winsWithoutGales,setWinsWithoutGales]=useState(0)
  const [winsWithGale1,setWinsWithGale1]=useState(0)
  const [winsWithGale2,setWinsWithGale2]=useState(0)
  const [empate,setEmpate]=useState(0)
  const [average,setAverage]=useState(0)
  const handleWinClose = () => {
    setWinOpen(false);
  };

  const handleWinOpen = () => {
    setWinOpen(true);
  };
  const handleGalesClose = () => {
    setGalesOpen(false);
  };

  const handleGalesOpen = () => {
    setGalesOpen(true);
  };
  const handleLineNumbersClose = () => {
    setLineNumbersOpen(false);
  };

  const handleLineNumbersOpen = () => {
    setLineNumbersOpen(true);
  };
  useEffect(() => {
    const get_betting_results = async () => {
      const res = await fetch("http://192.99.185.73:5000/api/v1/get_betting_results");
      const { betting_results } = await res.json();
      setBettingResults(betting_results);
      console.log("results updated");
    };
    const intervalId = setInterval(() => {
      get_betting_results();
    }, 15000);
    return () => clearInterval(intervalId); // cleanup function to clear interval
  }, []);
  useEffect(()=>{
    if(bettingResults.length>=(9*lineNumbersOption)){
      let displayedResults=[]
      for(let i=0;i<9*lineNumbersOption;i++){
        displayedResults.push(bettingResults[i])
      }
      setDisplayedResults(displayedResults)
    } else {
      setDisplayedResults(bettingResults)
    }
  },[bettingResults,lineNumbersOption])
  const addItem=(e)=>{
    const {id}=e.target
    const item=document.getElementById(id)
    const newItem=document.createElement("button")
    newItem.className=item.className
    newItem.innerHTML=item.id
    newItem.value=item.id
    newItem.classList.add("pt-1")
    document.getElementById("strategy").appendChild(newItem)
    newItem.addEventListener("click",(e)=>{
      newItem.remove()
    })
  }
  const testStrategy=()=>{                                                                         //strategy test
    
    const pattern=[]                                              //set the pattern to an empty array
    document.getElementById("strategy").querySelectorAll("button").forEach((item)=>{   //get the pattern values
      pattern.push(item.value)
    })
    if(winOption===""||galesOption===""||pattern.length===0){      //check if all strategy options are filled
      alert("Por favor, selecione uma estrategia")
    }else{
      setWins(0)                                              //following 8 testing results
      setTotal(0)
      setLosses(0)
      setEmpate(0)
      setWinsWithoutGales(0)
      setWinsWithGale1(0)
      setWinsWithGale2(0)
      let results_for_strategy=[]
      for(let i=displayedResults.length-1;i>=0;i--){             //reverse the displayedResults state array for strategy testing
        results_for_strategy.push(displayedResults[i])
      }
      for(let i=0;i<results_for_strategy.length-galesOption-pattern.length;i++){      //test the strategy
        let matched=true                                                          //set the matched flag to true
        for(let j=0;j<pattern.length;j++){                                        //find the matched pattern from results_for_strategy array.
          if(results_for_strategy[i+j]!==pattern[j]){
            matched=false                                                   //if the pattern is not matched, set the matched flag to false
            break
          }
        }
        if(matched){
          setTotal((total)=>total+1)                                       //calculate the total value
          let isWin=false
          for(let k=0;k<=galesOption;k++){                                 //calculate the wins (gales) 
            if(results_for_strategy[i+pattern.length+k]==="C"){
              if(winOption==="C"){
                setWins((wins)=>wins+1)                                    //calculate the wins value
                if(k===0){
                  setWinsWithoutGales((winsWithoutGales)=>winsWithoutGales+1)
                  isWin=true
                  break
                }
                if(k===1){
                  setWinsWithGale1((winsWithGale1)=>winsWithGale1+1)
                  isWin=true
                  break
                }
                if(k===2){
                  setWinsWithGale2(winsWithGale2=>winsWithGale2+1)
                  isWin=true
                  break
                }
              }
              if(winOption==="V"){
                continue
              }
            }
            if(results_for_strategy[i+pattern.length+k]==="V"){
              if(winOption==="V"){
                setWins(wins=>wins+1)
                if(k===0){
                  setWinsWithoutGales(winsWithoutGales=>winsWithoutGales+1)
                  isWin=true
                  break
                }
                if(k===1){
                  setWinsWithGale1(winsWithGale1=>winsWithGale1+1)
                  isWin=true
                  break
                }
                if(k===2){
                  setWinsWithGale2(winsWithGale2=>winsWithGale2+1)
                  isWin=true
                  break
                }
              }
              if(winOption==="C"){
                continue
              }
            }
            if(results_for_strategy[i+pattern.length+k]==="E"){
              setEmpate(empate=>empate+1)                                          //calculate the empate value
              if(document.getElementById("use-E").checked===true){
                setWins(wins=>wins+1)
                if(k===0){
                  setWinsWithoutGales(winsWithoutGales=>winsWithoutGales+1)
                  isWin=true
                  break
                }
                if(k===1){
                  setWinsWithGale1(winsWithGale1=>winsWithGale1+1)
                  isWin=true
                  break
                }
                if(k===2){
                  setWinsWithGale2(winsWithGale2=>winsWithGale2+1)
                  isWin=true
                  break
                }
              }
              else{
                continue
              }
            }
          }
          if(isWin===false){
            setLosses(losses=>losses+1)                                       //calculate the losses value
          }
        }
      }                                       //calculate the average value
    }
  }
  useEffect(() => {
    if(total===0){
      setAverage(0)
    }else{
      const averageWins = parseInt((wins / total) * 100);
      setAverage(averageWins)
    }
    
  },[wins,total]);
  return (
    <div className='w-[70%] mx-auto mt-10'>
      <h1 className='text-4xl font-medium'>Testador de Estrategias</h1>
      <div className='flex'>
        <div className='mt-5'>
          <div className='flex gap-2'>
            <button id="V" onClick={addItem} className='w-[100px] h-[40px] bg-blue-700 text-center text-white text-lg transform hover:scale-105'>V</button>
            <button id="C" onClick={addItem} className='w-[100px] h-[40px] bg-red-500 text-center text-white text-lg transform hover:scale-105'>C</button>
            <button id="E" onClick={addItem} className='w-[100px] h-[40px] bg-gray-500 text-center text-white text-lg transform hover:scale-105'>E</button>
          </div>
          <div className='flex mt-3'>
            <div className='mt-3 w-[230px]'>
              <label htmlFor="win" className="block mb-2 font-medium text-lg text-gray-700">Vencer em</label>
              <FormControl className='w-[92%]'>
                <InputLabel id="win-label" >Selecione uma opcao</InputLabel>
                <Select
                  labelId="win-label"
                  id="win"
                  open={winOpen}
                  onClose={handleWinClose}
                  onOpen={handleWinOpen}
                  value={winOption}
                  label="Select an option"
                  onChange={(e)=>setWinOption(e.target.value)}
                >
                  
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="V">V</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='mt-3 w-[230px]'>
              <label htmlFor="gales" className="block mb-2 font-medium text-lg text-gray-700">Gales</label>
              <FormControl className='w-[92%]'>
                <InputLabel id="gales-label" >Selecione uma opcao</InputLabel>
                <Select
                  labelId="gales-label"
                  id="gales"
                  open={galesOpen}
                  onClose={handleGalesClose}
                  onOpen={handleGalesOpen}
                  value={galesOption}
                  label="Select an option"
                  onChange={(e)=>setGalesOption(e.target.value)}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className='flex align-items:center mt-4'>
            <input type='checkbox' id="use-E" className=' w-4' />
            <label htmlFor='use-E' className='text-sm text-black font-medium'>Considerar E como vitoria?</label>
          </div>
          <div id="strategy" className='grid grid-cols-6 mt-3 mb-5 bg-gray-300 p-2 w-[650px] gap-2' if="items-for-strategy">
          </div>
        </div>
        <div className='mt-16 mx-auto '>
          <button onClick={testStrategy} className="w-[80px] h-[80px]  bg-green-300 text-black border-none  rounded-full text-2xl font-medium  hover:bg-blue-700 hover:text-white hover:outline-none">Test</button>
        </div>
        <div className='flex flex-col text-lg text-black font-medium ml-auto w-[400px] h-[300px] gap-3'>
          <div className='flex justify-between'>
            <label>Total</label>
            <label>{total}</label>
          </div>
          <div className='flex justify-between'>
            <label>Wins</label>
            <label>{wins}</label>
          </div>
          <div className='flex justify-between'>
            <label>Wins (sem gale)</label>
            <label>{winsWithoutGales}</label>
          </div>
          <div className='flex justify-between'>
            <label>Wins (gale 1)</label>
            <label>{winsWithGale1}</label>
          </div>
          <div className='flex justify-between'>
            <label>Wins (gale 2)</label>
            <label>{winsWithGale2}</label>
          </div>
          <div className='flex justify-between'>
            <label>Empate</label>
            <label>{empate}</label>
          </div>
          <div className='flex justify-between'>
            <label>Loss</label>
            <label>{losses}</label>
          </div>
          <div className='flex justify-between'>
            <label>Assertividade</label>
            <label>{average}%</label>
          </div>
        </div>
      </div>
      <div className='flex justify-between mt-5 '>
        <label className='text-2xl font-medium'>Resultados</label>
        <div className='mt-3 w-[200px]'>
          <FormControl className='w-[100%]'>
            <InputLabel id="amount-label" >Quantidade de linhas</InputLabel>
            <Select
              labelId="amount-label"
              id="amount"
              open={lineNumbersOpen}
              onClose={handleLineNumbersClose}
              onOpen={handleLineNumbersOpen}
              value={lineNumbersOption}
              label="Quantidade de linhas"
              onChange={(e)=>setLineNumbersOption(e.target.value)}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={36}>36</MenuItem>
              <MenuItem value={48}>48</MenuItem>
              <MenuItem value={60}>60</MenuItem>


            </Select>
          </FormControl>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-9 gap-10 mt-4 mb-20'>
        {
          displayedResults.map((result,index)=>{
            return (
                <button key={index} className={result==="V"?'w-[113px] h-[40px] bg-blue-700 text-center text-white text-lg':result==="C"?'w-[113px] h-[40px] bg-red-500 text-center text-white text-lg':'w-[113px] h-[40px] bg-gray-400 text-center text-white text-lg'}>{result}</button>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}
