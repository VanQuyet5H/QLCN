import { FaTimes } from 'react-icons/fa';
import { Card, CardContent, Typography, Grid, Button, Divider, Box } from '@mui/material';
import { Pets, HealthAndSafety, Storefront } from '@mui/icons-material';
import './ViewLivestock.css';

function ViewLivestock({ livestock, onClose }) {
  if (!livestock) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="view-livestock-container" style={{ overflow: 'hidden' }}>
      <Card
        sx={{
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          borderRadius: '10px',
          boxShadow: 5,
          overflow: 'hidden',
        }}
      >
        <CardContent>
          <div
            className="view-livestock-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Chi tiết vật nuôi
            </Typography>
            <Button onClick={onClose} variant="outlined" color="error">
              <FaTimes />
            </Button>
          </div>

          <Grid container spacing={3}>
            {/* General Info */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  padding: '20px',
                  boxShadow: 3,
                  borderRadius: '10px',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Thông tin chung
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Pets color="primary" fontSize="large" />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body1" noWrap>
                      <strong>Mã số vật nuôi:</strong> {livestock.id}
                    </Typography>
                    <Typography variant="body1" noWrap>
                      <strong>Tên vật nuôi:</strong> {livestock.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Giống:</strong> {livestock.breed}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Giới tính:</strong> {livestock.gender === 'Male' ? 'Đực' : 'Cái'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ngày sinh:</strong> {formatDate(livestock.birthDate)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Cân nặng:</strong> {livestock.weight} kg
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Status Info */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  padding: '20px',
                  boxShadow: 3,
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Trạng thái
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <HealthAndSafety color={livestock.status === 'Sick' ? 'error' : 'success'} fontSize="large" />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body1" noWrap>
                      <strong>Trạng thái:</strong>
                      <span className={`status ${livestock.status.toLowerCase()}`}>
                        {livestock.status}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ngày tạo:</strong> {formatDate(livestock.createdAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Cage Info */}
            <Grid item xs={12}>
              <Card
                sx={{
                  padding: '20px',
                  boxShadow: 3,
                  borderRadius: '10px',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Thông tin chuồng nuôi
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Storefront color="primary" fontSize="large" />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body1" noWrap>
                      <strong>Chuồng nuôi:</strong> {livestock.cage.name}
                    </Typography>
                    <Typography variant="body1" noWrap>
                      <strong>Vị trí:</strong> {livestock.cage.location}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Diện tích:</strong> {livestock.cage.area} m²
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

          <Box textAlign="right">
            <Button
              onClick={onClose}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2, borderRadius: '20px' }}
            >
              Đóng
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewLivestock;
