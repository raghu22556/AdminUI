import React, { useState } from 'react';
import { Typography, Input } from '@material-tailwind/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const CustomInput_Old = (props) => <Input {...props} />;

const CustomInput = (props) => {
  const { label, isValid } = props;

  return (
    <div
      className=" flex flex-col border border-gray-300 p-2 rounded-md laptopM:w-full  laptopM:ml-0 "
      style={{ height: 57 }}
    >
      {label && (
        <Typography variant="small" color="gray" className="text-xs">
          {label}
        </Typography>
      )}
      <Input
        {...props}
        shadow={false}
        variant="static"
        className=" bg-white ring-4 ring-transparent "
        labelProps={{
          className: 'hidden',
        }}
        style={{ border: 'none', padding: 0, margin: 0 }}
      />
    </div>
  );
};

const CustomEmailInput = (props) => {
  return <CustomInput {...props} type="Email" placeholder="Email" />;
};

const CustomPasswordInput = (props) => {
  const [showPass, setShowPass] = useState(false);

  const handleShowPass = () => setShowPass((prev) => !prev);
  let componentType = 'password';
  if (props.type) {
    componentType = props.type;
  }
  if (showPass) {
    componentType = 'text';
  }
  return (
    <CustomInput
      {...props}
      type={componentType}
      placeholder="password"
      icon={
        showPass ? (
          <EyeIcon onClick={handleShowPass} className="h-5 w-5 text-blue-500 cursor-pointer" />
        ) : (
          <EyeSlashIcon onClick={handleShowPass} className="h-5 w-5 cursor-pointer" />
        )
      }
    />
  );
};

const CustomConfirmPasswordInput = (props) => {
  return <CustomPasswordInput {...props} placeholder="Enter password" />;
};

export { CustomInput, CustomEmailInput, CustomPasswordInput, CustomConfirmPasswordInput };
