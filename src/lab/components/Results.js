import { Paper } from '@material-ui/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import TestResultForm from '../../common-components/TestResultForm';
import { addLabTestResult } from '../../utils/api';
import { useCurrentUser } from '../../utils/hooks';
import setAuthToken from '../../utils/setAuthToken';

// eslint-disable-next-line react/prop-types
function Results({ role, testId, title, description }) {
  const user = useCurrentUser();

  const [resultValue, setResultValue] = useState({
    result: '',
    resultDescription: ''
  });
  const { result, resultDescription } = resultValue;

  const [isAddingTest, setIsAddingTest] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setResultValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  // pass title and description as params in the submit function

  const addTestResult = async (event) => {
    event.preventDefault();
    setIsAddingTest(true);
    const id = testId;
    const requestData = {
      result: {
        result,
        description: resultDescription
      }
    };
    if (user) {
      setAuthToken(user.token);
    }
    try {
      const { data } = await addLabTestResult(requestData, id);
      setIsAddingTest(false);
      if (data) {
        console.log(data);
        toast.success('Result added successfully');
      }
      navigate(`/${role}`);
    } catch (error) {
      setIsAddingTest(false);
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <Paper className="flex flex-col items-center flex-1 p-3 mt-5">
        <h3>{role} Test Results</h3>
        <p>
          {title}: {description}
        </p>
        <TestResultForm
          isLoading={isAddingTest}
          handleChange={handleChange}
          handleSubmit={addTestResult}
          role={role}
        />
      </Paper>
    </div>
  );
}

export default Results;
