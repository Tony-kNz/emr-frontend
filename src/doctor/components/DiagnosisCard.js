/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';
import DropdownSearch from '../../common-components/DropdownSearch';
import setAuthToken from '../../utils/setAuthToken';
import { addPatientDiagnosis } from '../../utils/api';
import TransformButton from '../../common-components/TransformButton';
import { useCurrentUser } from '../../utils/hooks';

function DiagnosisForm({
  diagnosis,
  handleChange,
  inputData,
  setInputData,
  sessionId,
  patientId,
  diagnosisList
}) {
  const user = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { description } = inputData;

  const diagnosisId = diagnosisList.data.filter((diagnose) => diagnose.title === diagnosis);

  const onSubmitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // const title = diagnosis;
    const note = description;
    const diagnosis = diagnosisId[0]._id;
    const doctor = user.data.staff_id;
    const sessionID = sessionId;
    const patient = patientId;

    const requestBody = { note, diagnosis, sessionID, patient, doctor };
    console.log(requestBody);

    if (user) {
      setAuthToken(user.token);
    }
    try {
      await addPatientDiagnosis(requestBody);
      setInputData({ description: '' });
      setIsLoading(false);
      setIsSuccessful(true);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
      setIsSuccessful(false);
    }
  };

  return (
    <form onSubmit={onSubmitForm}>
      <li className="flex flex-row justify-evenly mt-2 mb-2">
        <input type="text" name="title" readOnly value={diagnosis} disabled={false} />
        <input
          type="text"
          disabled={isSuccessful}
          name="description"
          onChange={handleChange}
          placeholder="description"
        />
        <TransformButton
          btnText="Add diagnosis"
          isSuccessful={isSuccessful}
          isLoading={isLoading}
        />
      </li>
    </form>
  );
}

function DiagnosisCard({ sessionId, patientId, diagnosisList }) {
  const [choice, setChoice] = useState([]);
  const [inputData, setInputData] = useState({
    title: '',
    description: ''
  });
  const handleChange = (e) => {
    setInputData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleDiagnosisChoice = (event) => {
    if (event.target.checked && !choice.length) {
      setChoice([event.target.value]);
    } else if (event.target.checked && choice.length > 0) {
      setChoice([...choice, event.target.value]);
    }
    // remove choice from list when you uncheck its checkbox
    if (!event.target.checked) {
      const filterdArr = choice.filter((c) => c !== event.target.value);
      setChoice([...filterdArr]);
    }
  };

  return (
    <Paper sx={{ flexGrow: 1 }} className="p-3">
      <div className="flex justify-between">
        <h3 className="text-lg mb-3">Diagnosis</h3>
        <DropdownSearch
          btnText="Add diagnosis"
          menuItems={diagnosisList}
          handleCheckboxChange={handleDiagnosisChoice}
        />
      </div>
      <div>
        {choice && choice.length ? (
          <div>
            {choice &&
              choice.map((c, index) => {
                return (
                  <>
                    <DiagnosisForm
                      key={c}
                      diagnosis={c}
                      handleChange={handleChange}
                      inputData={inputData}
                      setInputData={setInputData}
                      sessionId={sessionId}
                      patientId={patientId}
                      diagnosisList={diagnosisList}
                    />
                    {index === choice.length - 1 ? null : (
                      <Divider orientation="horizontal" variant="fullWidth" />
                    )}
                  </>
                );
              })}
          </div>
        ) : (
          <p className="text-lg mb-3 text-red-500">Select from diagnosis options above</p>
        )}
      </div>
    </Paper>
  );
}

export default DiagnosisCard;
