export function calculateGrowthRate(weightHistory) {
    if (!weightHistory || weightHistory.length < 2) return 0;
  
    const sortedHistory = [...weightHistory].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  
    const firstRecord = sortedHistory[0];
    const lastRecord = sortedHistory[sortedHistory.length - 1];
    
    const daysDiff = (new Date(lastRecord.date) - new Date(firstRecord.date)) / (1000 * 60 * 60 * 24);
    const weightDiff = lastRecord.weight - firstRecord.weight;
  
    return daysDiff > 0 ? (weightDiff / daysDiff).toFixed(2) : 0;
  }
  
  export function analyzeGrowthTrend(weightHistory) {
    if (!weightHistory || weightHistory.length < 2) {
      return { status: 'insufficient-data', rate: 0 };
    }
  
    const growthRate = calculateGrowthRate(weightHistory);
  
    // Phân tích xu hướng tăng trưởng
    if (growthRate <= 0.5) {
      return { status: 'slow', rate: growthRate };
    } else if (growthRate > 1.2) {
      return { status: 'fast', rate: growthRate };
    }
    return { status: 'normal', rate: growthRate };
  }
  
  export function calculateFCR(feedIntake, weightGain) {
    return feedIntake > 0 && weightGain > 0 ? (feedIntake / weightGain).toFixed(2) : 0;
  }
  
  export function predictTargetDate(currentWeight, targetWeight, growthRate) {
    if (!growthRate || growthRate <= 0) return null;
    
    const weightToGain = targetWeight - currentWeight;
    const daysNeeded = weightToGain / growthRate;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.ceil(daysNeeded));
    
    return targetDate;
  }