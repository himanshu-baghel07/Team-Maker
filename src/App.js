import React, { useEffect, useState } from 'react'
import './App.css'
import {
  Container,
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  PaginationItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'


const App = () => {

  const [data, setData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [isTeamDetailsOpen, setIsTeamDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.npoint.io/e69c09b2302b37c8d3e1")
      const data = await response.json()
      setData(data)
    }
    fetchData()
  }, [])

  const cardsPerPage = 20;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const filteredData =
    data &&
    data.filter(
      (item) =>
        `${item.first_name} ${item.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        item.domain.toLowerCase().includes(domainFilter.toLowerCase()) &&
        (genderFilter === '' || item.gender.toLowerCase() === genderFilter.toLowerCase()) &&
        (availabilityFilter ? item.available : true)
    );

  const toggleTeamMember = (id) => {
    const selectedMember = data.find((item) => item.id === id);
    const domain = selectedMember.domain;
    const domainAlreadySelected = selectedDomains.includes(domain);
    const memberAvailable = selectedMember.available === true;
    const membersInDomain = selectedTeamMembers.filter(
      (memberId) => data.find((item) => item.id === memberId).domain === domain
    );

    if (memberAvailable && !domainAlreadySelected && membersInDomain.length === 0) {
      setSelectedTeamMembers((prevState) => [...prevState, id]);
      setSelectedDomains((prevState) => [...prevState, domain]);
    } else {
      setSelectedTeamMembers((prevState) => prevState.filter((memberId) => memberId !== id));
      setSelectedDomains((prevState) => prevState.filter((selectedDomain) => selectedDomain !== domain));
    }
    setIsTeamDetailsOpen(true);
  };

  const teamMembers = data
    ? data.filter((item) => selectedTeamMembers.includes(item.id))
    : [];
  const teamMemberNames = teamMembers.map((item) => item.first_name).join(', ');

  const paginate = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <Container maxWidth={false} id='container'  >
      <Typography
        sx={{
          fontSize: { md: '2.2rem', xs: '1.5rem' },
          color: 'white',
          textAlign: 'center',
          pt: 1,
          pb: 1,
          borderBottom: '2px solid white'
        }}>
        Team Maker
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
        <TextField
          name='search'
          variant='standard'
          InputProps={{
            style: {
              border: "none",
              outline: "none",
              height: { md: '50px', xs: '20px' },
              fontSize: '1.2rem',
              color: 'white'
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search Name'
          sx={{ width: { md: '40%', xs: '80%' }, pt: { md: 2, xs: 0 }, mt: { md: 2, xs: 1 }, backgroundColor: '#2d64bd', fontSize: { md: '1.5rem', xs: '1rem' }, pl: 2, pr: 2, borderRadius: '20px', mr: { md: 2, xs: 0 } }}
        />

        <Select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          displayEmpty
          renderValue={() => domainFilter || 'All Domains'}
          sx={{
            fontSize: { md: '1.2rem', xs: '.9rem' },
            width: { md: '15%', xs: '35%' },
            backgroundColor: '#2d64bd',
            mt: { md: 2, xs: 1 },
            mr: { md: 2, xs: 1 },
            height: { md: '50px', xs: '30px' },
            borderRadius: '20px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <MenuItem value="">All Domains</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Management">Management</MenuItem>
          <MenuItem value="UI Designing">UI Designing</MenuItem>
          <MenuItem value="Business Development">Business Development</MenuItem>
        </Select>

        <Select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          displayEmpty
          renderValue={() => genderFilter || "All Genders"}
          sx={{
            fontSize: { md: '1.2rem', xs: '.9rem' },
            width: { md: '15%', xs: '35%' },
            backgroundColor: '#2d64bd',
            mt: { md: 2, xs: 1 },
            mr: { md: 2, xs: 1 },
            height: { md: '50px', xs: '30px' },
            borderRadius: '20px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <MenuItem value="">All Genders</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Agender">Agender</MenuItem>
          <MenuItem value="Bigender">Bigender</MenuItem>
        </Select>

        <FormControlLabel
          control={
            <Checkbox
              checked={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.checked)}
              sx={{ color: 'white' }}
            />
          }
          label="Available only"
          sx={{ fontSize: '1rem', color: 'white', mt: 1 }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px'
        }}>
        <Typography
          sx={{
            color: 'white',
            ml: { md: 5, xs: 1 },
            fontSize: { md: '1.2rem', xs: '.9rem' }
          }}>
          {`Showing ${filteredData ? filteredData.length : '0'} results`}
        </Typography>
        {teamMembers.length > 0 && (
          <>
            <Select
              label="View Team"
              value={null}
              onChange={() => { }}
              displayEmpty
              renderValue={() => domainFilter || 'View Team'}
              sx={{
                width: { xs: '50%', md: '15%' },
                height: '35px',
                textAlign: 'center',
                mt: 2,
                color: 'white',
                backgroundColor: '#2d64bd',
                borderRadius: '20px'
              }}
            >
              <MenuItem value={null} disabled>
                Team Members
              </MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.id}
                  value={member.first_name}
                  sx={{ display: 'flex', justifyContent: 'inherit' }}>
                  <b>{member.first_name}</b> <span>({member.domain})</span>
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredData &&
          filteredData.slice(indexOfFirstCard, indexOfLastCard).map((item) => (
            <Card id='card'
              key={item.id}
              sx={{ width: { md: '250px', xs: '150px' }, margin: '10px' }}>
              <CardMedia
                component="img"
                height="160"
                image={item.avatar}
                alt={`${item.first_name} ${item.last_name}`}
                sx={{ objectFit: 'contain', backgroundColor: '#8cb4f5' }}
              />
              <CardContent>
                <Typography gutterBottom component="div"
                  sx={{ color: 'white', fontSize: { md: '1.5rem', xs: '1.2rem' }, }}>
                  {`${item.first_name} ${item.last_name}`}
                </Typography>

                <Typography sx={{ color: 'white', fontSize: { md: '0.9rem', xs: '.8rem' }, }}>
                  {`Domain: ${item.domain}`}
                </Typography>

                <Typography sx={{ color: 'white', fontSize: { md: '0.9rem', xs: '.8rem' }, }}>
                  {`Email: ${item.email}`}
                </Typography>

                <Typography sx={{ color: 'white', fontSize: { md: '0.9rem', xs: '.8rem' }, }}>
                  {`Gender: ${item.gender}`}
                </Typography>

                <Typography sx={{ color: 'white', fontSize: { md: '0.9rem', xs: '.8rem' }, }}>
                  {`Availability: ${item.available ? 'Yes' : 'No'}`}
                </Typography>

                <Button onClick={() => toggleTeamMember(item.id)}
                  sx={{
                    width: '100%',
                    fontSize: { md: '1rem', xs: '.8rem' },
                    mt: { md: 3, xs: 1 },
                    backgroundColor: 'orange',
                    fontWeight: 550
                  }}>
                  {selectedTeamMembers.includes(item.id) ? 'Remove from team' : 'Add to team'}
                </Button>
              </CardContent>
            </Card>
          ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={Math.ceil(filteredData ? filteredData.length / cardsPerPage : 1)} onChange={paginate}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              style={{ color: 'white', fontSize: '1.2rem', backgroundColor: 'blue', }}
            />
          )}
        />
      </Box>
    </Container>
  )
}
export default App