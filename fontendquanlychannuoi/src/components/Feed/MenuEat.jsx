import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import FeedForm from './FeedForm'; // Component tạo chế độ ăn
import FeedList from './FeedList'; // Component xem danh sách chế độ ăn (giả sử đã tạo)
import './MenuEat.css';
const FeedTabs = () => {
    const [activeTab, setActiveTab] = useState('createfeed'); // Sử dụng activeTab thay vì value

    const renderContent = () => {
        switch (activeTab) {
            case 'createfeed':
                return <FeedForm />;
            case 'feedlist':
            default:
                return <FeedList />;
        }
    };

    return (
        <div className='menueat'>
        <Box sx={{ width: '100%'}}>
            <Tabs
                value={activeTab}
                onChange={(event, newTab) => setActiveTab(newTab)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="Feed Tabs"
            >
                <Tab label="Tạo Chế Độ Ăn" value="createfeed" />
                <Tab label="Xem Chế Độ Ăn" value="feedlist" />
            </Tabs>

            <Box sx={{ padding:0 }} className="custom-content">
                {renderContent()} {/* Render nội dung dựa trên activeTab */}
            </Box>
        </Box></div>
    );
};

export default FeedTabs;
