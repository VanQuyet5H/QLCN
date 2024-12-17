  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import './SickAnimals.css';
  import AnimalStatus from './AnimalStatus';

  const SickAnimalsList = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy danh sách vật nuôi bị ốm từ API
    useEffect(() => {
      axios
        .get("https://localhost:7185/danhsachvatnuoicandieutri")
        .then((response) => {
          setAnimals(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Không thể lấy dữ liệu vật nuôi bị ốm.");
          setLoading(false);
        });
    }, []);

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    return (
      <div className="sick-animals-list">
        <h2>Danh Sách Vật Nuôi Bị Bệnh</h2>
        {animals.length > 0 ? (
          <table className="animals-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Giới Tính</th>
                <th>Ngày Sinh</th>
                <th>Cân Nặng</th>
                <th>Giống</th>
                <th>Tình Trạng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal, index) => (
                <tr key={animal.id}>
                  <td>{index + 1}</td> {/* Hiển thị STT */}
                  <td>{animal.name}</td>
                  <td>{animal.type}</td>
                  <td>{animal.gender}</td>
                  <td>{new Date(animal.birthDate).toLocaleDateString()}</td>
                  <td>{animal.weight} kg</td>
                  <td>{animal.breed}</td>
                  <td>
                    <AnimalStatus animalId={animal.id} currentStatus={animal.status} />
                  </td>
                  <td>
                    {/* Kiểm tra trạng thái trước khi hiển thị nút "Theo dõi" */}
                    {animal.status === "Sick" && (
                      <a href={`/add-health-record/${animal.id}`} className="add-health-record-btn">
                        Điều trị
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có vật nuôi bị ốm.</p>
        )}
      </div>
    );
  };

  export default SickAnimalsList;
