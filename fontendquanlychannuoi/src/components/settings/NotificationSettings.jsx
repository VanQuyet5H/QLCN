import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const SettingOption = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleEmailChange = () => setEmailNotifications(!emailNotifications);
  const handlePushChange = () => setPushNotifications(!pushNotifications);

  return (
    <SettingsContainer>
      <Title>Cài đặt thông báo</Title>
      <SettingOption>
        <SettingLabel>
          <Checkbox
            type="checkbox"
            checked={emailNotifications}
            onChange={handleEmailChange}
          />
          Thông báo qua Email
        </SettingLabel>
      </SettingOption>
      <SettingOption>
        <SettingLabel>
          <Checkbox
            type="checkbox"
            checked={pushNotifications}
            onChange={handlePushChange}
          />
          Thông báo qua Push
        </SettingLabel>
      </SettingOption>
    </SettingsContainer>
  );
};

export default NotificationSettings;
