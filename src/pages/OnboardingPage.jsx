import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OnboardingPage() {
  const navigate = useNavigate();

  // Local state tracking hooks capturing user choices dynamically
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('9');
  const [morningSpot, setMorningSpot] = useState('The Hawk Central Quad');
  const [officeHoursSpot, setOfficeHoursSpot] = useState('Campus Library');
  const [lunchSpot, setLunchSpot] = useState('The Hawk Central Quad');

  const handleOnboardingSubmit = (e) => {
    // Intercept standard browser page reload events upon form submission
    e.preventDefault();

    // Cache the answers into the client browser's local memory store (HashMap pattern)
    // Employs a logical short-circuit fallback if the text field is left blank
    localStorage.setItem('studentName', name || 'Del Norte Guest');
    localStorage.setItem('studentGrade', grade);
    localStorage.setItem('morningSpot', morningSpot);
    localStorage.setItem('officeHoursSpot', officeHoursSpot);
    localStorage.setItem('lunchSpot', lunchSpot);
    
    // Set validation token flag to instruct router to store session state
    localStorage.setItem('hasCompletedOnboarding', 'true');

    // Programmatically push user onto map view route path
    navigate('/map');
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      
      <form onSubmit={handleOnboardingSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#0070f3' }}>Welcome to Del Norte Navigator!</h2>
          <p style={{ margin: '0 0 12px 0', color: '#444', fontSize: '14px', lineHeight: '1.4' }}>
            An intelligent campus mapping utility built to parse schedules and generate optimized outdoor walking routes between your classes.
          </p>
          <p style={{ margin: 0, color: '#666', fontSize: '13px', fontStyle: 'italic' }}>
            Please fill out the below information for the best experience. (Optional)
          </p>
        </div>

        {/* Name Parameter - No "required" flag to allow total bypass flexibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>What is your name?</label>
          <input type="text" placeholder="Enter your name (Optional)" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
        </div>

        {/* Grade Option Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Grade</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="9">9th Grade (Freshman)</option>
            <option value="10">10th Grade (Sophomore)</option>
            <option value="11">11th Grade (Junior)</option>
            <option value="12">12th Grade (Senior)</option>
          </select>
        </div>

        {/* Morning Location Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Morning Spot</label>
          <select value={morningSpot} onChange={(e) => setMorningSpot(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
            <option value="Campus Library">Campus Library</option>
            <option value="Main Gymnasium & Athletics">Main Gymnasium & Athletics</option>
            <option value="Student Locker Room Loop">Student Locker Room Loop</option>
          </select>
        </div>

        {/* Office Hours Location Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Office Hours Spot</label>
          <select value={officeHoursSpot} onChange={(e) => setOfficeHoursSpot(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="Campus Library">Campus Library</option>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
          </select>
        </div>

        {/* Lunch Location Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Lunch Spot</label>
          <select value={lunchSpot} onChange={(e) => setLunchSpot(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
            <option value="Campus Library">Campus Library</option>
            <option value="Main Gymnasium & Athletics">Main Gymnasium & Athletics</option>
          </select>
        </div>

        {/* Form Submission Button */}
        <button type="submit" style={{ marginTop: '10px', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(40,167,69,0.3)' }}>
          Get Started
        </button>

      </form>
    </div>
  );
}

export default OnboardingPage;
