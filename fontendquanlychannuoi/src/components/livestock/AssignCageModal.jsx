function AssignCageModal({ open, onClose, livestock, cages, onAssign }) {
    const [selectedCage, setSelectedCage] = useState('');
  
    const handleAssign = () => {
      onAssign(selectedCage);
      onClose();
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Assign Cage</Typography>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Cage</InputLabel>
            <Select
              value={selectedCage}
              onChange={(e) => setSelectedCage(e.target.value)}
              label="Cage"
            >
              {cages.map((cage) => (
                <MenuItem key={cage.id} value={cage.id}>
                  {cage.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button onClick={onClose} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedCage}>
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
  