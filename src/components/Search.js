import React, { useState, useEffect } from 'react';
import './search.css';
import api from '../api';
import ReactPaginate from 'react-paginate';
import sortAscIcon from './images/sort-ascending.png';
import sortDescIcon from './images/sort-descending.png';


const Search = () => {
    const [filter, setFilter] = useState(null);
    const [responseData, setResponseData] = useState([]);
    const [searchData, setsearchData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); 
    const itemsPerPage = 5; 

    const searchFn = async () => {
        try {
            if(filter===""){
                setFilter(null);
            }
            const response = await api.get(`/api/data/${String(filter)}`);
            const responseData = await response.data;
            if(searchData.length===0){
                setResponseData(responseData);
            }
            else{
                setsearchData(responseData);
            }
             
        } catch (error) {
            console.log("Failed to get data to frontend", error);
        }
    };

    useEffect(() => {
        
        searchFn();
    }, []);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil((searchData.length!==0?searchData:responseData).length / itemsPerPage);

    const handleSearchInputChange = (e, column) => {
        console.log('handleSearchInputChange called');
       
        const searchTerm = e.target.value.toLowerCase();
        console.log('Search term:', searchTerm);
    
        
        const updatedFilteredData = searchTerm === ''
            ? responseData 
            : responseData.filter((item) => {
                if (column === 'id') return String(item.id).toLowerCase().includes(searchTerm);
                if (column === 'name') return String(item.name).toLowerCase().includes(searchTerm);
                if (column === 'age') return String(item.age).toLowerCase().includes(searchTerm);
                if (column === 'street') return String(item.address.street).toLowerCase().includes(searchTerm);
                if (column === 'city') return String(item.address.city).toLowerCase().includes(searchTerm);
                if (column === 'country') return String(item.address.country).toLowerCase().includes(searchTerm);
                if (column === 'email') return String(item.contact.email).toLowerCase().includes(searchTerm);
                if (column === 'phone') return String(item.contact.phone).toLowerCase().includes(searchTerm);
                if (column === 'education') {
                    
                    const educationMatch = item.education.some((edu) =>
                        Object.values(edu)
                            .map((value) => String(value).toLowerCase())
                            .join(' ')
                            .includes(searchTerm)
                    );
                    return educationMatch;
                }
                if (column === 'skills') {
                    const skillsText = item.skills.join(' ');
                    return skillsText.toLowerCase().includes(searchTerm);
                }
                if (column === 'projects') {
                    
                    const projectsMatch = item.projects.some((project) => {
                        const projectText = Object.values(project)
                            .map((value) => String(value).toLowerCase())
                            .join(' ');
                        return projectText.includes(searchTerm);
                    });
                    return projectsMatch;
                }
                return false;
            });
    
        setsearchData(updatedFilteredData);
    };
    

    const handleColumnHeaderClick = (column) => {
        if (column === sortColumn) {
            
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            
            setSortColumn(column);
            setSortOrder('asc');
        }
    };
    useEffect(() => {
        
        const sortedData = [...(searchData.length !== 0 ? searchData : responseData)];

    
        if (sortColumn) {
            
            sortedData.sort((a, b) => {
                let aValue =
                    columnIsNumeric(sortColumn)
                        ? parseFloat(a[sortColumn])
                        : a[sortColumn];
                let bValue =
                    columnIsNumeric(sortColumn)
                        ? parseFloat(b[sortColumn])
                        : b[sortColumn];
    
                
                if (sortColumn === 'street') {
                    const aStreet = a.address.street || '';
                const bStreet = b.address.street || '';

                for (let i = 0; i < Math.min(aStreet.length, bStreet.length); i++) {
                    const charA = aStreet.charAt(i);
                    const charB = bStreet.charAt(i);

                    if (charA !== charB) {
                        return sortOrder === 'asc' ? charA.localeCompare(charB) : charB.localeCompare(charA);
                    }
                }

                
                return sortOrder === 'asc' ? aStreet.length - bStreet.length : bStreet.length - aStreet.length;
                } else if (sortColumn === 'city' || sortColumn === 'country') {
                     
                const aCity = a.address.city || '';
                const bCity = b.address.city || '';
                
            
                for (let i = 0; i < Math.min(aCity.length, bCity.length); i++) {
                    const charA = aCity.charAt(i);
                    const charB = bCity.charAt(i);

                    if (charA !== charB) {
                        return sortOrder === 'asc' ? charA.localeCompare(charB) : charB.localeCompare(charA);
                    }
                }

          
                return sortOrder === 'asc' ? aCity.length - bCity.length : bCity.length - aCity.length;
                } 
                else if (sortColumn === 'name') {
                   
                    const aName = a.name || '';
                    const bName = b.name || '';
    
                   
                    for (let i = 0; i < Math.min(aName.length, bName.length); i++) {
                        const charA = aName.charAt(i);
                        const charB = bName.charAt(i);
    
                        if (charA !== charB) {
                            return sortOrder === 'asc' ? charA.localeCompare(charB) : charB.localeCompare(charA);
                        }
                    }
    
                    
                    return sortOrder === 'asc' ? aName.length - bName.length : bName.length - aName.length;
            }
            else if (sortColumn === 'email') {
                
                const aEmail = (a.contact.email || '').split('@')[0] || '';
                const bEmail = (b.contact.email || '').split('@')[0] || '';

                
                for (let i = 0; i < Math.min(aEmail.length, bEmail.length); i++) {
                    const charA = aEmail.charAt(i);
                    const charB = bEmail.charAt(i);

                    if (charA !== charB) {
                        return sortOrder === 'asc' ? charA.localeCompare(charB) : charB.localeCompare(charA);
                    }
                }

                
                return sortOrder === 'asc' ? aEmail.length - bEmail.length : bEmail.length - aEmail.length;
            }

            else if (sortColumn === 'phone') {
                   
                    const aValueStr = a.contact.phone || '';
                    const bValueStr = b.contact.phone || '';
    
                    
                    for (let i = 0; i < Math.min(aValueStr.length, bValueStr.length); i++) {
                        const charA = aValueStr.charAt(i);
                        const charB = bValueStr.charAt(i);
    
                        if (charA !== charB) {
                            return sortOrder === 'asc' ? charA.localeCompare(charB) : charB.localeCompare(charA);
                        }
                    }
    
                    
                    return sortOrder === 'asc' ? aValueStr.length - bValueStr.length : bValueStr.length - aValueStr.length;
                }
    
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }
    
        
        setsearchData(sortedData);
    }, [sortColumn, sortOrder]);
    
    

const columnIsNumeric = (column) => {
    return (
        column === 'id' ||
        column === 'age' ||
        column === 'phone' ||
        column === 'street' ||
        column === 'city' ||
        column === 'country'||
        column === 'name'
    );
};

    

    

    return (
        <div className='full'>
            <div className='InputContainer'>
                <input
                    type='text'
                    placeholder='Search text ...'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button onClick={searchFn}>Search</button>
            </div>

            <div className='SearchDataDiv'>
                <table>
                    <thead>
                        <tr>
                            <td colSpan={11}>
                                <div className="pagination">
                                    <ReactPaginate
                                        previousLabel={'<'}
                                        nextLabel={'>'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination-container'}
                                        activeClassName={'active'}
                                    />
                                    <h2 style={{marginTop:'15px'}}>Page</h2>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('id')}
                                >
                                    <p>id</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
    type='search'
    placeholder='Search ID'
    onKeyUp={(e) => handleSearchInputChange(e, 'id')}
/>
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('name')}
                                >
                                    <p>Name</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Name'
                                    onChange={(e) => handleSearchInputChange(e, 'name')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('age')}
                                >
                                    <p>Age</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Age'
                                    onChange={(e) => handleSearchInputChange(e, 'age')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('street')}
                                >
                                    <p>Street</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Street'
                                    onChange={(e) => handleSearchInputChange(e, 'street')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('city')}
                                >
                                    <p>City</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search City'
                                    onChange={(e) => handleSearchInputChange(e, 'city')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('country')}
                                >
                                    <p>Country</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Country'
                                    onChange={(e) => handleSearchInputChange(e, 'country')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('email')}
                                >
                                    <p>Email</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Email'
                                    onChange={(e) => handleSearchInputChange(e, 'email')}
                                />
                            </th>
                            <th>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', cursor: 'pointer' }}
                                    onClick={() => handleColumnHeaderClick('phone')}
                                >
                                    <p>Phone</p>
                                   
                                        <img src={sortOrder === 'asc' ? sortAscIcon : sortDescIcon} alt={`Sort ${sortOrder}`} style={{ height: '15px', width: '15px' }} />
                                    
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search Phone'
                                    onChange={(e) => handleSearchInputChange(e, 'phone')}
                                />
                            </th>
                            <th>
                            <tr>
                                    <p>Education</p>
                                    </tr>
                                <tr><input
                                    type='search'
                                    placeholder='Search Education'
                                    onChange={(e) => handleSearchInputChange(e, 'education')}
                                /></tr>
                            </th>
                            <th>
                            <tr >
                                    <p>Skills</p>
                                   </tr>
                                <tr><input
                                    type='search'
                                    placeholder='Search Skills'
                                    onChange={(e) => handleSearchInputChange(e, 'skills')}
                                /></tr>
                            </th>
                            <th>
                            <tr>
                                    <p>Projects</p>
                                    </tr>
                                <tr><input
                                    type='search'
                                placeholder='Search Projects'
                                    onChange={(e) => handleSearchInputChange(e, 'projects')}
                                /></tr>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchData.length!==0?searchData:responseData).slice(offset, offset + itemsPerPage).map((item) => (
                            <tr key={item.id}>
                                <td style={{textAlign:'center'}}>{item.id}</td>
                                <td style={{textAlign:'center'}}>{item.name}</td>
                                <td style={{textAlign:'center'}}>{item.age}</td>
                                <td style={{textAlign:'center'}}>{item.address.street}</td>
                                <td style={{textAlign:'center'}}>{item.address.city}</td>
                                <td style={{textAlign:'center'}}>{item.address.country}</td>
                                <td>{item.contact.email}</td>
                                <td style={{textAlign:'center'}}>{item.contact.phone}</td>
                                <td>
                                    {item.education.map((edu, index) => (
                                        <>
                                        <div key={index} style={{padding:'20px'}}>
                                            <p><b>Degree:</b> {edu.degree}</p>
                                            <p><b>Major:</b> {edu.major}</p>
                                            <p><b>University:</b> {edu.university}</p>
                                            <p><b>Year:</b> {edu.year}</p>
                                        </div>
                                        {index < item.education.length - 1 && <hr />}
                                        </>
                                    ))}
                                </td>
                                <td>{item.skills.join(', ')}</td>
                                <td>
                                    {item.projects.map((project, index) => (
                                        <>
                                        <div key={index} style={{padding:'20px'}}>
                                            <p><b>Title:</b> {project.title}</p>
                                            <p><b>Description:</b> {project.description}</p>
                                            <p><b>Contributors:</b></p>
                                            {project.contributors.map((contributor, subIndex) => (
                                                <div key={subIndex}>
                                                    <p><b>Name:</b> {contributor.name}</p>
                                                    <p><b>Role:</b> {contributor.role}</p>
                                                </div>
                                            ))}
                                            
                                        </div>
                                        {index < item.education.length - 1 && <hr />}
                                        </>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default Search;
