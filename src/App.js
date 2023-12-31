import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css'
import {TbPointFilled} from "react-icons/tb"
import {GrAdd} from "react-icons/gr"
import {SlOptions} from "react-icons/sl"
import { FiArrowDown} from "react-icons/fi"



const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState(localStorage.getItem('groupingOption') ||'status');
  const [sortingOption, setSortingOption] = useState(localStorage.getItem('sortingOption') ||null);

  useEffect(() => {
    const fetchUpc  = async()=>{
      const {data : {tickets}} = await axios.get(`https://api.quicksell.co/v1/internal/frontend-assignment`);
      setTickets(tickets);
    };
    fetchUpc();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupingOption', groupingOption);
    localStorage.setItem('sortingOption', sortingOption);
  }, [groupingOption, sortingOption]);

  const sortOptions = ['Priority', 'Title'];
  const groupOptions = ['Status', 'User', 'Priority'];

  const groupedAndSortedTickets = () => {
    let grouped = {};
    for (const ticket of tickets) {
      const groupKey = groupingOption === 'Status' ? ticket.status : groupingOption === 'User' ? ticket.userId : ticket.priority;
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(ticket);
    }

    for (const group in grouped) {
      if (sortingOption === 'Priority') {
        grouped[group].sort((a, b) => b.priority - a.priority);
      } else if (sortingOption === 'Title') {
        grouped[group].sort((a, b) => a.title.localeCompare(b.title));
      }
    }
    return grouped;
  };

  return (
    <div>
      <div className='nav'>
        <div class="dropdown">
          <button class="dropbtn">  Display  <FiArrowDown/>
          </button>
        <div class="dropdown-content">
     
      <div >
        <label>Grouping: </label>
        <select onChange={(e) => setGroupingOption(e.target.value)} value={groupingOption}>
          {groupOptions.map((option, index) => (
            <option key={index} value={option} className='sltr'>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Ordering: </label>
        <select onChange={(e) => setSortingOption(e.target.value)} value={sortingOption}>
          {sortOptions.map((option, index) => (
            <option key={index} value={option} className='sltr'>{option}</option>
          ))}
        </select>
      </div>
      </div>
  </div>
      </div>
      <div className='main'>
      <h2 className='name'>Grouping by <b>{groupingOption}</b> is selected.</h2>
      <div className='row'>
        {Object.entries(groupedAndSortedTickets()).map(([group, groupTickets]) => (
          <div key={group} className='col'>
            <div className='name' >
                <span className='nameset'>{group}</span>
                <span> - {groupTickets.length} </span>
                <p className='addsym'><button onClick={()=> alert("JSON data is already given")}><GrAdd/></button>   
                    <span class="dropdown3">
                      <button class="dropbtn3"> <SlOptions/> 
                      </button>
                      <span class="dropdown-content3">
                        <p>Options</p>
                      </span>
                    </span>
                 </p>       
            </div>
            
            {groupTickets.map((ticket) => (
              <div key={ticket.id} className='box'>
                <p className='userman'>{ticket.userId}</p>
                <div className='na'><TbPointFilled/>{ticket.title}</div>
                <div class="dropdown2">
                  <button class="dropbtn2"> <SlOptions/> 
                  </button>
                  <div class="dropdown-content2">
                    <p>Status: {ticket.status}</p>               
                    <p>Priority: {ticket.priority}</p>
                  </div>
                </div> 
              </div>
            ))}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default App;