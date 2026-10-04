export default function InfoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 p-8 text-center">
      <h3 className="text-4xl font-extrabold text-blue-700 mb-6">
        Track Your Job Applications
      </h3>
      <p className="text-gray-600 max-w-md text-lg mb-6">
        Organize all your job applications in one place. Stay productive, never
        miss an opportunity, and land your dream job faster.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
        alt="Job Tracker"
        className="w-52 mt-6"
      />
    </div>
  )
}
