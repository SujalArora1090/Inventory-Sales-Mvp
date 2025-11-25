import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState("staff")
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { username, email, password, securityQuestion: question,
  securityAnswer: answer, });
      console.log(res.data);
      
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
     
      <form onSubmit={handleSubmit}
       className="bg-white rounded-2xl p-8 w-full max-w-sm">
         <h2 className="text-2xl text-center mb-6">User Registration</h2>
        <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} required
        className="w-full mb-4 px-4 py-4 border border-gray-300" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
        className="w-full mb-4 px-4 py-4 border border-gray-300" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
        className="w-full mb-2 px-4 py-4 border border-gray-300"/>
          {/* <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full mb-2 px-4 py-4 border border-gray-300">
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select> */}
      {/* Security Question */}
<select
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  required
  className="w-full mb-2 px-4 py-4 border border-gray-300"
>
  <option value="">Select Security Question</option>
  <option value="Your birth city?">Your birth city?</option>
  <option value="Your school name?">Your school name?</option>
  <option value="Your favorite color?">Your favorite color?</option>
</select>

<input
  type="text"
  placeholder="Your Answer"
  value={answer}
  onChange={(e) => setAnswer(e.target.value)}
  required
  className="w-full mb-2 px-4 py-4 border border-gray-300"
/>

        <button type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-2xl">Register</button>

      </form>
    </div>
  );
};

export default Register;
