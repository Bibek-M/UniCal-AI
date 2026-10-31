import { useState } from 'react';

interface UserElement {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  role: 'Student' | 'Faculty' | 'TPO' | 'Admin';
  status: 'Active' | 'Inactive';
  joinedOn: string;
}

const UsersListCard = () => {
  const [imgs] = useState<UserElement[]>([
    { id: '1', name: 'Rahul Sharma', email: 'rahul@giet.edu.in', rollNumber: '2023CSE001', department: 'CSE', semester: '7', role: 'Student', status: 'Active', joinedOn: '12 Aug 2025' },
    { id: '2', name: 'Priya Das', email: 'priya@giet.edu.in', rollNumber: '2023CSE045', department: 'CSE', semester: '7', role: 'Student', status: 'Active', joinedOn: '10 Aug 2025' },
    { id: '3', name: 'Aman Kumar', email: 'aman@giet.edu.in', rollNumber: '2024ECE012', department: 'ECE', semester: '5', role: 'Student', status: 'Active', joinedOn: '05 Sep 2025' },
    { id: '4', name: 'Sneha Patra', email: 'sneha@giet.edu.in', rollNumber: '2024CSE033', department: 'CSE', semester: '5', role: 'Student', status: 'Inactive', joinedOn: '28 Jul 2025' },
    { id: '5', name: 'Faculty - Dr. S. Mohanty', email: 'smohantyygiet.edu.in', rollNumber: '—', department: 'CSE', semester: '—', role: 'Faculty', status: 'Active', joinedOn: '10 Jun 2025' },
    { id: '6', name: 'T&P Office', email: 'tpo@giet.edu.in', rollNumber: '—', department: 'T&P', semester: '—', role: 'TPO', status: 'Active', joinedOn: '01 Jun 2025' },
    { id: '7', name: 'Admin User', email: 'admin@giet.edu.in', rollNumber: '—', department: '—', semester: '—', role: 'Admin', status: 'Active', joinedOn: '15 May 2025' },
    { id: '8', name: 'Rohit Meher', email: 'rohit@giet.edu.in', rollNumber: '2025ME018', department: 'ME', semester: '3', role: 'Student', status: 'Active', joinedOn: '18 Sep 2025' },
    { id: '9', name: 'Ananya Sahu', email: 'ananya@giet.edu.in', rollNumber: '2023ECE027', department: 'ECE', semester: '7', role: 'Student', status: 'Active', joinedOn: '20 Aug 2025' },
    { id: '10', name: 'Vikram Singh', email: 'vikram@giet.edu.in', rollNumber: '2024CSE078', department: 'CSE', semester: '5', role: 'Student', status: 'Inactive', joinedOn: '02 Sep 2025' },
  ]);

  const [index, setIndex] = useState<number>(1);

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

  const getStatusBadgeClass = (status: string) => {
    return status === 'Active'
      ? 'bg-green-50 text-green-600 border border-green-200'
      : 'bg-rose-50 text-rose-600 border border-rose-200';
  };

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
              <th className="px-4 py-3 bg-gray-50">Status</th>
              <th className="px-4 py-3 bg-gray-50">Joined On</th>
              <th className="px-4 py-3 bg-gray-50 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {imgs.map((elem) => (
              <tr key={elem.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-400">{elem.id}</td>
                <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getRoleBadgeClass(elem.role)}`}>
                      {elem.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[150px]">{elem.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.email}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.rollNumber}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.department}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.semester}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getRoleBadgeClass(elem.role)}`}>
                    {elem.role}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(elem.status)}`}>
                    {elem.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">{elem.joinedOn}</td>
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
