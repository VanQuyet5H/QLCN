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

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const SecuritySettings = () => {
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleTwoFactorChange = () => setTwoFactor(!twoFactor);

  return (
    <SettingsContainer>
      <Title>Cài đặt bảo mật</Title>
      <SettingOption>
        <SettingLabel>Mật khẩu mới</SettingLabel>
        <Input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Nhập mật khẩu mới"
        />
      </SettingOption>
      <SettingOption>
        <SettingLabel>
          <Checkbox
            type="checkbox"
            checked={twoFactor}
            onChange={handleTwoFactorChange}
          />
          Kích hoạt xác thực hai yếu tố
        </SettingLabel>
      </SettingOption>
    </SettingsContainer>
  );
};

export default SecuritySettings;
