/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Person } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useCurrentUser } from '../../utils/hooks';
import { useParams, useNavigate } from 'react-router';
import setAuthToken from '../../utils/setAuthToken';
import {
  getApprovedPaymentsForPatient,
  dispersePrescription,
  getPrescriptionBySession,
  getPaidPrescription
} from '../../utils/api';
import IntuitiveButton from '../../common-components/IntuitiveButton';
import httpService from '../../utils/axios';

import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});
const drugHeaders = ['Index', 'Name', 'Quantity prescribed', 'Dosage period', 'Note', 'Amount'];
const testHeaders = ['Index', 'Title', 'Description', 'Amount'];

function PharmacistInvoice() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const { patientId, sessionId, paymentId } = useParams();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const classes = useStyles();

  const confirmDrugDisperalUrl = (id) => {
    return `/prescriptions/disperse/${id}`;
  };

  const getDrugIds = () => {
    if (rows) {
      return rows.map((drugs) => httpService.patch(confirmDrugDisperalUrl(drugs._id)));
    }
  };

  const getPatientsApprovedInvoice = async () => {
    setIsLoading(true);
    if (user) {
      setAuthToken(user.token);
    }
    try {
      const { data } = await getPaidPrescription(patientId);
      // const prescriptionData = data.data.prescription.filter((res) => res.drugId !== null);
      setIsLoading(false);
      if (data) {
        setRows(data.data);
        console.log(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error('an error occured');
    }
  };

  const confirmDrugDispersal = async () => {
    setIsLoading(true);

    if (user) {
      setAuthToken(user.token);
    }
    try {
      const type = 'P';
      // const requestData = { paymentId, type };
      const { data } = await Promise.all(getDrugIds());
      console.log(data);
      setIsApproving(false);
      toast.success('Dispersed successful');
      navigate(`/pharmacist`);
    } catch (error) {
      setIsApproving(false);
      console.log(error);
      toast.error('an error occured');
    }
  };
  useEffect(() => {
    getPatientsApprovedInvoice();
  }, []);
  return (
    <>
      <div className="p-8">
        <h1>Patient Invoice</h1>
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
          <Paper className="flex flex-col items-center flex-1 px-3">
            <h3>Drugs</h3>
            {isLoading ? (
              <CircularProgress size={30} />
            ) : (
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {drugHeaders.map((header, key) => {
                        return (
                          <TableCell key={key} align="center" className="bg-green-500">
                            {header}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  {rows && !rows.length ? (
                    <tbody>
                      <tr>
                        <td className="text-lg pl-3 mb-3 text-red-500">
                          No drugs in this invoice.{' '}
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    rows &&
                    rows
                      .filter((item) => item.paid)
                      .map((item, index) => {
                        const { days, drugId, quantity, _id, note } = item;
                        // const { drug, note, quantity, days } = Prescriptions[0];
                        const amount = quantity * drugId.price;
                        return (
                          <TableBody key={_id}>
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{drugId.name}</TableCell>
                              <TableCell align="center">{quantity}</TableCell>
                              <TableCell align="center">{days} days</TableCell>

                              <TableCell align="center">{note}</TableCell>
                              <TableCell align="center">
                                <span>&#8358; {amount}</span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        );
                      })
                  )}
                </Table>
              </TableContainer>
            )}
          </Paper>
        </section>

        <section className="mt-5">
          {/* {isLoading ? (
              <CircularProgress size={30} />
            ) : (
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {testHeaders.map((header, key) => {
                        return (
                          <TableCell key={key} align="center" className="bg-green-500">
                            {header}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading && rows && !rows.length ? (
                      <tr>
                        <td className="text-lg pl-3 mb-3 text-red-500">
                          No tests in this invoice.
                        </td>
                      </tr>
                    ) : (
                      rows &&
                      rows
                        .filter((item) => item.Prescriptions.length)
                        .map((item, index) => {
                          const { Prescriptions } = item;
                          // const { test } = Prescriptions[0];
                          return (
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{Prescriptions[0]?.test?.title}</TableCell>
                              <TableCell align="center">
                                {Prescriptions[0]?.test?.description}
                              </TableCell>
                              <TableCell align="center">{Prescriptions[0]?.test?.price}</TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )} */}
          <div className="w-1/3 flex self-end">
            <div className="w-full mt-3 mb-3">
              <IntuitiveButton
                onClick={confirmDrugDispersal}
                text="confirm drug dispersal"
                isLoading={isApproving}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PharmacistInvoice;

{
  /* {rows.tests && !rows.tests.length ? (
                    <tbody>
                      <tr>
                        <td className="text-lg pl-3 mb-3 text-red-500">
                          No tests in this invoice.
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    rows && rows
                    .map((item, index) => {
                      const { Prescriptions } = item;
                      const { test, testId } = Prescriptions[0];
                      return (
                        <TableBody key={index}>
                          <Link
                            className="hover:bg-slate-400"
                            to={`/lab-results/${testId}/${test.title}/${test.description}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <TableRow>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{test.title}</TableCell>
                              <TableCell align="center">{test.description}</TableCell>
                            </TableRow>
                          </Link>
                        </TableBody>
                      );
                    })
                  )} */
}
