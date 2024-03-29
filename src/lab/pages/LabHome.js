import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { Person } from '@mui/icons-material';
import Paper from '@material-ui/core/Paper';
import { useCurrentUser } from '../../utils/hooks';
import setAuthToken from '../../utils/setAuthToken';
import { getPendingLab } from '../../utils/api';
import { CircularProgress } from '@material-ui/core';

function LabHome() {
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const loadApprovedPayments = async () => {
    setIsLoading(true);

    if (user) {
      setAuthToken(user.token);
    }
    try {
      const { data } = await getPendingLab();
      console.log(data);
      setIsLoading(false);
      // const filterPatient = data.data.filter((res) => res.test);
      // // check for duplicates
      // const uniqueArray = [];
      // const ids = [];
      // filterPatient.forEach((obj) => {
      //   if (!ids.includes(obj.patient._id)) {
      //     uniqueArray.push(obj);
      //     ids.push(obj.patient._id);
      //   }
      // });
      // console.log(uniqueArray);
      if (data) {
        setPayments(data.data);
        // console.log(filterPatient);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('an error occured');
    }
  };
  useEffect(() => {
    loadApprovedPayments();
  }, []);

  return (
    <>
      <div className="p-8">
        <h1>Lab Home</h1>
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex flex-col space-y-1">
            <Avatar className="bg-green-500 mt-1" variant="circular">
              <Person />
            </Avatar>
            <p className="text-xs ml-3">Lab</p>
          </div>
          <h2 className="text-xl">{user.data.fullName} </h2>
        </div>
        <section>
          <Paper sx={{ width: '70vw' }} className="p-4">
            <h3>Incoming patients</h3>
            <ol>
              {isLoading ? (
                <CircularProgress size={30} />
              ) : !payments.length ? (
                <p className="text-lg pl-3 mb-3 text-red-500">
                  There are no incoming approved payments.
                </p>
              ) : (
                payments &&
                payments.map((payment, key) => {
                  const { name, _id, sessionID } = payment;
                  return (
                    <li key={key}>
                      <Link
                        to={`/lab-tests/${_id}/${sessionID}`}
                        style={{ textDecoration: 'none' }}>
                        {name}
                      </Link>
                    </li>
                  );
                })
              )}
            </ol>
          </Paper>
        </section>
      </div>
    </>
  );
}

export default LabHome;
