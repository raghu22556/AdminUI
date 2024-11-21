import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

import { injectTOStore } from '../../core/redux-helper/injectTOStore';
import { newConfig } from '../../store/config';
import OrganizationNameInput from '@/common/OrganizationNameInput';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

injectTOStore(newConfig);

const WidgetCard = ({ title, onClick }) => {
  return (
    <Card
      className="rounded-md cursor-pointer"
      onClick={onClick}
      style={{
        border: '1px solid rgba(28, 28, 28, 0.1) ',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        height: '100px',
      }}
    >
      <CardBody className="p-4 text-right w-full h-[200px] dark:rounded-[8px] dark:border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 ">
        <div className="flex justify-between ">
          <div>
            <Typography
              variant="small"
              className=" font-poppins text-black text-[14px] text-left dark:text-white"
              style={{ fontWeight: '600' }}
            >
              {title}
            </Typography>
            <Typography
              variant="small"
              color="#1C1C1C66"
              className="text-sm mt-2 text-left tracking-[.5px]  text-[12px]  font-poppins"
            >
              Click here to view {title}
            </Typography>
          </div>
          <div className="w-[20px]">
            <img src="view.svg" alt="" className="dark:bg-gray-600 dark:rounded-[4px]" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const CardsLayout = ({ item }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Handle sorting logic
  const handleSort = (filteredChildren) => {
    if (filteredChildren) {
      let sortedChildren = [...filteredChildren];
      if (sortOption === 'asc') {
        sortedChildren.sort((a, b) => a.displayText.localeCompare(b.displayText));
      } else if (sortOption === 'desc') {
        sortedChildren.sort((a, b) => b.displayText.localeCompare(a.displayText));
      }
      return sortedChildren;
    }
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Filter children based on search term
  let filteredChildren = item?.children?.filter(({ displayText }) =>
    displayText.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Apply sorting to filtered children
  filteredChildren = handleSort(filteredChildren);

  // Clear search input
  const clearSearchInput = () => {
    setSearchTerm('');
  };

  return (
    <div>
      <div className="grid gap-x-1.5 md:grid-cols-2 xl:grid-cols-4 mt-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:text-gray-50 dark:bg-gray-900 w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none text-sm font-[poppins]"
          />

          {/* Conditionally show SearchIcon or CloseIcon with explicit gray or black color */}
          {!searchTerm ? (
            <SearchIcon
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              sx={{ color: 'gray', width: '20px' }} // Inline styling for gray color
            />
          ) : (
            <CloseIcon
              className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              sx={{ color: 'gray', width: '20px' }} // Inline styling for gray color
              onClick={clearSearchInput}
            />
          )}
        </div>

        <div className="relative">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="dark:bg-gray-900 dark:text-gray-300 text-sm font-[poppins] absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded w-[150px] h-[36px]  focus:outline-none" // Removed focus styles
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
      </div>

      <div className="mb-12 grid gap-y-4 gap-x-1.5 md:grid-cols-2 xl:grid-cols-4 mt-6">
        {filteredChildren?.length > 0 ? (
          filteredChildren.map(({ displayText, url, ...rest }) => (
            <WidgetCard
              onClick={() => {
                navigate('/' + item.url + '/' + url);
              }}
              key={url}
              {...rest}
              title={displayText}
              url={item.url}
            />
          ))
        ) : (
          <Typography className=" dark:text-gray-50 flex justify-center items-center h-[55vh] w-[100%] text-center ml-[400px] font-poppines">
            No results found
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Layout(CardsLayout);
