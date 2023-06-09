import React from "react";
import { useEffect, useState } from "react";
import { Card, Grid, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import axios from "axios";

const Metrics = () => {
  const [users, setUsers] = useState(0);
  const [tournaments, setTournaments] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [gender, setGender] = useState({ male: 0, female: 0, other: 0 });
  const basketballTournamentsCount = 0;
  const soccerTournamentsCount = tournaments; // Cantidad ficticia de torneos de fútbol
  const volleyballTournamentsCount = 0;

useEffect(() => {
  const fetchMetrics = async () => {
    try {
      const uid = localStorage.getItem("uid");

      // Fetch users and set gender counts
      const usersResponse = await axios.get(
        `http://localhost:3001/api/users/${uid}`
      );
      const usersData = usersResponse.data;
      const usersCount = usersData.length;
      setUsers(usersCount);

      let maleCount = 0;
      let femaleCount = 0;
      let otherCount = 0;

      usersData.forEach((user) => {
        if (user.gender === "male") {
          maleCount++;
        } else if (user.gender === "female") {
          femaleCount++;
        } else {
          otherCount++;
        }
      });

      setGender({ male: maleCount, female: femaleCount, other: otherCount });

      // Fetch tournaments and calculate participation
      const tournamentsResponse = await axios.get(
        `http://localhost:3001/api/tournaments/all/${uid}`
      );
      const tournamentsData = tournamentsResponse.data;
      const amountOfTournaments = tournamentsData.length;
      setTournaments(amountOfTournaments);

      let totalUsersPlaying = 0;

      tournamentsData.forEach((tournament) => {
        const userCount = tournament.users.length;

        if (usersCount > 0) {
          const participation = (userCount / usersCount) * 100;
        }

        totalUsersPlaying += userCount;
      });

      const averageParticipation =
        (totalUsersPlaying / (amountOfTournaments * usersCount)) * 100;
      setParticipation(averageParticipation);
    } catch (error) {
      console.log(error);
    }
  };

  fetchMetrics();
}, []);


  const genderData = [
    { name: "Masculino", value: gender.male },
    { name: "Femenino", value: gender.female },
    { name: "Other", value: gender.other },
  ];

  const sportData = [
    { name: "Baloncesto", value: basketballTournamentsCount },
    { name: "Fútbol", value: soccerTournamentsCount },
    { name: "Voleibol", value: volleyballTournamentsCount },
  ];

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Usuarios</Typography>
          <Typography variant="h3">{users}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Torneos</Typography>
          <Typography variant="h3">{tournaments}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Porcentaje de participantes</Typography>
          <Typography variant="h3">{participation}%</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">
            Distribución de usuarios por género
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
              >
                <Cell fill="#0088FE" />
                <Cell fill="#00C49F" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">
            Distribución de torneos por deporte
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sportData}>
              <Bar dataKey="value" fill="#8884d8" />
              <XAxis dataKey="name" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Metrics;
