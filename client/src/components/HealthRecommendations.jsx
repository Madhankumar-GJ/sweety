import React from 'react';

export default function HealthRecommendations({ average }) {
  // Determine recommendation based on average blood glucose (mg/dL)
  const getRecommendation = (avg) => {
    if (!avg || avg === 0) {
      return {
        title: 'Start Logging Your Readings',
        text: 'Record your readings consistently across all four slots to receive personalized daily health insights and trends.',
        color: '#64748b',
        bg: '#f8fafc',
        border: '#e2e8f0',
        icon: '💡'
      };
    }
    if (avg < 70) {
      return {
        title: 'Low Blood Glucose (Hypoglycemia Risk)',
        text: 'Your average is below 70 mg/dL. Consider having a fast-acting carbohydrate snack (like juice or glucose tablets) and consult your healthcare provider.',
        color: '#991b1b',
        bg: '#fef2f2',
        border: '#fecaca',
        icon: '⚠️'
      };
    }
    if (avg >= 70 && avg <= 140) {
      return {
        title: 'Great Glucose Control! 🎉',
        text: 'Your average is within the optimal healthy target range (70–140 mg/dL). Maintain your balanced diet and regular physical activity!',
        color: '#166534',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: '✅'
      };
    }
    if (avg > 140 && avg <= 180) {
      return {
        title: 'Slightly Elevated Average',
        text: 'Your average is running a bit high (140–180 mg/dL). Focus on low-glycemic foods, staying well-hydrated, and light post-meal walks.',
        color: '#9a3412',
        bg: '#fff7ed',
        border: '#fed7aa',
        icon: '⚡'
      };
    }
    return {
      title: 'High Blood Glucose (Attention Needed)',
      text: 'Your average is above 180 mg/dL. Review your recent carbohydrate intake, monitor hydration, and reach out to your doctor for guidance.',
      color: '#991b1b',
      bg: '#fef2f2',
      border: '#fecaca',
      icon: '🚨'
    };
  };

  const rec = getRecommendation(average);

  return (
    <div style={{
      background: rec.bg,
      border: `1px solid ${rec.border}`,
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <span style={{ fontSize: '28px' }}>{rec.icon}</span>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: rec.color, marginBottom: '6px' }}>
            {rec.title}
          </h3>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: 0 }}>
            {rec.text}
          </p>
        </div>
      </div>
    </div>
  );
}