import { useState } from 'react';
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
    <main className="onboarding-page">
      <form className="onboarding-card" onSubmit={handleOnboardingSubmit}>
        
        <div className="onboarding-heading">
          <span className="section-eyebrow">Del Norte High School</span>
          <h1>Del Norte Navigator</h1>
          <p>
            Welcome to Navigator. Find your classrooms and the walking paths that connect them.
          </p>
          <p>
            All details below are optional.
          </p>
        </div>

        {/* Name Parameter - No "required" flag to allow total bypass flexibility */}
        <div className="input-field-group">
          <label htmlFor="student-name">What is your name?</label>
          <input id="student-name" type="text" placeholder="Enter your name (Optional)" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Grade Option Selection */}
        <div className="input-field-group">
          <label htmlFor="student-grade">Grade</label>
          <select id="student-grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="9">9th Grade (Freshman)</option>
            <option value="10">10th Grade (Sophomore)</option>
            <option value="11">11th Grade (Junior)</option>
            <option value="12">12th Grade (Senior)</option>
          </select>
        </div>

        {/* Morning Location Options */}
        <div className="input-field-group">
          <label htmlFor="morning-spot">Morning Spot</label>
          <select id="morning-spot" value={morningSpot} onChange={(e) => setMorningSpot(e.target.value)}>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
            <option value="Campus Library">Campus Library</option>
            <option value="Main Gymnasium & Athletics">Main Gymnasium & Athletics</option>
            <option value="Student Locker Room Loop">Student Locker Room Loop</option>
          </select>
        </div>

        {/* Office Hours Location Options */}
        <div className="input-field-group">
          <label htmlFor="office-spot">Office Hours Spot</label>
          <select id="office-spot" value={officeHoursSpot} onChange={(e) => setOfficeHoursSpot(e.target.value)}>
            <option value="Campus Library">Campus Library</option>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
          </select>
        </div>

        {/* Lunch Location Options */}
        <div className="input-field-group">
          <label htmlFor="lunch-spot">Lunch Spot</label>
          <select id="lunch-spot" value={lunchSpot} onChange={(e) => setLunchSpot(e.target.value)}>
            <option value="The Hawk Central Quad">The Hawk Central Quad</option>
            <option value="Campus Library">Campus Library</option>
            <option value="Main Gymnasium & Athletics">Main Gymnasium & Athletics</option>
          </select>
        </div>

        {/* Form Submission Button */}
        <button className="compute-route-button" type="submit">
          Explore campus ↗
        </button>

      </form>
    </main>
  );
}

export default OnboardingPage;
