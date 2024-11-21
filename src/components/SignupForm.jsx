import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Alert,
  Checkbox,
} from '@material-tailwind/react';
import { ReduxHelper } from '../core/redux-helper';
import OrganizationNameInput from '../common/OrganizationNameInput';

import {
  CustomEmailInput,
  CustomPasswordInput,
  CustomConfirmPasswordInput,
} from '../maiden-core/ui-components';
import ValidationForSignupAndLogin from './ValidateSignupAndLogin';

//import WelcomeLayout from "../components/WelcomeLayout/index";

const SignupForm = ({ setIsLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState(null);

  const createSuperAdmin_result = useSelector((state) => state?.createSuperAdmin);

  const { validationError, validateSignup, clearValidationError } = ValidationForSignupAndLogin();

  useEffect(() => {
    if (createSuperAdmin_result.data) {
      alert('Organization Created Succesfully');
      navigate('/');
      dispatch(ReduxHelper.Actions.resetCreateSuperAdmin()); // Reset the state
    } else if (createSuperAdmin_result.error) {
      setIsLoading(false);
      setError(createSuperAdmin_result.error);
    }
  }, [createSuperAdmin_result, navigate, dispatch, setIsLoading]);

  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
    setError(null); // Clear error when typing organization input
  };

  const handleEmailChange = (event) => {
    const value = event.target.value.toLowerCase();
    setEmail(value);
    setError(null); // Clear error when typing  email input
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null); // Clear error when typing  password input
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPass(event.target.value);
    setError(null); // Clear error when typing  Confirm password input
  };
  const handleAcceptTerms = (event) => {
    setAcceptTerms(event.target.checked);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var params = {
      organization,
      email,
      password,
      confirmPass,
      acceptTerms,
      isMobile: true,
    };
    const isValid = validateSignup(params);
    if (isValid) {
      setIsLoading(true);
      dispatch(ReduxHelper.Actions.createSuperAdmin(params));
    }
  };

  return (
    <Card
      className="laptopM:w-[550px] mobileM:w-[95vw] mobileM:mt-2 "
      color="transparent"
      shadow={false}
    >
      <CardBody className="flex flex-col gap-3">
        <OrganizationNameInput
          placeholder="Organization Name"
          crossOrigin=""
          label="Organization Name"
          size="lg"
          color="blue"
          required
          value={organization}
          onChange={handleOrganizationChange}
          onFocus={() => {
            setError(null);
            clearValidationError();
          }}
        />
        <CustomEmailInput
          value={email}
          label="Email"
          onChange={handleEmailChange}
          required
          onFocus={() => {
            setError(null);
            clearValidationError();
          }}
        />
        <CustomPasswordInput
          value={password}
          label="Create Password"
          required
          onChange={handlePasswordChange}
          onFocus={() => {
            setError(null);
            clearValidationError();
          }}
        />
        <CustomConfirmPasswordInput
          value={confirmPass}
          label="Confirm Password"
          required
          onChange={handleConfirmPasswordChange}
          onFocus={() => {
            setError(null);
            clearValidationError();
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            variant="paragraph"
            className="text-sm"
            color="blue"
            onChange={handleAcceptTerms}
            onFocus={() => {
              setError(null);
              clearValidationError();
            }}
          />
          <label className="text-sm">
            I agree to the{' '}
            <a
              href="/terms-and-conditions"
              style={{ color: '#056EE9', textDecoration: 'underline' }}
            >
              terms & conditions
            </a>
          </label>
        </div>
        {validationError && (
          <Alert
            style={{
              background: '#DF4A4A',
              padding: '5px',
              fontSize: '10px',
              opacity: '1',
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {validationError}
          </Alert>
        )}
        {error && (
          <Alert
            style={{
              background: '#DF4A4A',
              padding: '5px',
              fontSize: '10px',
              opacity: '1',
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {error}
          </Alert>
        )}
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          className="bg-[#056EE9] font-poppins"
          type="submit"
          shadow={false}
          fullWidth
          color="rose"
          onClick={handleSubmit}
          style={{ backgroundColor: '#056EE9' }}
        >
          Create
        </Button>
        <Typography
          style={{ fontSize: '12px', fontWeight: 'bold', color: '#1C1C1C' }}
          className="mt-4 flex justify-center text-[12x]"
        >
          Already have an Account ?
          <Link to="/" className="ml-1 font-[600] text-[#056EE9]">
            Sign in
          </Link>
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
