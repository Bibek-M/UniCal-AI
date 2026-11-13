import { apiUrl } from "../../../api";
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../../../utils/auth';

interface UserElement {
  _id: string; 
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  role: 'Student' | 'Faculty' | 'TPO' | 'Admin';
  joinedOn: string;
}

const UsersListCard = () => {
  const [users, setUsers] = useState<UserElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl("/api/users"), {
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const pagePrev = () => index > 1 && setIndex(index - 1);
  const pageNext = () => setIndex(index + 1);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Student': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Faculty': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'TPO': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Admin': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // format "DD MMM YYYY"
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Fallback to raw string if custom format matches
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <div className="w-full text-center py-10 font-medium text-gray-500">Loading user database...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-10 text-rose-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col justify-between max-w-full">
      <div className="w-full overflow-auto max-h-[calc(100vh-250px)] shadow-sm rounded-lg border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700 table-auto">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 bg-gray-50">#</th>
              <th className="px-4 py-3 bg-gray-50">Name</th>
              <th className="px-4 py-3 bg-gray-50">Email</th>
              <th className="px-4 py-3 bg-gray-50">Roll Number</th>
              <th className="px-4 py-3 bg-gray-50">Department</th>
              <th className="px-4 py-3 bg-gray-50">Semester</th>
              <th className="px-4 py-3 bg-gray-50">Role</th>
              <th className="px-4 py-3 bg-gray-50">Joined On</th>
              <th className="px-4 py-3 bg-gray-50 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((elem, i) => (
              <tr key={elem._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-400">{i + 1}</td>
                <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7  rounded-full flex items-center justify-center font-bold text-2xl shrink-0 ${getRoleBadgeClass(elem.role)}`}>
                      {elem.name ? elem.name.charAt(0) : '?'}
                    </div>
                    <span className="truncate max-w-[150px]">{elem.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.email}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.rollNumber || '—'}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.department || '—'}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.semester || '—'}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getRoleBadgeClass(elem.role)}`}>
                    {elem.role}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{formatDate(elem.joinedOn)}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">✏️</button>
                    <button className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex gap-4 mt-4 justify-center shrink-0">
        <button 
          onClick={pagePrev} 
          disabled={index <= 1}
          className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-600 transition"
        >
          Previous
        </button>
        <span className="self-center font-bold text-xs text-gray-600">Page {index}</span>
        <button 
          onClick={pageNext} 
          className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersListCard;
