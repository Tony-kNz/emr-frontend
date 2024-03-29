import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Person } from '@mui/icons-material';
import Paper from '@material-ui/core/Paper';
import { getApprovedPayments } from '../../utils/api';
import { useCurrentUser } from '../../utils/hooks';
import setAuthToken from '../../utils/setAuthToken';
import { CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';

function PharmacistHome() {
  const user = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const loadApprovedPayments = async () => {
    setIsLoading(true);

    if (user) {
      setAuthToken(user.token);
    }
    try {
      const { data } = await getApprovedPayments();
      // check for duplicates
      // const uniqueArray = [];
      // const ids = [];
      // data.data.forEach((obj) => {
      //   if (!ids.includes(obj.patient._id)) {
      //     uniqueArray.push(obj);
      //     ids.push(obj.patient._id);
      //   }
      // });
      // console.log(uniqueArray);
      console.log(data);
      setIsLoading(false);
      if (data) {
        setPayments(data.data);
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
        <h1>Pharmacist Home</h1>
        <div className="flex space-x-2 mb-3">
          <div className="flex flex-col space-y-1">
            <Avatar className="bg-green-500 mt-1" variant="circular">
              <Person />
            </Avatar>
            <p className="text-xs">Pharmacist</p>
          </div>
          <h2 className="text-xl">{user.data.fullName} </h2>
        </div>
        <section>
          <Paper sx={{ width: '70vw' }} className="p-4">
            <h3>Incoming approved payments</h3>
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
                  const { name, sessionID, _id } = payment;
                  return (
                    <li key={key}>
                      <Link
                        to={`/approved-invoice/${_id}/${sessionID}/${_id}`}
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

export default PharmacistHome;
