import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
  Alert,
} from '@material-tailwind/react';
import { CustomEmailInput, CustomPasswordInput } from '../maiden-core/ui-components';
import { ReduxHelper } from '../core/redux-helper';
import { injectTOStore } from '../core/redux-helper/injectTOStore';
import { defaultActions } from '../app-config';
import ValidationForSignupAndLogin from './ValidateSignupAndLogin';
import AppleSignUpBtn from '../common/AppleSignUpBtn';
import GoogleSignUpBtn from '../common/GoogleSignUpBtn';

const LoginForm = ({ setIsLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login_result = useSelector((state) => state?.login);
  

  localStorage.clear();
  sessionStorage.clear();
  const { validationError, validateLogin, clearValidationError } = ValidationForSignupAndLogin();

  useEffect(() => {
    if (login_result.data) {
      if (login_result.data.message) {
        setError(login_result.data.message);
        setIsLoading(false);
        return;
      }
      localStorage.clear();
      sessionStorage.clear();
      const {
        token,
        menu,
        dynamicConfig,
        masterDataList,
        userTable,
        localizedData,
        organizationId,
        project,
      } = login_result.data;
      var entityMapping = {};
      for (var item of JSON.parse(masterDataList)) {
        entityMapping[item.table] = item;
      }
      var tokenObject = {
        //expires_in: expires_in,
        access_token: token,
        //refresh_token: refresh_token,
        created: Date.now(),
      };
      localStorage.setItem('cube:token', JSON.stringify(tokenObject));
      localStorage.setItem('menu', JSON.stringify(menu));
      localStorage.setItem('dynamicConfig', dynamicConfig);
      localStorage.setItem('entityMapping', JSON.stringify(entityMapping));
      localStorage.setItem('userTable', userTable);
      localStorage.setItem('languageData', JSON.stringify(localizedData));
      localStorage.setItem('organizationId', organizationId);
      localStorage.setItem('project', JSON.stringify(project));

      let dynamicConfigJson = JSON.parse(dynamicConfig);
      let newConfig = [];
      if (null != dynamicConfigJson) {
        newConfig = dynamicConfigJson.map((item) => {
          return { ...item, actions: [...defaultActions] };
        });
      }
      injectTOStore(newConfig);
      navigate('/dashboard');
      window.location.reload();
    } else if (login_result.error) {
      setError(login_result.error);
      setIsLoading(false);
      return;
    }
  }, [login_result, navigate, dispatch, setIsLoading]);

  useEffect(() => {
    return () => {
      dispatch(ReduxHelper.Actions.resetLogin());
    };
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleEmailChange = (event) => {
    const value = event.target.value.toLowerCase();
    setEmail(value);
    setError(null); // Clear error when typing in email input
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null); // Clear error when typing in password input
  };

  const handleBlur = () => {
    // Do nothing on blur for now
  };

  const onLoginClick = () => {
    var params = {
      email,
      password,
    };
    const isValid = validateLogin(params);
    if (isValid) {
      setIsLoading(true);
      dispatch(ReduxHelper.Actions.login(params));
    }
  };

  return (
    <Card
      className=" laptopM:w-[550px] mobileM:w-[95vw] mobileM:mt-2"
      color="transparent"
      shadow={false}
    >
      <CardBody className="flex flex-col laptopM:gap-3 mobile:gap-3">
        <CustomEmailInput
          value={email}
          onChange={handleEmailChange}
          onBlur={handleBlur}
          onFocus={() => {
            setError(null);
            clearValidationError();
            setLoginSuccess(false);
          }}
        />
        <CustomPasswordInput
          value={password}
          onChange={handlePasswordChange}
          onBlur={handleBlur}
          onFocus={() => {
            setError(null);
            clearValidationError();
            setLoginSuccess(false);
          }}
        />
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
        {loginSuccess && (
          <Alert
            style={{
              background: '#4CAF50',
              padding: '5px',
              fontSize: '10px',
              opacity: '1',
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            Login successful!
          </Alert>
        )}
        <Typography className=" m-[-5px] flex justify-between items-center laptop:text-sm mobile:text-xs text-black font-medium">
          <Checkbox
            variant="paragraph"
            label="Keep Me Logged In"
            className="text-xs"
            color="blue"
          />
          <Link to="/forgot-password" className="text-[#056EE9]">
            Forgot Password?
          </Link>
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <div>
          <Button
            className="bg-[#056EE9] font-poppins laptopM:w-full mobileM:w-[100%] mobile:w-[90vw] mobile:justify-center laptopM:ml-0"
            type="submit"
            disabled={false}
            onClick={onLoginClick}
            style={{ shadow: 'none' }}
          >
            Log In
          </Button>
          <Typography className="mt-3 flex laptopM:justify-center laptop:ml-8 laptop:text-sm mobile:text-xs mobile:justify-center text-black font-medium">
            Don&apos;t have an account?
            <Link to="/signup" className="ml-1 font-normal text-[#056EE9]">
              Create Account
            </Link>
          </Typography>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
