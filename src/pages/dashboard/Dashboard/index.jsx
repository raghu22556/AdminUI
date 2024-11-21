import Layout from '../../../components/Layout';
import { Button, Typography } from '@material-tailwind/react';
import { GrAdd } from 'react-icons/gr';
import LineChart from './Charts/LineChart';
import ProgresBar from './Charts/ProgresBar';
import Cards from './Cards';
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import { withTranslation } from 'react-i18next';
import Chat from '../../../components/Chat';

// import "ag-grid-community/styles//ag-grid.css";
// import "ag-grid-community/styles//ag-theme-quartz.css";

const Dashboard = (props) => {
  const { t } = props;
  return (
    <div>
      <Chat/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between mt-4">
          <Typography className="text-xl font-poppins text-black font-bold text-center  lg:text-left mb-4 lg:mb-0 dark:text-white">
            {t('Dashboard')}
          </Typography>
          {/* Dashboard */}
          <div className="flex flex-col lg:flex-row gap-2">
            <Button className="flex items-center gap-3 border border-[#6499E9] text-[#6499E9] bg-transparent mb-2 lg:mb-0 font-normal font-semibold">
              <GrAdd />
              {t('Create Table')}
            </Button>

            <Button className="flex items-center gap-3 bg-[#95A4FC] mb-2 lg:mb-0  font-semibold">
              <GrAdd />
              {t('Add Module')}
            </Button>

            <Button className="flex items-center gap-3 bg-[#6499E9] mb-2 lg:mb-0 font-semibold">
              <GrAdd />
              {t('Create Project')}
            </Button>
          </div>
        </div>
        <Cards />
        {/* Linecharts and Progresbar */}
        {/* <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-2">
          <div className="w-full overflow-x-auto shadow-lg lg:w-[2100px]">
            <LineChart />
          </div>
          <div className="w-full shadow-lg ">
            <ProgresBar />
          </div>
        </div>
       

        <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-6 mb-5">
          <div className="overflow-x-auto lg:w-[59%] shadow-lg">
            <BarChart />
          </div>
          <div className="overflow-x-auto lg:w-[40%] shadow-lg">
            <PieChart />
          </div>
        </div> */}

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-2">
          <div className="w-full lg:w-[100%] shadow-lg overflow-x-auto lg:overflow-hidden">
            <LineChart />
          </div>
          <div className="w-full shadow-lg lg:w-[40%]">
            <ProgresBar />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-6 mb-5">
          <div className="w-full lg:w-[58%] shadow-lg overflow-x-auto lg:overflow-hidden">
            <BarChart />
          </div>
          <div className="w-full lg:w-[40%] shadow-lg overflow-x-auto lg:overflow-hidden">
            <PieChart />
          </div>
          {/* <div className="w-full lg:w-[40%] shadow-lg overflow-x-auto lg:overflow-hidden">
            <PieChart />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Layout(Dashboard));
