import { useNavigate } from 'react-router-dom';

const AppointmentList = ({ appointments }) => {
  const navigate = useNavigate();

  // Filter only pending appointments
  const pendingAppointments = appointments.filter(appt => appt.status === 'Pending');

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">🕒 Pending Appointments</h3>

      {pendingAppointments.length === 0 ? (
        <p className="text-gray-500 italic">No pending appointments at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {pendingAppointments.map((appt) => (
            <li key={appt._id}>
              <div style={{cursor: 'pointer' }}
                 className="bg-white border rounded-lg shadow hover:shadow-lg hover:bg-gray-50 transition duration-200 ease-in-out p-5 cursor-pointer"

                onClick={() => appt.patientId && navigate(`/doctor/patient/${appt.patientId._id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-lg font-bold text-blue-700">
                      {appt.patientId?.name || 'Unknown Patient'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.date).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                    Status: {appt.status}
                  </span>
                </div>
                <div className="mt-2 text-gray-700 text-sm">
                  <strong>Reason:</strong> {appt.reason}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;
