import { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import AccountStatus from './AccountStatus';
import './useUserData.css';
import axios from 'axios';

function UseUserData() {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const id = localStorage.getItem('id');

  if (!id) {
    console.error('ID người dùng không tồn tại trong localStorage');
  }

  const fetchUserData = async () => {
    try {
      if (!id) {
        setError('ID người dùng không hợp lệ!');
        setLoading(false);
        return;
      }
      const params = { id: id };
      const response = await axios.get(`https://localhost:7185/api/Auth/Profile/`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('api:', response.data);
      setUserData(response.data); // Cập nhật dữ liệu người dùng
    } catch (err) {
      setError('Không thể tải thông tin người dùng. Vui lòng thử lại!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async (updatedField) => {
    try {
      const  updatedData = {
        id: localStorage.getItem('id'), // ID từ localStorage
        ...userData, // Các trường hiện tại
        ...updatedField, // Trường đã chỉnh sửa
      };
      const fieldsToUpdate = {};
      Object.keys(updatedData).forEach((key) => {
        if (
          updatedData[key] !== userData[key] &&
          updatedData[key] !== undefined
        ) {
          fieldsToUpdate[key] = updatedData[key];
        }
      });
  
      if (Object.keys(fieldsToUpdate).length === 0) {
        console.log('Không có thay đổi nào để cập nhật');
        return;
      }  
      const response = await axios.put(
        `https://localhost:7185/api/Auth/${id}`, // API endpoint
        fieldsToUpdate,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setUserData((prevData) => ({
        ...prevData,
        ...response.data, // Dữ liệu mới từ API
      })); // Cập nhật lại state với dữ liệu mới
      console.log('Cập nhật thành công:', response.data);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin', error);
    }
  };
  

  useEffect(() => {
    fetchUserData();
  }, [id]);

  return (
    <div className="user-container">
      <div className="user-wrapper">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            <ProfileHeader
              image={userData.image}
              fullName={userData.fullName}
              role={userData.role}
              onSave={(updatedField) => handleSave(updatedField)} 
            />
            <ProfileInfo
              email={userData.email}
              phoneNumber={userData.phoneNumber}
              username={userData.username}
              createdAt={userData.createdAt}
               onSave={(updatedField) => handleSave(updatedField)}
            />
            <AccountStatus isActive={userData.isActive} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UseUserData;
