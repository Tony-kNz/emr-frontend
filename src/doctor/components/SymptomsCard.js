/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';
import DropdownSearch from '../../common-components/DropdownSearch';
import setAuthToken from '../../utils/setAuthToken';
import { addPatientSymptom } from '../../utils/api';
import TransformButton from '../../common-components/TransformButton';
import { useCurrentUser } from '../../utils/hooks';

// eslint-disable-next-line no-unused-vars
function SymptomsForm({
  symptom,
  handleChange,
  inputData,
  setInputData,
  sessionId,
  patientId,
  symptoms
}) {
  const user = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const symptomId = symptoms.data.filter((symp) => symp.title === symptom);
  console.log(symptomId, symptoms);
  const { description } = inputData;

  const onSubmitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (user) {
      setAuthToken(user.token);
    }
    try {
      // const title = symptom;

      const note = description;
      const symptom = symptomId[0]._id;
      const doctor = user.data.staff_id;
      const sessionID = sessionId;
      const patient = patientId;
      const requestBody = { symptom, note, description, patient, doctor, sessionID };
      console.log(requestBody);
      const { data } = await addPatientSymptom(requestBody);
      setInputData({ description: '' });
      console.log(data);
      setIsLoading(false);
      setIsSuccessful(true);
    } catch (error) {
      setIsLoading(false);
      setIsSuccessful(false);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitForm}>
      <li className="flex flex-row justify-evenly mt-2 mb-2">
        <input type="text" name="title" readOnly value={symptom} disabled={false} />
        <input
          type="text"
          disabled={isSuccessful}
          name="description"
          onChange={handleChange}
          // value={description}
          placeholder="description"
        />
        <TransformButton btnText="Add symptom" isSuccessful={isSuccessful} isLoading={isLoading} />
      </li>
    </form>
  );
}

export default function SymptomCard({ sessionId, patientId, symptomsList }) {
  const [choice, setChoice] = useState([]);
  // console.log(symptomsList);
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

  const handleSymptomChoice = (event) => {
    if (event.target.checked) {
      // choice.push(event.target.value);
      setChoice([...choice, event.target.value]);
    }
    if (!event.target.checked) {
      const filterdArr = choice.filter((c) => c !== event.target.value);
      setChoice([...filterdArr]);
    }
  };
  // console.log(choice);

  return (
    <Paper sx={{ flexGrow: 1 }} className="p-3">
      <div className="flex justify-between">
        <h3 className="text-lg mb-3">Symptoms</h3>
        <DropdownSearch
          btnText="Add symptoms"
          menuItems={symptomsList}
          handleCheckboxChange={handleSymptomChoice}
        />
      </div>
      <div>
        {choice && choice.length ? (
          <div>
            {choice &&
              choice.map((c, index) => {
                return (
                  <>
                    <SymptomsForm
                      key={c}
                      symptom={c}
                      handleChange={handleChange}
                      inputData={inputData}
                      setInputData={setInputData}
                      sessionId={sessionId}
                      patientId={patientId}
                      symptoms={symptomsList}
                    />
                    {index === choice.length - 1 ? null : (
                      <Divider orientation="horizontal" variant="fullWidth" />
                    )}
                  </>
                );
              })}
          </div>
        ) : (
          <p className="text-lg mb-3 text-red-500">Select from symptoms options above</p>
        )}
      </div>
    </Paper>
  );
}
