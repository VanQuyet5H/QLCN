import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import SaleList from './SaleList';
import AddSale from './AddSale';
import './SaleMenu.css';
import SalesReport from './SalesReport';
const BaoCaoBanHang = () => (
  <Typography variant="body1" p={2}>
    Nội dung Báo Cáo Bán Hàng sẽ có sau!
  </Typography>
);



const MenuBanHang = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <SaleList />;
      case 1:
        return <AddSale />;
      case 2:
        return <SalesReport />;
      default:
        return null;
    }
  };

  return (
    <div class="SaleMenu">
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant="h4" gutterBottom>
        Bán vật nuôi
      </Typography>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Các Tab Quản Lý Bán Hàng"
      >
        <Tab label="Danh Sách Giao Dịch" />
        <Tab label="Thêm Giao Dịch" />
        <Tab label="Báo Cáo Bán Hàng Và Thống Kê Doanh Thu" />
      </Tabs>
      <Box sx={{ p: 3 }}>{renderTabContent()}</Box>
    </Box>
    </div>
  );
};

export default MenuBanHang;
